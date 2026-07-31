import React, { Suspense, lazy, useEffect, useId, useRef, useState, useCallback } from "react";
import { apiBinaryRequest, apiRequest, ApiRequestError, getFileUploadTargetLabel, logFileUpload, primeSafariAttachmentUploadTransport, resetSafariAttachmentUploadTransport } from "@/lib/queryClient";
import { uint8ArrayToUploadArrayBuffer } from "@/lib/binaryUploadTransport";
import { getTurnstileSiteKeyForClient } from "@/lib/turnstileClient";
import {
  MAX_NOTE_PLAINTEXT_UTF8_BYTES,
  truncateUtf8StringToMaxBytes,
  utf8ByteLength,
} from "@shared/noteSizeLimits";
import {
  formatNoteFileSize,
  noteFileLimitBytesForAccount,
} from "@shared/noteFileLimits";
import {
  NOTE_EXPIRY_DEFAULT_PRESET_ID,
  clampNoteExpiryPresetForAccount,
  noteExpiryPresetIdToSeconds,
  type NoteExpiryPresetId,
} from "@shared/noteExpiry";
import {
  NOTE_READ_LIMIT_DEFAULT,
  clampNoteReadLimitForAccount,
  type NoteReadLimit,
} from "@shared/noteReadLimits";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  clampNoteFileAccessWindowForAccount,
  type NoteFileAccessWindowSeconds,
} from "@shared/noteFileAccess";
import { normalizeUrlFragmentKey } from "@shared/urlFragmentKey";
import { isLocalAiSupported, getLocalAiSupportHint } from "@/utils/localAiCapability";
import { loadClientLLM } from "@/utils/loadClientLLM";
import { MODEL_GEMMA_2_2B, MODEL_QWEN_0_6 } from "@/utils/localAiModelIds";
import { isWebLlmGpuOrDisposeFailure } from "@/utils/webLlmGpuErrors";
import type { ModelLoadProgress } from "@/utils/clientLLM";
import { ensureTurnstileScript } from "@/lib/turnstileScript";
import {
  localAiAnalyzingPromptLabel,
  localAiAnalyzingDetailHint,
  LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS,
  isLocalAiReadyToGenerateProgress,
  localAiWorkingLabel,
} from "@/utils/localAiUxText";
import { useToast } from "@/hooks/use-toast";
import type { PromptTemplate, AiSentenceLengthId } from "@/components/note/promptTemplates";
import { getLocalAiPreloadNetworkPolicy } from "@/utils/localAiNetworkDownloadPolicy";
import {
  Shield,
  Lock,
  ChevronUp,
  Eye,
  Key,
  Settings,
  Sparkles,
  Loader2,
  Paperclip,
  FolderArchive,
  X,
} from "lucide-react";
import { usePasswordBreachCheck } from "@/hooks/usePasswordBreachCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQrShare } from "@/hooks/useQrShare";
import { usePrefillFromFragment } from "@/hooks/usePrefillFromFragment";
import { isCustomizeSheetExperimentEnabled } from "@/features/customizeSheetExperiment";
import { formatAttachmentDisplayName } from "@/utils/formatAttachmentDisplayName";
import { recordWebNoteCreated } from "@/utils/chromeExtensionOnboarding";
import { CreateNoteSuccess } from "./CreateNoteSuccess";
import type { CreatedNoteState } from "./CreateNoteSuccess";
import type { AiPostGenTransform } from "./AiComposer";

const AiComposer = lazy(() =>
  import("./AiComposer").then((m) => ({ default: m.AiComposer })),
);
const CreateNoteDeferredDialogs = lazy(() =>
  import("./CreateNoteDeferredDialogs").then((m) => ({ default: m.CreateNoteDeferredDialogs })),
);
const NoteSettingsPanel = lazy(() =>
  import("./NoteSettingsPanel").then((m) => ({ default: m.NoteSettingsPanel })),
);
const CustomizeSettingsOverlay = lazy(() =>
  import("./CustomizeSettingsOverlay").then((m) => ({ default: m.CustomizeSettingsOverlay })),
);
import { NotePlaintextUtf8Meter } from "./NotePlaintextUtf8Meter";
import { PrefillPartnerBanner } from "./PrefillPartnerBanner";
import { GravityDropZone } from "./GravityDropZone";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";
import { noteHasUnresolvedGuidedPlaceholders } from "@/components/note/localFallbackTemplates";
import {
  generateHostedCloudDraft,
  parseHostedCloudAiError,
} from "@/utils/hostedCloudAi";
import {
  readLocalHostedAiAllowed,
  writeLocalHostedAiAllowed,
} from "@/utils/hostedAiPreference";
import { useAuth } from "@/context/AuthContext";
import { localizedPath } from "@/utils/localizedPath";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import { saveNoteLabel } from "@/utils/noteLabelsStorage";
import type { ReaderLanguageSetting } from "./NoteSettingsPanel";

type PromptTemplatesModule = typeof import("@/components/note/promptTemplates");
let promptTemplatesModulePromise: Promise<PromptTemplatesModule> | null = null;

function loadPromptTemplatesModule(): Promise<PromptTemplatesModule> {
  if (!promptTemplatesModulePromise) {
    promptTemplatesModulePromise = import("@/components/note/promptTemplates");
  }
  return promptTemplatesModulePromise;
}

function encryptedChunkUploadBody(encryptedBytes: Uint8Array): ArrayBuffer {
  return uint8ArrayToUploadArrayBuffer(encryptedBytes);
}

async function uploadEncryptedAttachmentChunk(
  url: string,
  encryptedBytes: Uint8Array,
  headers: Record<string, string>,
  uploadToken: string,
  onUploadProgress?: (progress: { loaded: number; total: number }) => void,
): Promise<void> {
  const chunkIndex = url.match(/\/chunks\/(\d+)$/)?.[1] ?? "?";
  const declaredSize = Number(headers["x-file-chunk-encrypted-size"] ?? NaN);
  const body = encryptedChunkUploadBody(encryptedBytes);
  logFileUpload("info", "uploading chunk", {
    chunkIndex,
    encryptedBytes: encryptedBytes.byteLength,
    bodyBytes: body.byteLength,
    declaredChunkSize: Number.isFinite(declaredSize) ? declaredSize : null,
    sizeMismatch: Number.isFinite(declaredSize) ? declaredSize !== body.byteLength : null,
    url,
  });
  try {
    await apiBinaryRequest<{ encryptedSize: number }>(url, "PUT", body, headers, {
      uploadToken,
      onUploadProgress,
    });
    logFileUpload("info", "chunk uploaded", { chunkIndex, url });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      const safariChunkMismatch =
        error.status === 400 && /File chunk size mismatch/i.test(error.bodyText);
      logFileUpload("error", "chunk rejected by server", {
        chunkIndex,
        url,
        status: error.status,
        bodyPreview: error.bodyText.slice(0, 500),
        safariChunkMismatch,
      });
      if (!safariChunkMismatch) {
        throw error;
      }
      logFileUpload("warn", "Safari chunk size mismatch — retrying once", {
        chunkIndex,
        url,
      });
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      try {
        await apiBinaryRequest<{ encryptedSize: number }>(url, "PUT", body.slice(0), headers, {
          uploadToken,
          onUploadProgress,
        });
        logFileUpload("info", "chunk uploaded after Safari size-mismatch retry", {
          chunkIndex,
          url,
        });
        return;
      } catch (retryError) {
        logFileUpload("error", "chunk Safari size-mismatch retry failed", {
          chunkIndex,
          url,
          error:
            retryError instanceof ApiRequestError
              ? { status: retryError.status, bodyPreview: retryError.bodyText.slice(0, 500) }
              : retryError instanceof Error
                ? retryError.message
                : String(retryError),
        });
        throw retryError;
      }
    }
    logFileUpload("warn", "chunk upload failed, retrying once", {
      chunkIndex,
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    try {
      await apiBinaryRequest<{ encryptedSize: number }>(url, "PUT", body.slice(0), headers, {
        uploadToken,
        onUploadProgress,
      });
      logFileUpload("info", "chunk uploaded after retry", { chunkIndex, url });
    } catch (retryError) {
      logFileUpload("error", "chunk retry failed", {
        chunkIndex,
        url,
        error:
          retryError instanceof ApiRequestError
            ? { status: retryError.status, bodyPreview: retryError.bodyText.slice(0, 500) }
            : retryError instanceof Error
              ? retryError.message
              : String(retryError),
      });
      throw retryError;
    }
  }
}

function localAiDialogPrimaryLine(progress: { text: string } | null): string {
  const t = progress?.text?.trim() ?? "";
  if (!t) return localAiWorkingLabel();
  // After load, WebLLM reports ready; keep "analyzing" until streaming updates the headline.
  if (isLocalAiReadyToGenerateProgress(t)) return localAiAnalyzingPromptLabel();
  return t;
}

function translatedExpiryLabel(expiryValue: NoteExpiryPresetId, t: Record<string, string>): string {
  if (expiryValue === "5m") return t.expiry5m;
  if (expiryValue === "10m") return t.expiry10m;
  if (expiryValue === "30m") return t.expiry30m;
  if (expiryValue === "1h") return t.expiry1h;
  if (expiryValue === "2h") return t.expiry2h;
  if (expiryValue === "8h") return t.expiry8h;
  if (expiryValue === "1d") return t.expiry1d;
  if (expiryValue === "3d") return t.expiry3d;
  if (expiryValue === "7d") return t.expiry7d;
  if (expiryValue === "14d") return t.expiry14d;
  if (expiryValue === "30d") return t.expiry30d;
  return expiryValue;
}

interface CreateNoteProps {
  onSuccessStateChange?: (isSuccess: boolean) => void;
  mode?: "note" | "file-transfer";
}

type AccountType = "free" | "personal_premium" | "business_premium";

const CREATE_NOTE_AUTH_DRAFT_KEY = "privatenote:create-note-auth-draft:v1";
const CREATE_NOTE_AUTH_DRAFT_TTL_MS = 30 * 60 * 1000;
const CLOUD_ASSIST_MODE_SESSION_KEY = "privatenote:cloud-assist-mode-session:v1";

type CreateNoteAuthDraft = {
  v: 1;
  expiresAt: number;
  noteContent: string;
  isAiMode: boolean;
  aiPrompt: string;
  aiEnhancementType: "improve" | "summarize" | "secure" | "ask";
  showPrompt: boolean;
  originalPrompt: string;
  userPromptHistory: string[];
  transformHistory: AiPostGenTransform[];
  aiDraftAccepted: boolean;
  selectedTemplateId: string | null;
  aiSentenceLength: AiSentenceLengthId;
  expiryValue: NoteExpiryPresetId;
  readCount: NoteReadLimit;
  fileAccessWindowSeconds: NoteFileAccessWindowSeconds;
  readerLanguage: ReaderLanguageSetting;
  preferHostedCloudAfterLocalFailure: boolean;
  cloudAssistConsentGiven: boolean;
};

type CloudAssistModeSession = {
  preferHosted: boolean;
  consentGiven: boolean;
};

function readCloudAssistModeSession(): CloudAssistModeSession {
  try {
    const raw = window.sessionStorage.getItem(CLOUD_ASSIST_MODE_SESSION_KEY);
    if (!raw) return { preferHosted: false, consentGiven: false };
    const parsed = JSON.parse(raw) as Partial<CloudAssistModeSession>;
    return {
      preferHosted: parsed.preferHosted === true,
      consentGiven: parsed.consentGiven === true,
    };
  } catch {
    return { preferHosted: false, consentGiven: false };
  }
}

function writeCloudAssistModeSession(preferHosted: boolean, consentGiven: boolean): void {
  try {
    window.sessionStorage.setItem(
      CLOUD_ASSIST_MODE_SESSION_KEY,
      JSON.stringify({ preferHosted, consentGiven } satisfies CloudAssistModeSession),
    );
  } catch {
    /* private mode */
  }
}

function isReaderLanguageSetting(value: unknown): value is ReaderLanguageSetting {
  return value === "auto" || (typeof value === "string" && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage));
}

function normalizeAccountType(value: unknown): AccountType {
  if (value === "personal_premium" || value === "pro" || value === "premium") return "personal_premium";
  if (value === "business_premium" || value === "business") return "business_premium";
  return "free";
}

function readCreateNoteAuthDraft(): CreateNoteAuthDraft | null {
  try {
    const raw = window.sessionStorage.getItem(CREATE_NOTE_AUTH_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CreateNoteAuthDraft>;
    if (parsed.v !== 1 || typeof parsed.expiresAt !== "number") return null;
    if (Date.now() > parsed.expiresAt) {
      window.sessionStorage.removeItem(CREATE_NOTE_AUTH_DRAFT_KEY);
      return null;
    }
    if (typeof parsed.noteContent !== "string") return null;
    return {
      v: 1,
      expiresAt: parsed.expiresAt,
      noteContent: parsed.noteContent,
      isAiMode: parsed.isAiMode === true,
      aiPrompt: typeof parsed.aiPrompt === "string" ? parsed.aiPrompt : "",
      aiEnhancementType:
        parsed.aiEnhancementType === "improve" ||
        parsed.aiEnhancementType === "summarize" ||
        parsed.aiEnhancementType === "secure" ||
        parsed.aiEnhancementType === "ask"
          ? parsed.aiEnhancementType
          : "ask",
      showPrompt: parsed.showPrompt !== false,
      originalPrompt: typeof parsed.originalPrompt === "string" ? parsed.originalPrompt : "",
      userPromptHistory: Array.isArray(parsed.userPromptHistory)
        ? parsed.userPromptHistory.filter((item): item is string => typeof item === "string")
        : [],
      transformHistory: Array.isArray(parsed.transformHistory)
        ? parsed.transformHistory.filter(
            (item): item is AiPostGenTransform =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as AiPostGenTransform).kind === "string" &&
              typeof (item as AiPostGenTransform).contentBefore === "string",
          )
        : [],
      aiDraftAccepted: parsed.aiDraftAccepted === true,
      selectedTemplateId:
        typeof parsed.selectedTemplateId === "string" || parsed.selectedTemplateId === null
          ? parsed.selectedTemplateId
          : "ask-anything",
      aiSentenceLength:
        parsed.aiSentenceLength === "auto" ||
        parsed.aiSentenceLength === "1-2" ||
        parsed.aiSentenceLength === "2-3" ||
        parsed.aiSentenceLength === "4-6" ||
        parsed.aiSentenceLength === "7-10"
          ? parsed.aiSentenceLength
          : "auto",
      expiryValue:
        parsed.expiryValue === "5m" ||
        parsed.expiryValue === "10m" ||
        parsed.expiryValue === "30m" ||
        parsed.expiryValue === "1h" ||
        parsed.expiryValue === "2h" ||
        parsed.expiryValue === "8h" ||
        parsed.expiryValue === "1d" ||
        parsed.expiryValue === "3d" ||
        parsed.expiryValue === "7d" ||
        parsed.expiryValue === "14d" ||
        parsed.expiryValue === "30d"
          ? (parsed.expiryValue as NoteExpiryPresetId)
          : NOTE_EXPIRY_DEFAULT_PRESET_ID,
      readCount:
        parsed.readCount === 1 || parsed.readCount === 2 || parsed.readCount === 3 || parsed.readCount === 5
          ? parsed.readCount
          : NOTE_READ_LIMIT_DEFAULT,
      fileAccessWindowSeconds:
        parsed.fileAccessWindowSeconds === 15 * 60 ||
        parsed.fileAccessWindowSeconds === 30 * 60 ||
        parsed.fileAccessWindowSeconds === 60 * 60
          ? (parsed.fileAccessWindowSeconds as NoteFileAccessWindowSeconds)
          : NOTE_FILE_ACCESS_DEFAULT_SECONDS,
      readerLanguage:
        isReaderLanguageSetting(parsed.readerLanguage) ? parsed.readerLanguage : "auto",
      preferHostedCloudAfterLocalFailure: parsed.preferHostedCloudAfterLocalFailure === true,
      cloudAssistConsentGiven: parsed.cloudAssistConsentGiven === true,
    };
  } catch {
    return null;
  }
}

function clearCreateNoteAuthDraft(): void {
  try {
    window.sessionStorage.removeItem(CREATE_NOTE_AUTH_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export const CreateNote: React.FC<CreateNoteProps> = ({ onSuccessStateChange, mode = "note" }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isFileTransferMode = mode === "file-transfer";

  // ── Note content ──────────────────────────────────────────────────────────
  const [noteContent, setNoteContent] = useState("");

  // ── Submission ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentProgress, setAttachmentProgress] = useState<{
    phase: "prepare" | "encrypt" | "upload" | "finalize";
    progress: number;
    detail?: string;
  } | null>(null);

  // ── Success state ─────────────────────────────────────────────────────────
  const [createdNote, setCreatedNote] = useState<CreatedNoteState | null>(null);
  const noteUrl = createdNote?.url ?? null;
  const [showSuccessQr, setShowSuccessQr] = useState(false);
  const [showSuccessHelp, setShowSuccessHelp] = useState(false);
  const [showQrHelp, setShowQrHelp] = useState(false);
  const [selectedDoDont, setSelectedDoDont] = useState<"do" | "dont" | null>(null);
  const [successLinkCopied, setSuccessLinkCopied] = useState(false);
  const successQrSectionRef = useRef<HTMLDivElement | null>(null);

  // ── Mode ──────────────────────────────────────────────────────────────────
  const [isAiMode, setIsAiMode] = useState(false);
  const aiComposerAnchorRef = useRef<HTMLDivElement | null>(null);

  // ── AI state ──────────────────────────────────────────────────────────────
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [aiEnhancementType, setAiEnhancementType] = useState<
    "improve" | "summarize" | "secure" | "ask"
  >("ask");
  const [aiProgress, setAiProgress] = useState<ModelLoadProgress | null>(null);
  const [isAiModelLoading, setIsAiModelLoading] = useState(false);
  const [aiModelProgress, setAiModelProgress] = useState<{
    progress: number;
    text: string;
    detail?: string;
  } | null>(null);
  const [showTemplateOfferPrompt, setShowTemplateOfferPrompt] = useState(false);
  const [preferHostedCloudAfterLocalFailure, setPreferHostedCloudAfterLocalFailure] = useState(
    () => readCloudAssistModeSession().preferHosted,
  );
  const [cellularPreloadConfirmOpen, setCellularPreloadConfirmOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>("ask-anything");
  const [aiSentenceLength, setAiSentenceLength] = useState<AiSentenceLengthId>("auto");
  const [showPrompt, setShowPrompt] = useState<boolean>(true);
  const [originalPrompt, setOriginalPrompt] = useState<string>("");
  const [userPromptHistory, setUserPromptHistory] = useState<string[]>([]);
  const [transformHistory, setTransformHistory] = useState<AiPostGenTransform[]>([]);
  const [aiDraftAccepted, setAiDraftAccepted] = useState(false);
  const [hostedCloudAiRemaining, setHostedCloudAiRemaining] = useState<number | null>(null);
  const [hostedCloudAiLimit, setHostedCloudAiLimit] = useState(3);
  const [hostedCloudAiStatusText, setHostedCloudAiStatusText] = useState<string | null>(null);
  const [allowHostedAi, setAllowHostedAi] = useState(() => readLocalHostedAiAllowed());
  const [cloudAssistConsentGiven, setCloudAssistConsentGiven] = useState(
    () => readCloudAssistModeSession().consentGiven,
  );
  const hostedAiPrefHydratedRef = useRef(false);
  /** User chose Cloud Assist in this tab; account prefs must not override that until a new visit. */
  const cloudAssistModeTouchedInSessionRef = useRef(readCloudAssistModeSession().preferHosted);

  const turnstileSiteKey = getTurnstileSiteKeyForClient();
  /** True when server KV says this client must pass Turnstile (adaptive — rate limit or high AI-note volume). */
  const [aiTurnstileChallengeRequired, setAiTurnstileChallengeRequired] = useState(false);
  const shouldShowAiTurnstile = isAiMode && !!turnstileSiteKey && aiTurnstileChallengeRequired;
  const [aiTurnstileToken, setAiTurnstileToken] = useState<string | null>(null);
  const [aiTurnstileReady, setAiTurnstileReady] = useState(false);
  const [aiTurnstileError, setAiTurnstileError] = useState<string | null>(null);
  const aiTurnstileWidgetIdRef = useRef<string | null>(null);

  // ── Anti-bot soft friction ─────────────────────────────────────────────────
  // Track when the form first became visible so rapid-fire bot submissions are blocked.
  const pageLoadTimeRef = useRef<number>(Date.now());
  // Honeypot: a hidden field real users never fill; bots often do.
  const [honeypotValue, setHoneypotValue] = useState("");

  // ── Password & settings ───────────────────────────────────────────────────
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordSource, setPasswordSource] = useState<"simple" | "strong" | "manual" | null>(
    null,
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customizeSheetOpen, setCustomizeSheetOpen] = useState(false);
  const customizeSheetExperiment = isCustomizeSheetExperimentEnabled();
  const isMobile = useIsMobile();
  const [expiryValue, setExpiryValue] = useState<NoteExpiryPresetId>(NOTE_EXPIRY_DEFAULT_PRESET_ID);
  const [notifyOnOpen, setNotifyOnOpen] = useState(false);
  const [notifyOnDestroyed, setNotifyOnDestroyed] = useState(false);
  const [restrictRecipientEmail, setRestrictRecipientEmail] = useState(false);
  const [requireRecipientVerification, setRequireRecipientVerification] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [noteLabel, setNoteLabel] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [accountEmailNotifications, setAccountEmailNotifications] = useState(false);
  const [accountEmailVerified, setAccountEmailVerified] = useState(false);
  const [premiumStatusLoading, setPremiumStatusLoading] = useState(false);
  const [readCount, setReadCount] = useState<NoteReadLimit>(NOTE_READ_LIMIT_DEFAULT);
  const [fileAccessWindowSeconds, setFileAccessWindowSeconds] =
    useState<NoteFileAccessWindowSeconds>(NOTE_FILE_ACCESS_DEFAULT_SECONDS);
  const [readerLanguage, setReaderLanguage] = useState<ReaderLanguageSetting>("auto");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreparingFolder, setIsPreparingFolder] = useState(false);
  const [folderInputMounted, setFolderInputMounted] = useState(false);
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const fileTransferFileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const isPasswordProtected = password.trim().length > 0;
  const isPremiumUser = accountType === "personal_premium" || accountType === "business_premium";
  const canAttachFiles = Boolean(user);
  const canNotifyOnOpen = isPremiumUser && accountEmailNotifications && accountEmailVerified;
  const fileLimitBytes = noteFileLimitBytesForAccount(isPremiumUser);
  const attachFileReturnTo =
    typeof window === "undefined"
      ? localizedPath("/", language)
      : `${window.location.pathname}${window.location.search}` || localizedPath("/", language);
  const attachFileSignInHref = `${localizedPath("/auth/sign-in", language)}?purpose=file_attach&returnTo=${encodeURIComponent(attachFileReturnTo)}`;
  const cloudAssistSignInHref = `${localizedPath("/auth/sign-in", language)}?purpose=cloud_assist&returnTo=${encodeURIComponent(attachFileReturnTo)}`;

  // Prefetch sign-in chunk for signed-out attach/AI flows so /auth/sign-in is not a blank Suspense gap.
  useEffect(() => {
    if (canAttachFiles) return;
    void import("@/pages/AuthSignIn");
  }, [canAttachFiles]);

  const { toast } = useToast();

  const secondaryActionButtonClass =
    "flex min-w-0 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/80 sm:px-5";

  const saveAuthRedirectDraft = useCallback(
    (overrides?: Partial<CreateNoteAuthDraft>) => {
      try {
        const draft: CreateNoteAuthDraft = {
          v: 1,
          expiresAt: Date.now() + CREATE_NOTE_AUTH_DRAFT_TTL_MS,
          noteContent,
          isAiMode,
          aiPrompt,
          aiEnhancementType,
          showPrompt,
          originalPrompt,
          userPromptHistory,
          transformHistory,
          aiDraftAccepted,
          selectedTemplateId,
          aiSentenceLength,
          expiryValue,
          readCount,
          fileAccessWindowSeconds,
          readerLanguage,
          preferHostedCloudAfterLocalFailure,
          cloudAssistConsentGiven,
          ...overrides,
        };
        window.sessionStorage.setItem(CREATE_NOTE_AUTH_DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* Best effort: navigation should still work if storage is unavailable. */
      }
    },
    [
      aiDraftAccepted,
      aiEnhancementType,
      aiPrompt,
      aiSentenceLength,
      cloudAssistConsentGiven,
      expiryValue,
      fileAccessWindowSeconds,
      isAiMode,
      noteContent,
      originalPrompt,
      preferHostedCloudAfterLocalFailure,
      readerLanguage,
      readCount,
      selectedTemplateId,
      showPrompt,
      transformHistory,
      userPromptHistory,
    ],
  );

  const redirectToCloudAssistSignIn = useCallback(
    (overrides?: Partial<CreateNoteAuthDraft>) => {
      saveAuthRedirectDraft({
        isAiMode: true,
        preferHostedCloudAfterLocalFailure: true,
        cloudAssistConsentGiven: true,
        ...overrides,
      });
      window.location.href = cloudAssistSignInHref;
    },
    [cloudAssistSignInHref, saveAuthRedirectDraft],
  );

  const handleAttachFileClick = () => {
    if (!canAttachFiles) {
      saveAuthRedirectDraft();
      window.location.href = attachFileSignInHref;
      return;
    }
    fileInputRef.current?.click();
  };

  const handleAttachFolderClick = () => {
    if (!canAttachFiles) {
      saveAuthRedirectDraft();
      window.location.href = attachFileSignInHref;
      return;
    }
    if (!folderInputMounted) {
      setFolderInputMounted(true);
      requestAnimationFrame(() => folderInputRef.current?.click());
      return;
    }
    folderInputRef.current?.click();
  };

  const handleAttachFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) return;
    if (file.size > fileLimitBytes) {
      toast({
        title: t.fileTooLarge,
        description: (
          t.fileTooLargeDescription
        ).replace("{limit}", formatNoteFileSize(fileLimitBytes)),
        variant: "destructive",
      });
      return;
    }
    setSelectedFile(file);
  };

  const handleAttachFolderSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    setIsPreparingFolder(true);
    try {
      const { createStoredZipFromFiles } = await import("@/utils/createStoredZip");
      const zippedFolder = await createStoredZipFromFiles(files);
      if (zippedFolder.size > fileLimitBytes) {
        toast({
          title: t.fileTooLarge,
          description: t.fileTooLargeDescription.replace(
            "{limit}",
            formatNoteFileSize(fileLimitBytes),
          ),
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(zippedFolder);
    } catch (error) {
      toast({
        title: t.sftFolderPrepareFailedTitle,
        description:
          error instanceof Error && error.message
            ? error.message
            : t.sftFolderPrepareFailedDescription,
        variant: "destructive",
      });
    } finally {
      setIsPreparingFolder(false);
    }
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragOver(true);
  };
  const handleDropZoneDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFileDragOver(false);
    }
  };
  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!canAttachFiles) {
      saveAuthRedirectDraft();
      window.location.href = attachFileSignInHref;
      return;
    }
    if (file.size > fileLimitBytes) {
      toast({
        title: t.fileTooLarge,
        description: (
          t.fileTooLargeDescription
        ).replace("{limit}", formatNoteFileSize(fileLimitBytes)),
        variant: "destructive",
      });
      return;
    }
    setSelectedFile(file);
  };

  const attachFileButtonLabel = selectedFile
    ? formatAttachmentDisplayName(selectedFile.name)
    : isFileTransferMode
      ? t.sftAttachFile
      : t.attachFile;

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { passwordStrength, breachState, breachCount } = usePasswordBreachCheck(password);
  const { downloadQrCode, shareQrCode } = useQrShare({
    noteUrl,
    showSuccessQr,
    successQrSectionRef,
  });

  // ── URL-fragment prefill (e.g. from passwrds.lu) ──────────────────────────
  // Reads #text=<url-encoded-secret> on mount, removes it from the address bar
  // before paint, and pre-populates the textarea. The plaintext never leaves
  // the browser until the user explicitly clicks "Share Private Note".
  const {
    prefillText,
    referrer: prefillReferrer,
    showBanner: showPrefillBanner,
    dismissBanner: dismissPrefillBanner,
    resetPrefill,
  } = usePrefillFromFragment();

  const prefillAppliedRef = useRef(false);
  useEffect(() => {
    if (prefillText && !prefillAppliedRef.current) {
      prefillAppliedRef.current = true;
      const { text } = truncateUtf8StringToMaxBytes(prefillText, MAX_NOTE_PLAINTEXT_UTF8_BYTES);
      setNoteContent(text);
    }
  }, [prefillText]);

  const authDraftRestoredRef = useRef(false);
  useEffect(() => {
    if (authDraftRestoredRef.current || prefillText) return;
    authDraftRestoredRef.current = true;
    const draft = readCreateNoteAuthDraft();
    if (!draft) return;
    clearCreateNoteAuthDraft();

    const { text } = truncateUtf8StringToMaxBytes(
      draft.noteContent,
      MAX_NOTE_PLAINTEXT_UTF8_BYTES,
    );
    setNoteContent(text);
    setIsAiMode(draft.isAiMode);
    setAiPrompt(draft.aiPrompt);
    setAiEnhancementType(draft.aiEnhancementType);
    setShowPrompt(draft.showPrompt);
    setOriginalPrompt(draft.originalPrompt);
    setUserPromptHistory(draft.userPromptHistory);
    setTransformHistory(draft.transformHistory);
    setAiDraftAccepted(draft.aiDraftAccepted);
    setSelectedTemplateId(draft.selectedTemplateId);
    setAiSentenceLength(draft.aiSentenceLength);
    setExpiryValue(draft.expiryValue);
    setReadCount(draft.readCount);
    setFileAccessWindowSeconds(draft.fileAccessWindowSeconds);
    setReaderLanguage(draft.readerLanguage);
    if (draft.preferHostedCloudAfterLocalFailure) {
      setPreferHostedCloudAfterLocalFailure(true);
      setCloudAssistConsentGiven(draft.cloudAssistConsentGiven);
      cloudAssistModeTouchedInSessionRef.current = true;
      writeCloudAssistModeSession(true, draft.cloudAssistConsentGiven);
    }
  }, [prefillText]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setAccountType("free");
      setAccountEmailNotifications(false);
      setAccountEmailVerified(false);
      setNotifyOnOpen(false);
      setNotifyOnDestroyed(false);
      setRestrictRecipientEmail(false);
      setRequireRecipientVerification(false);
      setRecipientEmail("");
      setNoteLabel("");
      setPremiumStatusLoading(false);
      return;
    }

    setPremiumStatusLoading(true);
    void (async () => {
      try {
        const summary = await apiRequest<{
          ok?: boolean;
          accountType?: unknown;
          plan?: unknown;
          emailNotifications?: boolean;
          emailVerified?: boolean;
        }>("/api/auth/account/summary", "GET");
        if (cancelled) return;
        setAccountType(normalizeAccountType(summary.accountType ?? summary.plan));
        setAccountEmailNotifications(summary.emailNotifications === true);
        setAccountEmailVerified(summary.emailVerified === true);
      } catch {
        if (!cancelled) {
          setAccountType("free");
          setAccountEmailNotifications(false);
          setAccountEmailVerified(false);
          setNotifyOnOpen(false);
          setNotifyOnDestroyed(false);
          setRestrictRecipientEmail(false);
          setRequireRecipientVerification(false);
          setRecipientEmail("");
          setNoteLabel("");
        }
      } finally {
        if (!cancelled) setPremiumStatusLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (premiumStatusLoading) return;
    setExpiryValue((current) => clampNoteExpiryPresetForAccount(current, isPremiumUser));
    setReadCount((current) => clampNoteReadLimitForAccount(current, isPremiumUser));
    setFileAccessWindowSeconds((current) =>
      clampNoteFileAccessWindowForAccount(current, isPremiumUser),
    );
  }, [isPremiumUser, premiumStatusLoading]);

  useEffect(() => {
    if (!canAttachFiles && selectedFile) {
      setSelectedFile(null);
    }
  }, [canAttachFiles, selectedFile]);

  useEffect(() => {
    if (!canNotifyOnOpen && notifyOnOpen) {
      setNotifyOnOpen(false);
    }
    if (!canNotifyOnOpen && notifyOnDestroyed) {
      setNotifyOnDestroyed(false);
    }
  }, [canNotifyOnOpen, notifyOnDestroyed, notifyOnOpen]);

  useEffect(() => {
    if (isPremiumUser) return;
    if (restrictRecipientEmail) setRestrictRecipientEmail(false);
    if (requireRecipientVerification) setRequireRecipientVerification(false);
    if (recipientEmail) setRecipientEmail("");
    if (readerLanguage !== "auto") setReaderLanguage("auto");
  }, [
    isPremiumUser,
    recipientEmail,
    readerLanguage,
    requireRecipientVerification,
    restrictRecipientEmail,
  ]);

  useEffect(() => {
    if (isPremiumUser) return;
    if (noteLabel) setNoteLabel("");
  }, [isPremiumUser, noteLabel]);

  // ── Content helpers ───────────────────────────────────────────────────────
  const setNoteContentFromAiOutput = useCallback(
    (raw: string) => {
      const { text, truncated } = truncateUtf8StringToMaxBytes(raw, MAX_NOTE_PLAINTEXT_UTF8_BYTES);
      if (truncated) {
        toast({
          title: t.toastContentTrimmedTitle,
          description: t.toastAiOutputTrimmedDesc.replace(
            "{limit}",
            String(MAX_NOTE_PLAINTEXT_UTF8_BYTES / 1024),
          ),
        });
      }
      setNoteContent(text);
    },
    [toast, t],
  );

  const applyNoteContentInput = useCallback(
    (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      maxBytes: number,
      trimDescription: string,
    ) => {
      const next = e.target.value;
      const { text, truncated } = truncateUtf8StringToMaxBytes(next, maxBytes);
      setNoteContent(text);
      if (!truncated) return;
      const inputType = (e.nativeEvent as InputEvent).inputType ?? "";
      if (inputType === "insertFromPaste" || inputType === "insertFromDrop") {
        toast({ title: t.toastContentTrimmedTitle, description: trimDescription });
      }
    },
    [toast],
  );

  // ── Local AI helpers ──────────────────────────────────────────────────────
  const offerTemplateFallback = useCallback(() => {
    setPreferHostedCloudAfterLocalFailure(true);
    setShowTemplateOfferPrompt(true);
    setIsAiMode(true);
    setSelectedTemplateId((prev) => prev ?? "ask-anything");
    setShowPrompt(true);
  }, []);

  const clearLocalAiDownloadStateSilently = useCallback(async () => {
    try {
      const llm = await loadClientLLM();
      await llm.resetLocalAiLoadState(undefined);
    } catch (error) {
      console.warn("[AI] Failed to clear local AI download state after failure:", error);
    }
  }, []);

  const ensureFreeLocalModel = useCallback(
    async (onProgress?: (progress: { progress: number; text: string }) => void) => {
      if (!isLocalAiSupported()) {
        throw new Error(
          getLocalAiSupportHint() ??
            "On-device AI isn't available right now. If a previous attempt failed, try resetting and starting again."
        );
      }
      const llm = await loadClientLLM();
      const modelId = await llm.getRecommendedLocalModelId();
      if (!modelId) {
        throw new Error(getLocalAiSupportHint() ?? "On-device AI is not available on this device.");
      }
      try {
        await llm.initializeClientLLM(onProgress, modelId);
      } catch (error) {
        if (modelId === MODEL_GEMMA_2_2B) {
          console.warn("[AI] Gemma 2 failed; falling back to compact local model:", error);
          llm.clearEngine();
          await llm.initializeClientLLM(onProgress, MODEL_QWEN_0_6);
          return;
        }
        throw error;
      }
    },
    [],
  );

  const startFreeModelDownload = useCallback(async () => {
    const llm = await loadClientLLM();
    if (llm.isEngineLoaded() || isAiModelLoading) return;
    setIsAiModelLoading(true);
    setAiModelProgress({ progress: 0, text: t.aiComposerGettingReady });
    try {
      await ensureFreeLocalModel((progress) => setAiModelProgress(progress));
      setAiModelProgress(null);
    } catch (error) {
      console.warn("[AI] Failed to preload free model:", error);
      await clearLocalAiDownloadStateSilently();
      setAiModelProgress(null);
      offerTemplateFallback();
    } finally {
      setIsAiModelLoading(false);
    }
  }, [ensureFreeLocalModel, isAiModelLoading, offerTemplateFallback, clearLocalAiDownloadStateSilently]);

  useEffect(() => {
    if (!isAiMode || selectedTemplateId !== "ask-anything") return;
    let cancelled = false;
    void loadPromptTemplatesModule().then((m) => {
      if (cancelled) return;
      const templates = m.getPromptTemplatesForLanguage(language);
      const tmpl = templates.find((x) => x.id === "ask-anything");
      const base = tmpl?.userTemplate ?? "";
      const suffix = m.formatSentenceLengthUserSuffix(aiSentenceLength, language);
      setAiPrompt(suffix ? `${base}\n${suffix}` : base);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- language-only resets scaffold (prior behavior)
  }, [language]);

  useEffect(() => {
    if (!isAiMode || selectedTemplateId !== "ask-anything") return;
    let cancelled = false;
    void loadPromptTemplatesModule().then((m) => {
      if (cancelled) return;
      setAiPrompt((prev) => {
        if (prev.trim() !== "") return prev;
        const templates = m.getPromptTemplatesForLanguage(language);
        const tmpl = templates.find((x) => x.id === "ask-anything");
        const base = tmpl?.userTemplate ?? "";
        const suffix = m.formatSentenceLengthUserSuffix(aiSentenceLength, language);
        return suffix ? `${base}\n${suffix}` : base;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [isAiMode, language, selectedTemplateId, aiSentenceLength]);

  const enterAiMode = useCallback(() => {
    setIsAiMode(true);
    if (!isLocalAiSupported()) return;
    void (async () => {
      const llm = await loadClientLLM();
      if (llm.isEngineLoaded()) return;
      if (getLocalAiPreloadNetworkPolicy() === "confirm") {
        setCellularPreloadConfirmOpen(true);
        return;
      }
      void startFreeModelDownload();
    })();
  }, [startFreeModelDownload]);

  const runFreeLocalEnhancement = async (
    content: string,
    enhancementType: "improve" | "summarize" | "secure" | "ask" | "simplify",
    options?: { useBuiltTemplatePrompt?: boolean; promptAnalysisDwellMs?: number },
  ): Promise<string> => {
    setAiProgress({ progress: 0, text: t.aiComposerInitializingAi });
    try {
      await ensureFreeLocalModel((progress) => setAiProgress(progress));
      const m = await loadPromptTemplatesModule();
      const promptTemplates = m.getPromptTemplatesForLanguage(language);
      const selectedTemplate = promptTemplates.find((t) => t.id === selectedTemplateId);
      const useBuild = Boolean(options?.useBuiltTemplatePrompt && selectedTemplate);
      const enhancementTypeForModel =
        useBuild && selectedTemplate ? selectedTemplate.enhancementType : enhancementType;
      const dwell = options?.promptAnalysisDwellMs ?? 0;
      if (dwell > 0) {
        setAiProgress({
          progress: 15,
          text: localAiAnalyzingPromptLabel(),
          detail: localAiAnalyzingDetailHint(),
        });
        await new Promise((r) => setTimeout(r, dwell));
      }
      const baseOpts = selectedTemplate
        ? { templateName: selectedTemplate.name, templateDescription: selectedTemplate.description }
        : undefined;
      const llm = await loadClientLLM();
      const { getLoadedModelIdWebLLM } = await import("@/utils/webllm-engine");
      const modelId = getLoadedModelIdWebLLM() ?? (await llm.getRecommendedLocalModelId());
      if (!modelId) {
        throw new Error(getLocalAiSupportHint() ?? "On-device AI is not available on this device.");
      }
      const finalUserMessage =
        useBuild && selectedTemplate
          ? m.buildPromptFromTemplate(
              selectedTemplate,
              content.trim(),
              modelId,
              aiSentenceLength,
              language,
            )
          : undefined;
      return await llm.enhanceNoteClientSide(content, enhancementTypeForModel, (p) => setAiProgress(p), {
        ...baseOpts,
        ...(finalUserMessage ? { finalUserMessage } : {}),
        templateId: selectedTemplateId ?? undefined,
        promptLocale: language,
      });
    } catch (error) {
      if (isWebLlmGpuOrDisposeFailure(error)) {
        (await loadClientLLM()).clearEngine();
      }
      console.warn("[AI] Local AI failed:", error);
      offerTemplateFallback();
      throw error;
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    setShowSuccessQr(false);
    setShowSuccessHelp(false);
    setShowQrHelp(false);
    setSuccessLinkCopied(false);
    setSelectedDoDont(null);
  }, [noteUrl]);

  useEffect(() => {
    onSuccessStateChange?.(!!noteUrl);
  }, [noteUrl, onSuccessStateChange]);

  useEffect(() => {
    let cancelled = false;
    if (!isAiMode || !turnstileSiteKey) {
      setAiTurnstileChallengeRequired(false);
      return;
    }
    void (async () => {
      try {
        const data = await apiRequest<{ required: boolean }>("/api/notes/turnstile-challenge", "GET");
        if (!cancelled) setAiTurnstileChallengeRequired(Boolean(data.required));
      } catch {
        if (!cancelled) setAiTurnstileChallengeRequired(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAiMode, turnstileSiteKey]);

  useEffect(() => {
    if (!isAiMode) return;
    let cancelled = false;
    // Wait for AiComposer to mount and layout (templates, trust panel) so scroll target has height.
    const t = window.setTimeout(() => {
      if (cancelled) return;
      const el = aiComposerAnchorRef.current;
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [isAiMode]);

  useEffect(() => {
    if (!shouldShowAiTurnstile) {
      setAiTurnstileReady(false);
      setAiTurnstileToken(null);
      setAiTurnstileError(null);
      if (aiTurnstileWidgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.reset(aiTurnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        aiTurnstileWidgetIdRef.current = null;
      }
      return;
    }

    // Success view replaces the form; re-init when user starts another note.
    if (createdNote) {
      setAiTurnstileReady(false);
      setAiTurnstileToken(null);
      if (aiTurnstileWidgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.reset(aiTurnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        aiTurnstileWidgetIdRef.current = null;
      }
      return;
    }

    let cancelled = false;
    const siteKey = turnstileSiteKey!;

    const initTurnstile = () => {
      if (!window.turnstile) return;
      const container = document.getElementById("create-note-turnstile-container");
      if (!container) return;
      if (aiTurnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.reset(aiTurnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        aiTurnstileWidgetIdRef.current = null;
      }
      container.innerHTML = "";
      setAiTurnstileReady(true);
      const widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => {
          setAiTurnstileToken(token);
          setAiTurnstileError(null);
        },
        "error-callback": () => {
          setAiTurnstileToken(null);
          setAiTurnstileError(t.createNoteTurnstileFailed);
          aiTurnstileWidgetIdRef.current = null;
        },
        "expired-callback": () => {
          setAiTurnstileToken(null);
        },
      });
      aiTurnstileWidgetIdRef.current = widgetId;
    };

    void ensureTurnstileScript()
      .then(() => {
        if (!cancelled) initTurnstile();
      })
      .catch(() => {
        if (!cancelled) {
          setAiTurnstileError(t.createNoteTurnstileFailedLoad);
        }
      });

    return () => {
      cancelled = true;
      if (aiTurnstileWidgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.reset(aiTurnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        aiTurnstileWidgetIdRef.current = null;
      }
    };
  }, [shouldShowAiTurnstile, turnstileSiteKey, createdNote]);

  const resetAiTurnstileWidget = useCallback(() => {
    setAiTurnstileToken(null);
    if (aiTurnstileWidgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(aiTurnstileWidgetIdRef.current);
      } catch {
        // ignore
      }
    }
  }, []);

  // ── Submission ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFileTransferMode && !selectedFile) {
      toast({
        title: t.sftAttachRequiredTitle,
        description: t.sftAttachRequiredDescription,
        variant: "destructive",
      });
      return;
    }

    if (!noteContent.trim() && !selectedFile) {
      toast({
        title: t.error,
        description: t.toastAddContentOrFile,
        variant: "destructive",
      });
      return;
    }

    if (selectedFile && selectedFile.size > fileLimitBytes) {
      toast({
        title: t.fileTooLarge,
        description: t.fileTooLargeDescription.replace(
          "{limit}",
          formatNoteFileSize(fileLimitBytes),
        ),
        variant: "destructive",
      });
      return;
    }

    if (selectedFile && !canAttachFiles) {
      toast({
        title: t.signInToAttachFiles,
        description: t.signInToAttachFilesHint,
        variant: "destructive",
      });
      return;
    }

    const applyRestrictRecipientEmail = isPremiumUser && restrictRecipientEmail;
    const applyRequireRecipientVerification = isPremiumUser && requireRecipientVerification;
    if (applyRestrictRecipientEmail) {
      const trimmedRecipientEmail = recipientEmail.trim();
      if (!isPlausibleEmailFormat(trimmedRecipientEmail)) {
        toast({
          title: t.settingsRecipientEmailInvalid,
          description: t.settingsRecipientEmailInvalidHint,
          variant: "destructive",
        });
        return;
      }
    }

    const applyNoteLabel = isPremiumUser ? noteLabel.trim().slice(0, 120) : "";
    const applyReaderLanguage =
      isPremiumUser && readerLanguage !== "auto" ? readerLanguage : undefined;
    const tracksDelivery =
      (notifyOnOpen && canNotifyOnOpen) ||
      (notifyOnDestroyed && canNotifyOnOpen) ||
      applyRestrictRecipientEmail ||
      applyRequireRecipientVerification;

    if (noteHasUnresolvedGuidedPlaceholders(noteContent, language)) {
      toast({
        title: t.aiComposerPlaceholdersToastTitle,
        description: t.aiComposerPlaceholdersBlockShare,
        variant: "destructive",
      });
      return;
    }

    if (utf8ByteLength(noteContent) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
      toast({
        title: t.toastNoteTooLargeTitle,
        description: t.toastNoteTooLargeDesc.replace(
          "{limit}",
          String(MAX_NOTE_PLAINTEXT_UTF8_BYTES / 1024),
        ),
        variant: "destructive",
      });
      return;
    }

    if (isAiMode && shouldShowAiTurnstile && !aiTurnstileToken) {
      toast({
        title: t.toastHumanVerificationTitle,
        description: t.toastHumanVerificationDesc,
        variant: "destructive",
      });
      return;
    }

    // Honeypot: if the hidden field was filled, silently abort (bot detected).
    if (honeypotValue) {
      return;
    }

    // Time-on-page: require at least 2 seconds since form load.
    const MIN_PAGE_TIME_MS = 2000;
    if (Date.now() - pageLoadTimeRef.current < MIN_PAGE_TIME_MS) {
      toast({
        title: t.toastJustAMomentTitle,
        description: t.toastWaitBeforeSubmitDesc,
      });
      return;
    }

    setIsLoading(true);
    // 4 MiB matches SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES — avoid awaiting the sodium
    // module just to show an immediate 0/N chunk label.
    const earlyTotalChunks = selectedFile
      ? Math.max(1, Math.ceil(selectedFile.size / (4 * 1024 * 1024)))
      : 0;
    setAttachmentProgress(
      selectedFile
        ? {
            phase: "prepare",
            progress: 2,
            detail: t.attachmentProgressChunkDetail
              .replace("{done}", "0")
              .replace("{total}", String(earlyTotalChunks))
              .replace("{name}", formatAttachmentDisplayName(selectedFile.name)),
          }
        : null,
    );

    try {
      const {
        encryptNote,
        generateRootKeyBytes,
        deriveNoteRootKeys,
        arrayBufferToBase64,
        currentKdfParamsV2,
        deriveAesKeyFromPassword,
        wrapRootKeyWithPassword,
        serializeEncryptedPayload,
        generateSalt,
        NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
        ARGON2ID_PARAM_TAG_V2,
        ARGON2ID_TIME_COST_V2,
      } = await import("@/utils/encryption");
      let encryptedBase64,
        ivBase64,
        exportedKey,
        saltBase64,
        encryptedKeyIvBase64;
      const encodeBase64 = (value: ArrayBuffer | Uint8Array) => {
        const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
        const copy = new Uint8Array(bytes.byteLength);
        copy.set(bytes);
        return arrayBufferToBase64(copy.buffer);
      };

      const { getAttachmentChunkSizeBytes } = await import("@/utils/libsodiumFileAttachment");
      const attachmentChunkSizeBytes = getAttachmentChunkSizeBytes();
      const attachmentReserveBinding = selectedFile
        ? {
            attachmentPlaintextSize: selectedFile.size,
            attachmentEncryptedSize:
              selectedFile.size +
              Math.max(1, Math.ceil(selectedFile.size / attachmentChunkSizeBytes)) * 17,
          }
        : undefined;

      const { id: reservedId, uploadToken } = await apiRequest<{
        id: string;
        uploadToken: string;
      }>("/api/notes/reserve", "POST", attachmentReserveBinding);
      const expirySeconds = noteExpiryPresetIdToSeconds(expiryValue);

      let aad: string;
      let kdfParams: unknown;
      let attachment: {
        v: 2;
        alg: "libsodium-secretstream-xchacha20poly1305";
        encryptedSize: number;
        chunkSize: number;
        totalChunks: number;
        header: string;
        aad: string;
        encryptedMetadata: {
          alg: "AES-GCM";
          iv: string;
          aad: string;
          ciphertext: string;
        };
        wrappedKey: {
          alg: "AES-GCM";
          iv: string;
          aad: string;
          encryptedKey: string;
        };
        chunks: Array<{ index: number; encryptedSize: number }>;
        encryptedContentSha256: string;
      } | null = null;

      const aadBinding = {
        noteId: reservedId,
        expirySeconds,
        maxReads: readCount,
      };
      const contentToEncrypt = noteContent.trim() || "Encrypted file attached.";
      const { rootKeyBytes, exportedRootKey } = generateRootKeyBytes();
      let noteTextKey: CryptoKey;
      let fileWrapKey: CryptoKey;
      let metadataKey: CryptoKey;
      let fragmentKey: string | undefined;

      if (isPasswordProtected) {
        const salt = generateSalt();
        const passwordKey = await deriveAesKeyFromPassword(
          password,
          salt,
          ARGON2ID_TIME_COST_V2,
          ARGON2ID_PARAM_TAG_V2,
        );
        const derivedKeys = await deriveNoteRootKeys(rootKeyBytes);
        noteTextKey = derivedKeys.noteTextKey;
        fileWrapKey = derivedKeys.fileWrapKey;
        metadataKey = derivedKeys.metadataKey;
        const encryptionResult = await encryptNote(contentToEncrypt, noteTextKey, aadBinding);
        const { encryptedData, iv, aadBytes } = encryptionResult;
        const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
        const { encryptedRootKey, encryptedRootKeyIv } = await wrapRootKeyWithPassword(
          rootKeyBytes,
          passwordKey,
          aadBytes,
        );
        aad = wirePayload.aad;
        kdfParams = currentKdfParamsV2();
        encryptedBase64 = wirePayload.content;
        ivBase64 = wirePayload.iv;
        saltBase64 = encodeBase64(salt);
        fragmentKey = encodeBase64(encryptedRootKey);
        encryptedKeyIvBase64 = encodeBase64(encryptedRootKeyIv);
      } else {
        const derivedKeys = await deriveNoteRootKeys(rootKeyBytes);
        noteTextKey = derivedKeys.noteTextKey;
        fileWrapKey = derivedKeys.fileWrapKey;
        metadataKey = derivedKeys.metadataKey;
        exportedKey = exportedRootKey;
        fragmentKey = exportedRootKey;
        const encryptionResult = await encryptNote(contentToEncrypt, noteTextKey, aadBinding);
        const { encryptedData, iv, aadBytes } = encryptionResult;
        const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
        aad = wirePayload.aad;
        encryptedBase64 = wirePayload.content;
        ivBase64 = wirePayload.iv;
      }
      rootKeyBytes.fill(0);

      if (selectedFile) {
        if (!uploadToken) {
          throw new Error("Upload token missing from note reservation.");
        }
        try {
          const { encryptFileToSodiumChunks } = await import("@/utils/libsodiumFileAttachment");
          const totalChunks = Math.max(
            1,
            Math.ceil(selectedFile.size / attachmentChunkSizeBytes),
          );
          const encryptedSizeUpperBound = selectedFile.size + totalChunks * 17;
          logFileUpload("info", "starting attachment encryption", {
            noteId: reservedId,
            fileName: selectedFile.name,
            fileType: selectedFile.type || "application/octet-stream",
            fileSize: selectedFile.size,
            totalChunks,
            chunkSizeBytes: attachmentChunkSizeBytes,
            encryptedSizeUpperBound,
            apiBase: getFileUploadTargetLabel(),
          });
          resetSafariAttachmentUploadTransport();
          await primeSafariAttachmentUploadTransport(
            `/api/notes/${reservedId}/file/chunks/0`,
            uploadToken,
          );
          const chunkDetail = (done: number, total: number) =>
            t.attachmentProgressChunkDetail
              .replace("{done}", String(done))
              .replace("{total}", String(total))
              .replace("{name}", formatAttachmentDisplayName(selectedFile.name));
          // Show 0/N immediately — waiting for the first 4MB PUT to finish left the
          // modal stuck with no chunk count for a long time on slow uplinks.
          const completedChunksRef = { current: 0 };
          const inFlightChunkRatios = new Map<number, number>();
          let lastProgressPublishMs = 0;
          const publishUploadProgress = (force = false) => {
            const now = typeof performance !== "undefined" ? performance.now() : Date.now();
            if (!force && now - lastProgressPublishMs < 80) return;
            lastProgressPublishMs = now;
            let inFlightSum = 0;
            for (const ratio of inFlightChunkRatios.values()) {
              inFlightSum += ratio;
            }
            const overall =
              totalChunks > 0
                ? Math.min(1, (completedChunksRef.current + inFlightSum) / totalChunks)
                : 1;
            const nextProgress = Math.round(5 + overall * 90);
            setAttachmentProgress((prev) => ({
              phase: "encrypt",
              progress: Math.max(prev?.progress ?? 0, nextProgress),
              detail: chunkDetail(completedChunksRef.current, totalChunks),
            }));
          };
          setAttachmentProgress({
            phase: "encrypt",
            progress: 5,
            detail: chunkDetail(0, totalChunks),
          });
          attachment = await encryptFileToSodiumChunks(
            selectedFile,
            fileWrapKey!,
            metadataKey!,
            reservedId,
            async (chunk) => {
              inFlightChunkRatios.set(chunk.index, 0);
              publishUploadProgress(true);
              try {
                await uploadEncryptedAttachmentChunk(
                  `/api/notes/${reservedId}/file/chunks/${chunk.index}`,
                  chunk.encryptedBytes,
                  {
                    "Content-Type": "application/octet-stream",
                    "x-file-plaintext-size": String(selectedFile.size),
                    "x-file-encrypted-size": String(encryptedSizeUpperBound),
                    "x-file-chunk-encrypted-size": String(chunk.encryptedSize),
                  },
                  uploadToken,
                  ({ loaded, total }) => {
                    inFlightChunkRatios.set(
                      chunk.index,
                      total > 0 ? Math.min(1, loaded / total) : 0,
                    );
                    publishUploadProgress();
                  },
                );
              } finally {
                inFlightChunkRatios.delete(chunk.index);
              }
            },
            (pipeline) => {
              // Drive the bar and the "X of Y" label from uploaded chunks only. Encrypt
              // runs ahead in the pipeline, so reacting to its callbacks made the label
              // flip between the real uploaded count and 0. Keep the label on the last
              // uploaded count instead of resetting it.
              if (pipeline.phase !== "upload") {
                setAttachmentProgress((prev) => ({
                  phase: "encrypt",
                  progress: Math.max(prev?.progress ?? 0, 5),
                  detail: chunkDetail(completedChunksRef.current, pipeline.totalChunks),
                }));
                return;
              }
              completedChunksRef.current = pipeline.completedChunks;
              publishUploadProgress(true);
            },
          );
          setAttachmentProgress({
            phase: "finalize",
            progress: 98,
            detail: selectedFile.name,
          });
          logFileUpload("info", "attachment encryption+upload complete", {
            noteId: reservedId,
            totalChunks: attachment.totalChunks,
            encryptedSize: attachment.encryptedSize,
          });
        } catch (error) {
          logFileUpload("error", "attachment failed", {
            noteId: reservedId,
            fileName: selectedFile.name,
            fileType: selectedFile.type || "application/octet-stream",
            fileSize: selectedFile.size,
            error:
              error instanceof ApiRequestError
                ? { status: error.status, bodyPreview: error.bodyText.slice(0, 500) }
                : error instanceof Error
                  ? { name: error.name, message: error.message }
                  : String(error),
          });
          const message = error instanceof Error ? error.message : "";
          throw new Error(
            message && message !== "Load failed"
              ? message
              : "Encrypted file upload failed before the server responded. Try a smaller file or save the image locally and retry.",
          );
        }
      }

      const { id, recipientVerificationCode } = await apiRequest<{
        id: string;
        recipientVerificationCode?: string;
      }>("/api/notes", "POST", {
        id: reservedId,
        content: encryptedBase64,
        iv: ivBase64,
        expirySeconds,
        maxReads: readCount,
        notifyOnOpen: notifyOnOpen && canNotifyOnOpen,
        notifyOnDestroyed: notifyOnDestroyed && canNotifyOnOpen,
        ...(applyRestrictRecipientEmail
          ? {
              restrictRecipientEmail: true,
              recipientEmail: recipientEmail.trim().toLowerCase(),
            }
          : {}),
        ...(applyRequireRecipientVerification
          ? { requireRecipientVerification: true }
          : {}),
        fileAccessWindowSeconds,
        ...(applyReaderLanguage ? { readerLanguage: applyReaderLanguage } : {}),
        aiMode: isAiMode,
        uiLanguage: language,
        isPasswordProtected,
        keyDerivation: NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
        aad,
        ...(attachment
          ? { attachment, attachmentContentHash: attachment.encryptedContentSha256 }
          : {}),
        _hp: honeypotValue,
        creationSource: "web",
        creationEntryPoint: isFileTransferMode ? "file-share" : "home",
        ...(prefillReferrer ? { referrer: prefillReferrer } : {}),
        ...(isAiMode && aiTurnstileToken && { turnstileToken: aiTurnstileToken }),
        ...(isPasswordProtected && {
          salt: saltBase64,
          encryptedKeyIv: encryptedKeyIvBase64,
          kdfParams,
        }),
      });

      const baseUrl = window.location.origin;
      const urlKey = normalizeUrlFragmentKey(fragmentKey ?? "");
      const url = `${baseUrl}/note/${id}#${urlKey}`;

      if (applyNoteLabel && tracksDelivery) {
        saveNoteLabel(id, applyNoteLabel);
      }

      clearCreateNoteAuthDraft();
      recordWebNoteCreated();
      setCreatedNote({
        url,
        meta: {
          expiryValue,
          readCount,
          isPasswordProtected,
          recipientVerificationCode:
            typeof recipientVerificationCode === "string"
              ? recipientVerificationCode
              : undefined,
        },
      });
      resetAiTurnstileWidget();
      try {
        const d = await apiRequest<{ required: boolean }>("/api/notes/turnstile-challenge", "GET");
        setAiTurnstileChallengeRequired(Boolean(d.required));
      } catch {
        setAiTurnstileChallengeRequired(false);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[CreateNote] ❌❌❌ ERROR CREATING NOTE ❌❌❌");
        console.error("[CreateNote] Error type:", error?.constructor?.name || "Unknown");
        console.error(
          "[CreateNote] Error message:",
          error instanceof Error ? error.message : String(error),
        );
        console.error("[CreateNote] Full error:", error);
      } else {
        console.error(
          "[CreateNote] Failed to create note",
          error instanceof Error ? error.message : String(error),
        );
      }

      if (error instanceof ApiRequestError && error.status === 403) {
        try {
          const body = JSON.parse(error.bodyText) as { challengeRequired?: boolean };
          if (body.challengeRequired && turnstileSiteKey) {
            setAiTurnstileChallengeRequired(true);
            toast({
              title: t.toastVerificationRequiredTitle,
              description: t.toastVerificationRequiredDesc,
              variant: "destructive",
            });
            return;
          }
        } catch {
          // not JSON
        }
      }

      let errorMessage = t.toastCreateNoteFailed;
      if (error instanceof Error) {
        const statusMatch = error.message.match(/^(\d+):/);
        if (statusMatch) {
          const status = statusMatch[1];
          errorMessage = import.meta.env.DEV
            ? t.toastServerErrorDev.replace("{status}", status)
            : t.toastServerErrorProd.replace("{status}", status);
        } else {
          errorMessage = import.meta.env.DEV ? error.message || errorMessage : errorMessage;
        }
      }

      toast({ title: t.error, description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
      setAttachmentProgress(null);
    }
  };

  // ── Success actions ───────────────────────────────────────────────────────
  const copyToClipboard = async () => {
    if (!noteUrl) return;
    try {
      await navigator.clipboard.writeText(noteUrl);
      setSuccessLinkCopied(true);
      toast({ title: t.copied, description: t.secretLinkCopied });
    } catch {
      toast({
        title: t.toastCouldNotCopyLinkTitle,
        description: t.toastCouldNotCopyLinkDesc,
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (!noteUrl) return;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url: noteUrl });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copyToClipboard();
  };

  const createNewNote = () => {
    clearCreateNoteAuthDraft();
    setShowSuccessQr(false);
    setSuccessLinkCopied(false);
    setCreatedNote(null);
    setNoteContent("");
    resetPrefill();
    setOriginalPrompt("");
    setUserPromptHistory([]);
    setTransformHistory([]);
    setShowAdvancedOptions(false);
    setNotifyOnOpen(false);
    setNotifyOnDestroyed(false);
    setRestrictRecipientEmail(false);
    setRequireRecipientVerification(false);
    setRecipientEmail("");
    setNoteLabel("");
    setShowPrompt(true);
    setAiDraftAccepted(false);
    setSelectedTemplateId("ask-anything");
    setAiSentenceLength("auto");
    setAiEnhancementType("ask");
    void loadPromptTemplatesModule().then((m) => {
      const templates = m.getPromptTemplatesForLanguage(language);
      const tmpl = templates.find((x) => x.id === "ask-anything");
      const base = tmpl?.userTemplate ?? "";
      const suffix = m.formatSentenceLengthUserSuffix("auto", language);
      setAiPrompt(suffix ? `${base}\n${suffix}` : base);
      if (tmpl?.enhancementType) setAiEnhancementType(tmpl.enhancementType);
    });
    setPassword("");
    setShowPassword(false);
    setPasswordSource(null);
    setExpiryValue(NOTE_EXPIRY_DEFAULT_PRESET_ID);
    setSelectedFile(null);
  };

  // ── AI actions ────────────────────────────────────────────────────────────
  const selectTemplate = (template: PromptTemplate) => {
    if (template.id === "ask-anything" && selectedTemplateId === "ask-anything") {
      setSelectedTemplateId(null);
      setAiPrompt("");
      return;
    }
    void loadPromptTemplatesModule().then((m) => {
      setAiPrompt(
        template.userTemplate + m.formatSentenceLengthUserSuffix(aiSentenceLength, language),
      );
      setAiEnhancementType(template.enhancementType);
      setSelectedTemplateId(template.id);
    });
  };

  const handleSentenceLengthChange = useCallback(
    (id: AiSentenceLengthId) => {
      void loadPromptTemplatesModule().then((m) => {
        setAiSentenceLength(id);
        if (selectedTemplateId === null) return;
        setAiPrompt((p) => m.applySentenceLengthToUserPrompt(p, id, language));
      });
    },
    [selectedTemplateId, language],
  );

  const handleUseFallbackTemplate = useCallback((text: string) => {
    setNoteContentFromAiOutput(text);
    setTransformHistory([]);
    setShowPrompt(false);
    setAiDraftAccepted(false);
  }, [setNoteContentFromAiOutput]);

  const persistHostedAiPreference = useCallback(
    async (allowed: boolean): Promise<boolean> => {
      setAllowHostedAi(allowed);
      writeLocalHostedAiAllowed(allowed);
      if (!user) {
        return allowed;
      }
      try {
        await apiRequest("/api/auth/account/preferences", "PATCH", { allowHostedAi: allowed });
        return true;
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 503) {
          try {
            const body = JSON.parse(error.bodyText) as { message?: string };
            if (body.message?.includes("Hosted AI preference migration is required")) {
              return true;
            }
          } catch {
            /* fall through */
          }
        }
        setAllowHostedAi(!allowed);
        writeLocalHostedAiAllowed(!allowed);
        toast({
          title: t.toastCouldNotSaveHostedAiPref,
          description: t.toastTryAgainFromPreferences,
          variant: "destructive",
        });
        return false;
      }
    },
    [user, toast, t],
  );

  const handlePreferHostedCloudChange = useCallback(
    (prefer: boolean) => {
      cloudAssistModeTouchedInSessionRef.current = true;
      setPreferHostedCloudAfterLocalFailure(prefer);
      if (prefer) {
        setCloudAssistConsentGiven(true);
        writeCloudAssistModeSession(true, true);
        if (!user) {
          redirectToCloudAssistSignIn();
          return;
        }
      } else {
        setCloudAssistConsentGiven(false);
        writeCloudAssistModeSession(false, false);
      }
    },
    [redirectToCloudAssistSignIn, user],
  );

  const handleCloudAssistConsentChange = useCallback((consent: boolean) => {
    cloudAssistModeTouchedInSessionRef.current = true;
    setCloudAssistConsentGiven(consent);
    writeCloudAssistModeSession(preferHostedCloudAfterLocalFailure, consent);
  }, [preferHostedCloudAfterLocalFailure]);

  useEffect(() => {
    if (!user) {
      hostedAiPrefHydratedRef.current = false;
      cloudAssistModeTouchedInSessionRef.current = readCloudAssistModeSession().preferHosted;
      return;
    }
    if (hostedAiPrefHydratedRef.current) return;
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiRequest<{ ok: boolean; allowHostedAi?: boolean }>(
          "/api/auth/account/summary",
          "GET",
        );
        if (!cancelled && data.ok && typeof data.allowHostedAi === "boolean") {
          if (!cloudAssistModeTouchedInSessionRef.current) {
            setAllowHostedAi(data.allowHostedAi);
            writeLocalHostedAiAllowed(data.allowHostedAi);
          }
          hostedAiPrefHydratedRef.current = true;
        }
      } catch {
        /* non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const usesHostedCloudAi = preferHostedCloudAfterLocalFailure || !isLocalAiSupported();

  const handleHostedCloudGenerate = async (
    override?: {
      prompt?: string;
      enhancementType?: "improve" | "summarize" | "secure" | "ask" | "simplify";
    },
    options?: {
      preserveTransformHistory?: boolean;
      skipPromptHistoryUpdate?: boolean;
      successToast?: { title: string; description: string };
    },
  ) => {
    const promptToUse = override?.prompt ?? aiPrompt;
    const enhancementTypeToUse = override?.enhancementType ?? aiEnhancementType;
    if (!promptToUse.trim()) {
      toast({ title: t.error, description: t.toastEnterPromptFirst, variant: "destructive" });
      return;
    }

    if (!cloudAssistConsentGiven) {
      toast({
        title: t.toastConfirmationRequiredTitle,
        description: t.toastCloudAssistConfirmDesc,
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      redirectToCloudAssistSignIn();
      return;
    }

    setIsGeneratingContent(true);
    setHostedCloudAiStatusText(t.aiComposerHostedCloudAiWriting);
    if (!originalPrompt) setOriginalPrompt(promptToUse);
    if (!options?.skipPromptHistoryUpdate) {
      setUserPromptHistory((prev) => {
        if (prev.length === 0 || prev[prev.length - 1] !== promptToUse) {
          return [...prev, promptToUse];
        }
        return prev;
      });
    }

    const requestDraft = () =>
      generateHostedCloudDraft({
        prompt: promptToUse,
        enhancementType: enhancementTypeToUse,
        language,
        sentenceLength: aiSentenceLength,
      });

    const applyDraftResponse = (response: Awaited<ReturnType<typeof generateHostedCloudDraft>>) => {
      setHostedCloudAiLimit(response.limit);
      setHostedCloudAiRemaining(response.remaining);
      setNoteContentFromAiOutput(response.text);
      if (!options?.preserveTransformHistory) {
        setTransformHistory([]);
      }
      setShowPrompt(false);
      setAiDraftAccepted(false);
      toast(
        options?.successToast ?? {
          title: t.toastCloudDraftCreated,
          description: t.toastCloudDraftRemaining
            .replace("{remaining}", String(response.remaining))
            .replace("{limit}", String(response.limit)),
        },
      );
    };

    try {
      const saved = await persistHostedAiPreference(true);
      if (!saved) return;

      let response = await requestDraft();
      applyDraftResponse(response);
    } catch (error) {
      let parsed = parseHostedCloudAiError(error);
      if (parsed.code === "hosted_ai_not_enabled") {
        const saved = await persistHostedAiPreference(true);
        if (saved) {
          try {
            const response = await requestDraft();
            applyDraftResponse(response);
            return;
          } catch (retryError) {
            parsed = parseHostedCloudAiError(retryError);
          }
        }
      }

      if (parsed.code === "hosted_ai_quota_exhausted") {
        setHostedCloudAiRemaining(0);
        toast({
          title: t.toastFreeHostedDraftsUsed,
          description: t.toastFreeHostedDraftsUsedDesc,
          variant: "destructive",
        });
      } else if (parsed.code === "prompt_too_long") {
        toast({
          title: t.toastPromptTooLong,
          description: parsed.message ?? t.toastShortenPrompt,
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_fair_use_limit_reached") {
        toast({
          title: t.toastFairUseLimit,
          description: parsed.message ?? t.toastFairUseLimitDesc,
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_auth_required") {
        redirectToCloudAssistSignIn();
      } else if (parsed.code === "hosted_ai_not_enabled" || parsed.code === "hosted_ai_consent_required") {
        toast({
          title: t.toastHostedAiOff,
          description: parsed.message ?? t.toastHostedAiOffDesc,
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_unavailable" || parsed.code === "hosted_ai_auth_unavailable") {
        toast({
          title: t.toastCloudAssistUnavailable,
          description: parsed.message ?? t.toastCloudAssistUnavailableDesc,
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_cost_guard_unavailable") {
        toast({
          title: t.toastCloudAssistTempUnavailable,
          description: parsed.message ?? t.toastCloudAssistTempUnavailableDesc,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.toastCloudAssistUnavailable,
          description: parsed.message ?? t.toastCloudAssistUnavailableFallback,
          variant: "destructive",
        });
      }
    } finally {
      setHostedCloudAiStatusText(null);
      setIsGeneratingContent(false);
    }
  };

  const executeAiGenerate = async (
    promptToUse: string,
    enhancementTypeToUse: "improve" | "summarize" | "secure" | "ask",
  ) => {
    setIsGeneratingContent(true);
    if (!originalPrompt) setOriginalPrompt(promptToUse);
    setUserPromptHistory((prev) => {
      if (prev.length === 0 || prev[prev.length - 1] !== promptToUse) {
        return [...prev, promptToUse];
      }
      return prev;
    });
    try {
      const content = await runFreeLocalEnhancement(promptToUse, enhancementTypeToUse, {
        useBuiltTemplatePrompt: true,
        promptAnalysisDwellMs: LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS,
      });
      setNoteContentFromAiOutput(content);
      setTransformHistory([]);
      setShowPrompt(false);
      setAiDraftAccepted(false);
    } catch (error) {
      console.warn("[AI] Failed to generate content:", error);
      if (isLocalAiSupported()) {
        await clearLocalAiDownloadStateSilently();
        offerTemplateFallback();
        toast({
          title: t.toastPrivateAiUnavailable,
          description: t.toastPrivateAiUnavailableDesc,
        });
      }
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleAiGenerate = async (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => {
    const promptToUse = override?.prompt ?? aiPrompt;
    const enhancementTypeToUse = override?.enhancementType ?? aiEnhancementType;
    if (!promptToUse.trim()) {
      toast({ title: t.error, description: t.toastEnterPromptForAi, variant: "destructive" });
      return;
    }
    await executeAiGenerate(promptToUse, enhancementTypeToUse);
  };

  const handleBackButton = () => {
    if (aiDraftAccepted) {
      if (!isLocalAiSupported()) {
        setShowPrompt(true);
      }
      setAiDraftAccepted(false);
      return;
    }

    const lastUserFacingPrompt =
      userPromptHistory.length > 0
        ? userPromptHistory[userPromptHistory.length - 1]!
        : originalPrompt;

    if (transformHistory.length > 0) {
      const nextTransforms = [...transformHistory];
      const undone = nextTransforms.pop()!;
      setTransformHistory(nextTransforms);
      setNoteContent(undone.contentBefore);
      setAiPrompt(lastUserFacingPrompt);
      setShowPrompt(false);
      setAiDraftAccepted(false);
      toast({ title: t.toastPreviousVersionRestored, description: t.toastPreviousVersionRestoredDesc });
      return;
    }

    setShowPrompt(true);
    setAiDraftAccepted(false);

    if (userPromptHistory.length > 0) {
      const next = [...userPromptHistory];
      const previousPrompt = next.pop() || "";
      setUserPromptHistory(next);
      setAiPrompt(previousPrompt);
      toast({ title: t.toastPreviousPromptRestored, description: t.toastPreviousPromptRestoredDesc });
    } else if (originalPrompt) {
      setAiPrompt(originalPrompt);
      toast({ title: t.toastOriginalPromptRestored, description: t.toastOriginalPromptRestoredDesc });
    }
  };

  const handleImprove = async () => {
    if (!noteContent) return;
    setTransformHistory((prev) => [...prev, { kind: "improve", contentBefore: noteContent }]);
    if (usesHostedCloudAi) {
      await handleHostedCloudGenerate(
        { prompt: noteContent, enhancementType: "improve" },
        {
          preserveTransformHistory: true,
          skipPromptHistoryUpdate: true,
          successToast: {
            title: t.toastContentImproved,
            description: t.toastContentImprovedDesc,
          },
        },
      );
      return;
    }
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: t.aiComposerInitializingAi });
    try {
      const content = await runFreeLocalEnhancement(noteContent, "improve");
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: t.toastContentImproved, description: t.toastContentImprovedDesc });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: t.toastNoChangeApplied,
          description: t.toastNoChangeImproveDesc,
        });
      }
    } finally {
      setIsGeneratingContent(false);
      setAiProgress(null);
    }
  };

  const handleSummarize = async () => {
    if (!noteContent) return;
    setTransformHistory((prev) => [...prev, { kind: "summarize", contentBefore: noteContent }]);
    if (usesHostedCloudAi) {
      await handleHostedCloudGenerate(
        { prompt: noteContent, enhancementType: "summarize" },
        {
          preserveTransformHistory: true,
          skipPromptHistoryUpdate: true,
          successToast: {
            title: t.toastContentSummarized,
            description: t.toastContentSummarizedDesc,
          },
        },
      );
      return;
    }
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: t.aiComposerInitializingAi });
    try {
      const content = await runFreeLocalEnhancement(noteContent, "summarize");
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: t.toastContentSummarized, description: t.toastContentSummarizedDesc });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: t.toastNoChangeApplied,
          description: t.toastNoChangeSummarizeDesc,
        });
      }
    } finally {
      setIsGeneratingContent(false);
      setAiProgress(null);
    }
  };

  const handleSimplify = async () => {
    if (!noteContent) return;
    setTransformHistory((prev) => [...prev, { kind: "simplify", contentBefore: noteContent }]);
    if (usesHostedCloudAi) {
      await handleHostedCloudGenerate(
        { prompt: noteContent, enhancementType: "simplify" },
        {
          preserveTransformHistory: true,
          skipPromptHistoryUpdate: true,
          successToast: {
            title: t.toastContentSimplified,
            description: t.toastContentSimplifiedDesc,
          },
        },
      );
      return;
    }
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: t.aiComposerInitializingAi });
    try {
      const content = await runFreeLocalEnhancement(noteContent, "simplify");
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: t.toastContentSimplified, description: t.toastContentSimplifiedDesc });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: t.toastNoChangeApplied,
          description: t.toastNoChangeSimplifyDesc,
        });
      }
    } finally {
      setIsGeneratingContent(false);
      setAiProgress(null);
    }
  };

  const handleRegenerate = async (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => {
    const promptToUse = override?.prompt ?? originalPrompt;
    const enhancementTypeToUse = override?.enhancementType ?? aiEnhancementType;
    if (!promptToUse) return;
    setTransformHistory((prev) => [...prev, { kind: "regenerate", contentBefore: noteContent }]);
    if (usesHostedCloudAi) {
      await handleHostedCloudGenerate(
        { prompt: promptToUse, enhancementType: enhancementTypeToUse },
        {
          preserveTransformHistory: true,
          skipPromptHistoryUpdate: true,
          successToast: {
            title: t.toastContentRegenerated,
            description: t.toastContentRegeneratedDesc,
          },
        },
      );
      return;
    }
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: t.aiComposerInitializingAi });
    try {
      const content = await runFreeLocalEnhancement(promptToUse, enhancementTypeToUse, {
        useBuiltTemplatePrompt: true,
        promptAnalysisDwellMs: LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS,
      });
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: t.toastContentRegenerated, description: t.toastContentRegeneratedDesc });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: t.toastNoChangeApplied,
          description: t.toastNoChangeRegenerateDesc,
        });
      }
    } finally {
      setIsGeneratingContent(false);
      setAiProgress(null);
    }
  };

  // ── Privacy banner (English desktop only; passed to AiComposer) ───────────
  const privacyBannerItems =
    language === "en" && !isMobile ? (
      <>
        <span className="flex items-center whitespace-nowrap">
          <Eye className="h-3 w-3 mr-1 text-orange-500" />
          {t.expiresAfter} {translatedExpiryLabel(expiryValue, t)} {t.orOneRead}
        </span>
        {isPasswordProtected && (
          <>
            <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block" />
            <span className="flex items-center whitespace-nowrap">
              <Key className="h-3 w-3 mr-1 text-yellow-500" />
              {t.passwordProtected}
            </span>
          </>
        )}
        <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block" />
        <span className="flex items-center whitespace-nowrap">
          <Shield className="h-3 w-3 mr-1 text-green-500" />
          {t.endToEndEncrypted}
        </span>
        <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block" />
        <span className="flex items-center whitespace-nowrap">
          <Lock className="h-3 w-3 mr-1 text-blue-500" />
          AES-256 GCM
        </span>
        <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block" />
        <span className="flex items-center whitespace-nowrap">
          <Eye className="h-3 w-3 mr-1 text-purple-500 opacity-20" />
          {t.noTracking}
        </span>
      </>
    ) : null;

  const shouldRenderDeferredDialogs =
    isGeneratingContent ||
    cellularPreloadConfirmOpen ||
    showTemplateOfferPrompt ||
    Boolean(attachmentProgress);

  const handleUseCloudAssist = useCallback(() => {
    setShowTemplateOfferPrompt(false);
    cloudAssistModeTouchedInSessionRef.current = true;
    setPreferHostedCloudAfterLocalFailure(true);
    setCloudAssistConsentGiven(true);
    writeCloudAssistModeSession(true, true);
    setIsAiMode(true);
    setShowPrompt(true);
    if (!user) {
      redirectToCloudAssistSignIn();
      return;
    }
    aiComposerAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [redirectToCloudAssistSignIn, user]);

  // ── Success page ──────────────────────────────────────────────────────────
  if (createdNote) {
    return (
      <CreateNoteSuccess
        createdNote={createdNote}
        showSuccessQr={showSuccessQr}
        setShowSuccessQr={setShowSuccessQr}
        showSuccessHelp={showSuccessHelp}
        setShowSuccessHelp={setShowSuccessHelp}
        showQrHelp={showQrHelp}
        setShowQrHelp={setShowQrHelp}
        selectedDoDont={selectedDoDont}
        setSelectedDoDont={setSelectedDoDont}
        successLinkCopied={successLinkCopied}
        onCopyLink={copyToClipboard}
        onShareLink={shareLink}
        onShareQrCode={shareQrCode}
        onDownloadQrCode={downloadQrCode}
        onCreateNewNote={createNewNote}
        successQrSectionRef={successQrSectionRef}
        variant={isFileTransferMode ? "file-transfer" : "note"}
      />
    );
  }

  // ── Create form ───────────────────────────────────────────────────────────
  return (
    <section className="mx-auto w-full min-w-0 max-w-full">
      <div className={isFileTransferMode ? "pt-0" : "pt-4"}>
        {!isFileTransferMode ? (
        <div className="mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
            <button
              type="button"
              onClick={() => {
                setIsAiMode(false);
                setAiDraftAccepted(false);
              }}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                !isAiMode
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2" />
                {t.write}
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                enterAiMode();
              }}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                isAiMode
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="inline md:hidden">
                  {usesHostedCloudAi ? (t.cloudAssistShort ?? "Cloud Assist") : t.privateAiShort}
                </span>
                <span className="hidden md:inline">
                  {usesHostedCloudAi ? (t.writeWithCloudAssist ?? "Write with Cloud Assist") : t.writeWithPrivateAi}
                </span>
              </div>
            </button>
          </div>
        </div>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} className="mb-4">
          {/* Honeypot: visually hidden, never filled by real users */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              value={honeypotValue}
              onChange={(e) => setHoneypotValue(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {isAiMode ? (
            <div ref={aiComposerAnchorRef} className="scroll-mt-20 md:scroll-mt-24">
              <Suspense
                fallback={
                  <div
                    aria-hidden
                    className="min-h-[240px] animate-pulse rounded-xl border border-gray-200 bg-gray-100/80 dark:border-gray-700 dark:bg-gray-800/50"
                  />
                }
              >
                <AiComposer
                language={language}
                noteContent={noteContent}
                applyNoteContentInput={applyNoteContentInput}
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                selectedTemplateId={selectedTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                aiEnhancementType={aiEnhancementType}
                setAiEnhancementType={setAiEnhancementType}
                showPrompt={showPrompt}
                isGeneratingContent={isGeneratingContent}
                aiGenerationStatusText={
                  isGeneratingContent
                    ? hostedCloudAiStatusText ?? localAiDialogPrimaryLine(aiProgress)
                    : null
                }
                isAiModelLoading={isAiModelLoading}
                aiModelProgress={aiModelProgress}
                transformHistory={transformHistory}
                onGenerate={(override) => void handleAiGenerate(override)}
                onHostedCloudGenerate={(override) => void handleHostedCloudGenerate(override)}
                hostedCloudAiRemaining={hostedCloudAiRemaining}
                hostedCloudAiLimit={hostedCloudAiLimit}
                cloudAssistConsentGiven={cloudAssistConsentGiven}
                onCloudAssistConsentChange={handleCloudAssistConsentChange}
                onImprove={() => void handleImprove()}
                onSummarize={() => void handleSummarize()}
                onSimplify={() => void handleSimplify()}
                onRegenerate={(override) => void handleRegenerate(override)}
                onBack={handleBackButton}
                privacyBannerItems={privacyBannerItems}
                onSelectTemplate={selectTemplate}
                selectedSentenceLength={aiSentenceLength}
                onSentenceLengthChange={handleSentenceLengthChange}
                aiDraftAccepted={aiDraftAccepted}
                onAcceptDraft={() => setAiDraftAccepted(true)}
                preferHostedCloudAfterLocalFailure={preferHostedCloudAfterLocalFailure}
                onPreferHostedCloudChange={handlePreferHostedCloudChange}
                onWriteWithoutAi={() => setIsAiMode(false)}
                />
              </Suspense>
            </div>
          ) : null}

          {shouldShowAiTurnstile && (
            <div
              className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 px-4 py-4"
              role="region"
              aria-label={t.createNoteTurnstileAriaLabel}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {t.createNoteTurnstileExplanation}
              </p>
              <div id="create-note-turnstile-container" className="min-h-[65px] flex justify-center" />
              {!aiTurnstileReady && !aiTurnstileError && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">{t.createNoteTurnstileLoading}</p>
              )}
              {aiTurnstileError && (
                <p className="text-xs text-red-500 text-center mt-2">{aiTurnstileError}</p>
              )}
            </div>
          )}

          {!isAiMode && !isFileTransferMode ? (
            <div className="mb-4">
              <PrefillPartnerBanner
                visible={showPrefillBanner}
                referrer={prefillReferrer}
                onDismiss={dismissPrefillBanner}
              />
              <div
                className={`mb-2 hidden md:flex flex-wrap items-center gap-x-3 gap-y-1 ${privacyBannerItems ? "justify-between" : "justify-end"}`}
              >
                {privacyBannerItems ? (
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {privacyBannerItems}
                  </div>
                ) : null}
                <NotePlaintextUtf8Meter
                  noteContent={noteContent}
                  maxBytes={MAX_NOTE_PLAINTEXT_UTF8_BYTES}
                  className="mb-0 shrink-0 text-right"
                />
              </div>
              <textarea
                value={noteContent}
                onChange={(e) =>
                  applyNoteContentInput(
                    e,
                    MAX_NOTE_PLAINTEXT_UTF8_BYTES,
                    t.notesLimitTrimmed,
                  )
                }
                rows={6}
                className="w-full resize-none overflow-y-auto overflow-x-hidden px-4 py-3 rounded-lg border border-primary/60 dark:border-primary/40 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder={t.typeHere}
                required={!selectedFile}
              />
            </div>
          ) : null}

          {!isAiMode && isFileTransferMode && selectedFile ? (
            <div className="mb-4 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <Paperclip className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span
                  className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                  title={selectedFile.name}
                >
                  {formatAttachmentDisplayName(selectedFile.name)}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label={t.removeSelectedFile ?? "Remove selected file"}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div>
                <label
                  htmlFor="file-transfer-message"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t.sftOptionalMessage}
                </label>
                <textarea
                  id="file-transfer-message"
                  value={noteContent}
                  onChange={(e) =>
                    applyNoteContentInput(
                      e,
                      MAX_NOTE_PLAINTEXT_UTF8_BYTES,
                      t.notesLimitTrimmed,
                    )
                  }
                  rows={2}
                  className="w-full resize-none overflow-y-auto overflow-x-hidden px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder={t.sftOptionalMessagePlaceholder}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-[-0.5rem]" />

          {(!isAiMode || aiDraftAccepted) &&
            !customizeSheetExperiment &&
            (!isFileTransferMode || selectedFile) && (
            <Suspense
              fallback={
                <div
                  className="min-h-[120px] rounded-lg border border-gray-200/60 bg-muted/30 animate-pulse dark:border-gray-700/60"
                  aria-hidden
                />
              }
            >
              <NoteSettingsPanel
                showAdvancedOptions={showAdvancedOptions}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                passwordSource={passwordSource}
                setPasswordSource={setPasswordSource}
                passwordStrength={passwordStrength}
                breachState={breachState}
                breachCount={breachCount}
                expiryValue={expiryValue}
                setExpiryValue={setExpiryValue}
                notifyOnOpen={notifyOnOpen}
                setNotifyOnOpen={setNotifyOnOpen}
                notifyOnDestroyed={notifyOnDestroyed}
                setNotifyOnDestroyed={setNotifyOnDestroyed}
                canNotifyOnOpen={canNotifyOnOpen}
                noteLabel={noteLabel}
                setNoteLabel={setNoteLabel}
                isPremiumUser={isPremiumUser}
                premiumStatusLoading={premiumStatusLoading}
                restrictRecipientEmail={restrictRecipientEmail}
                setRestrictRecipientEmail={setRestrictRecipientEmail}
                requireRecipientVerification={requireRecipientVerification}
                setRequireRecipientVerification={setRequireRecipientVerification}
                recipientEmail={recipientEmail}
                setRecipientEmail={setRecipientEmail}
                readCount={readCount}
                setReadCount={setReadCount}
                fileAccessWindowSeconds={fileAccessWindowSeconds}
                setFileAccessWindowSeconds={setFileAccessWindowSeconds}
                readerLanguage={readerLanguage}
                setReaderLanguage={setReaderLanguage}
              />
            </Suspense>
          )}

          {/* Show create/settings when not in AI mode, or after the AI draft is accepted. */}
          {!isAiMode || (noteContent && isAiMode && !showPrompt && aiDraftAccepted) ? (
            <div className="space-y-3 mt-1">
              {isFileTransferMode && !selectedFile ? (
                <>
                  <input
                    ref={fileInputRef}
                    id={canAttachFiles ? fileTransferFileInputId : undefined}
                    type="file"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden
                    onChange={handleAttachFileSelected}
                  />
                  {folderInputMounted ? (
                    <input
                      ref={folderInputRef}
                      type="file"
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                      multiple
                      onChange={handleAttachFolderSelected}
                      {...({
                        webkitdirectory: "",
                        directory: "",
                      } as React.InputHTMLAttributes<HTMLInputElement> & {
                        webkitdirectory: string;
                        directory: string;
                      })}
                    />
                  ) : null}
                  <GravityDropZone
                    isDragOver={isFileDragOver}
                    onDragOver={handleDropZoneDragOver}
                    onDragLeave={handleDropZoneDragLeave}
                    onDrop={handleDropZoneDrop}
                    ariaLabel={t.sftDropZoneAriaLabel}
                    dropTitle={t.sftDropZoneTitle}
                    dropTitleDragging={t.sftDropZoneTitleDragging}
                    subtitle={t.sftDropZoneSubtitle}
                  >
                    {canAttachFiles ? (
                      <label
                        htmlFor={fileTransferFileInputId}
                        className="inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-primary bg-white px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/40 dark:bg-transparent dark:hover:bg-primary/10"
                      >
                        {t.sftSelectFile}
                      </label>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAttachFileClick}
                        className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-primary bg-white px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-transparent dark:hover:bg-primary/10"
                      >
                        {t.sftSelectFile}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAttachFolderClick}
                      disabled={isPreparingFolder}
                      className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-primary bg-white px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 dark:bg-transparent dark:hover:bg-primary/10"
                    >
                      {isPreparingFolder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
                          {t.sftZippingFolder}
                        </>
                      ) : (
                        t.sftSelectFolder
                      )}
                    </button>
                  </GravityDropZone>
                  <p className="mt-3 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {t.sftNeedHigherLimits}{" "}
                    <button
                      type="button"
                      onClick={() =>
                        toast({
                          title: t.sftPremiumComingSoonTitle,
                          description: t.sftPremiumComingSoonDescription,
                        })
                      }
                      className="font-medium text-primary hover:underline focus:outline-none"
                    >
                      {t.sftPremiumUpsell}
                    </button>
                  </p>
                </>
              ) : isFileTransferMode && selectedFile ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (customizeSheetExperiment) {
                        setCustomizeSheetOpen(true);
                      } else {
                        setShowAdvancedOptions(!showAdvancedOptions);
                      }
                    }}
                    className={`${secondaryActionButtonClass} min-h-11 min-w-0 flex-1 sm:flex-none sm:px-5`}
                  >
                    {customizeSheetExperiment || !showAdvancedOptions ? (
                      <>
                        <Settings className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t.customize}</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t.hideOptions}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full shrink-0 min-w-0 items-center justify-center rounded-lg border border-transparent bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-150 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                        {t.creatingSecureNote}
                      </>
                    ) : (
                      <>
                        <Lock className="mr-1.5 h-4 w-4" />
                        {t.sharePrivateNote}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={handleAttachFileSelected}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full min-w-0 items-center gap-2 sm:min-w-0 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (customizeSheetExperiment) {
                        setCustomizeSheetOpen(true);
                      } else {
                        setShowAdvancedOptions(!showAdvancedOptions);
                      }
                    }}
                    className={`${secondaryActionButtonClass} min-h-11 min-w-0 flex-1 sm:flex-none sm:px-5`}
                  >
                    {customizeSheetExperiment || !showAdvancedOptions ? (
                      <>
                        <Settings className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t.customize}</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t.hideOptions}</span>
                      </>
                    )}
                  </button>

                  <div
                    className={
                      selectedFile
                        ? "flex min-w-0 flex-1 items-center gap-1 sm:max-w-[14rem]"
                        : "flex min-w-0 flex-1 items-center gap-1 sm:flex-none"
                    }
                  >
                    <button
                      type="button"
                      onClick={handleAttachFileClick}
                      title={selectedFile ? selectedFile.name : undefined}
                      className={
                        selectedFile
                          ? `${secondaryActionButtonClass} min-h-11 w-full min-w-0 flex-1 gap-1.5 sm:px-5`
                          : `${secondaryActionButtonClass} min-h-11 w-full min-w-0 flex-1 gap-1.5 sm:w-auto sm:flex-none sm:px-5`
                      }
                    >
                      <Paperclip className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className={selectedFile ? "truncate" : "whitespace-nowrap"}>
                        {attachFileButtonLabel}
                      </span>
                    </button>
                    {selectedFile ? (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        aria-label={t.removeSelectedFile ?? "Remove selected file"}
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full shrink-0 min-w-0 items-center justify-center rounded-lg border border-transparent bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-150 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t.creatingSecureNote}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-1.5" />
                      {t.sharePrivateNote}
                    </>
                  )}
                </button>
              </div>
                </>
              )}
            </div>
          ) : null}
        </form>
      </div>

      {customizeSheetExperiment && (!isAiMode || aiDraftAccepted) && (!isFileTransferMode || selectedFile) ? (
        <Suspense fallback={null}>
          <CustomizeSettingsOverlay
            open={customizeSheetOpen}
            onOpenChange={setCustomizeSheetOpen}
            isMobile={isMobile}
            settings={{
              password,
              setPassword,
              showPassword,
              setShowPassword,
              passwordSource,
              setPasswordSource,
              passwordStrength,
              breachState,
              breachCount,
              expiryValue,
              setExpiryValue,
              notifyOnOpen,
              setNotifyOnOpen,
              notifyOnDestroyed,
              setNotifyOnDestroyed,
              canNotifyOnOpen,
              noteLabel,
              setNoteLabel,
              isPremiumUser,
              premiumStatusLoading,
              restrictRecipientEmail,
              setRestrictRecipientEmail,
              requireRecipientVerification,
              setRequireRecipientVerification,
              recipientEmail,
              setRecipientEmail,
              readCount,
              setReadCount,
              fileAccessWindowSeconds,
              setFileAccessWindowSeconds,
              readerLanguage,
              setReaderLanguage,
            }}
          />
        </Suspense>
      ) : null}

      {shouldRenderDeferredDialogs ? (
        <Suspense fallback={null}>
          <CreateNoteDeferredDialogs
            aiProgress={aiProgress}
            attachmentProgress={attachmentProgress}
            cellularPreloadConfirmOpen={cellularPreloadConfirmOpen}
            isGeneratingContent={isGeneratingContent && !usesHostedCloudAi}
            onStartFreeModelDownload={() => {
              void startFreeModelDownload();
            }}
            onUseCloudAssist={handleUseCloudAssist}
            onWriteWithoutAi={() => setIsAiMode(false)}
            setCellularPreloadConfirmOpen={setCellularPreloadConfirmOpen}
            setShowTemplateOfferPrompt={setShowTemplateOfferPrompt}
            showTemplateOfferPrompt={showTemplateOfferPrompt}
          />
        </Suspense>
      ) : null}
    </section>
  );
};
