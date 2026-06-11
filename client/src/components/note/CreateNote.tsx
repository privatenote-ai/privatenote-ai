import React, { Suspense, lazy, useEffect, useRef, useState, useCallback } from "react";
import { apiBinaryRequest, apiRequest, ApiRequestError, getFileUploadTargetLabel, logFileUpload } from "@/lib/queryClient";
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
  X,
} from "lucide-react";
import { usePasswordBreachCheck } from "@/hooks/usePasswordBreachCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQrShare } from "@/hooks/useQrShare";
import { usePrefillFromFragment } from "@/hooks/usePrefillFromFragment";
import { isCustomizeSheetExperimentEnabled } from "@/features/customizeSheetExperiment";
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
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
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

type PromptTemplatesModule = typeof import("@/components/note/promptTemplates");
let promptTemplatesModulePromise: Promise<PromptTemplatesModule> | null = null;

function loadPromptTemplatesModule(): Promise<PromptTemplatesModule> {
  if (!promptTemplatesModulePromise) {
    promptTemplatesModulePromise = import("@/components/note/promptTemplates");
  }
  return promptTemplatesModulePromise;
}

function copyToExactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function uploadEncryptedAttachmentChunk(
  url: string,
  encryptedBytes: Uint8Array,
  headers: Record<string, string>,
  uploadToken: string,
): Promise<void> {
  const chunkIndex = url.match(/\/chunks\/(\d+)$/)?.[1] ?? "?";
  const declaredSize = Number(headers["x-file-chunk-encrypted-size"] ?? NaN);
  const body = copyToExactArrayBuffer(encryptedBytes);
  logFileUpload("info", "uploading chunk", {
    chunkIndex,
    encryptedBytes: encryptedBytes.byteLength,
    bodyBytes: body.byteLength,
    declaredChunkSize: Number.isFinite(declaredSize) ? declaredSize : null,
    sizeMismatch: Number.isFinite(declaredSize) ? declaredSize !== body.byteLength : null,
    url,
  });
  try {
    await apiBinaryRequest<{ encryptedSize: number }>(url, "PUT", body, headers, { uploadToken });
    logFileUpload("info", "chunk uploaded", { chunkIndex, url });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      logFileUpload("error", "chunk rejected by server", {
        chunkIndex,
        url,
        status: error.status,
        bodyPreview: error.bodyText.slice(0, 500),
      });
      throw error;
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
  if (!t) return "Working…";
  // After load, WebLLM reports "ready"; keep "analyzing" until streaming updates the headline.
  if (t === "Ready to generate") return localAiAnalyzingPromptLabel();
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
}

type AccountType = "free" | "personal_premium" | "business_premium";

function normalizeAccountType(value: unknown): AccountType {
  if (value === "personal_premium" || value === "pro" || value === "premium") return "personal_premium";
  if (value === "business_premium" || value === "business") return "business_premium";
  return "free";
}

export const CreateNote: React.FC<CreateNoteProps> = ({ onSuccessStateChange }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // ── Note content ──────────────────────────────────────────────────────────
  const [noteContent, setNoteContent] = useState("");

  // ── Submission ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

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
  const [preferHostedCloudAfterLocalFailure, setPreferHostedCloudAfterLocalFailure] = useState(false);
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
  const [nonPrivateSessionAcknowledged, setNonPrivateSessionAcknowledged] = useState(false);

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
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [accountEmailNotifications, setAccountEmailNotifications] = useState(false);
  const [accountEmailVerified, setAccountEmailVerified] = useState(false);
  const [premiumStatusLoading, setPremiumStatusLoading] = useState(false);
  const [readCount, setReadCount] = useState<NoteReadLimit>(NOTE_READ_LIMIT_DEFAULT);
  const [fileAccessWindowSeconds, setFileAccessWindowSeconds] =
    useState<NoteFileAccessWindowSeconds>(NOTE_FILE_ACCESS_DEFAULT_SECONDS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isPasswordProtected = password.trim().length > 0;
  const isPremiumUser = accountType === "personal_premium" || accountType === "business_premium";
  const canAttachFiles = Boolean(user);
  const canNotifyOnOpen = isPremiumUser && accountEmailNotifications && accountEmailVerified;
  const fileLimitBytes = noteFileLimitBytesForAccount(isPremiumUser);

  const { toast } = useToast();

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

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setAccountType("free");
      setAccountEmailNotifications(false);
      setAccountEmailVerified(false);
      setNotifyOnOpen(false);
      setNotifyOnDestroyed(false);
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

  // ── Content helpers ───────────────────────────────────────────────────────
  const setNoteContentFromAiOutput = useCallback(
    (raw: string) => {
      const { text, truncated } = truncateUtf8StringToMaxBytes(raw, MAX_NOTE_PLAINTEXT_UTF8_BYTES);
      if (truncated) {
        toast({
          title: "Content trimmed",
          description: `AI output exceeded the ${String(MAX_NOTE_PLAINTEXT_UTF8_BYTES / 1024)} KB UTF-8 limit for AI mode and was shortened.`,
        });
      }
      setNoteContent(text);
    },
    [toast],
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
        toast({ title: "Content trimmed", description: trimDescription });
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
    setAiModelProgress({ progress: 0, text: "Preparing private AI…" });
    try {
      await ensureFreeLocalModel((progress) => setAiModelProgress(progress));
      setAiModelProgress(null);
      setPreferHostedCloudAfterLocalFailure(false);
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
    setAiProgress({ progress: 0, text: "Initializing AI..." });
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
          setAiTurnstileError("Human verification failed. Please try again.");
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
          setAiTurnstileError("Human verification failed to load. Please try again.");
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

    if (!noteContent.trim() && !selectedFile) {
      toast({
        title: "Error",
        description: "Add note content or attach a file.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile && selectedFile.size > fileLimitBytes) {
      toast({
        title: t.fileTooLarge ?? "File too large",
        description: (t.fileTooLargeDescription ?? "Maximum file size is {limit} for your account.").replace(
          "{limit}",
          formatNoteFileSize(fileLimitBytes),
        ),
        variant: "destructive",
      });
      return;
    }

    if (selectedFile && !canAttachFiles) {
      toast({
        title: t.signInToAttachFiles ?? "Sign in to attach files",
        description:
          t.signInToAttachFilesHint ?? "Sign in to add encrypted file attachments.",
        variant: "destructive",
      });
      return;
    }

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
        title: "Note too large",
        description: `Notes are limited to ${String(MAX_NOTE_PLAINTEXT_UTF8_BYTES / 1024)} KB of UTF-8 text to keep encryption fast and reliable.`,
        variant: "destructive",
      });
      return;
    }

    if (isAiMode && shouldShowAiTurnstile && !aiTurnstileToken) {
      toast({
        title: "Human verification required",
        description: "Please complete the verification check below before creating the note.",
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
        title: "Just a moment…",
        description: "Please wait a moment before submitting.",
      });
      return;
    }

    setIsLoading(true);

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

      const { SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES } = await import("@/utils/libsodiumFileAttachment");
      const attachmentReserveBinding = selectedFile
        ? {
            attachmentPlaintextSize: selectedFile.size,
            attachmentEncryptedSize:
              selectedFile.size +
              Math.max(1, Math.ceil(selectedFile.size / SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES)) * 17,
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
            Math.ceil(selectedFile.size / SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES),
          );
          const encryptedSizeUpperBound = selectedFile.size + totalChunks * 17;
          logFileUpload("info", "starting attachment encryption", {
            noteId: reservedId,
            fileName: selectedFile.name,
            fileType: selectedFile.type || "application/octet-stream",
            fileSize: selectedFile.size,
            totalChunks,
            chunkSizeBytes: SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES,
            encryptedSizeUpperBound,
            apiBase: getFileUploadTargetLabel(),
          });
          attachment = await encryptFileToSodiumChunks(
            selectedFile,
            fileWrapKey!,
            metadataKey!,
            reservedId,
            async (chunk) => {
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
              );
            },
          );
          logFileUpload("info", "attachment encryption complete", {
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

      const { id } = await apiRequest("/api/notes", "POST", {
        id: reservedId,
        content: encryptedBase64,
        iv: ivBase64,
        expirySeconds,
        maxReads: readCount,
        notifyOnOpen: notifyOnOpen && canNotifyOnOpen,
        notifyOnDestroyed: notifyOnDestroyed && canNotifyOnOpen,
        fileAccessWindowSeconds,
        aiMode: isAiMode,
        uiLanguage: language,
        isPasswordProtected,
        keyDerivation: NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
        aad,
        ...(attachment
          ? { attachment, attachmentContentHash: attachment.encryptedContentSha256 }
          : {}),
        _hp: honeypotValue,
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

      setCreatedNote({ url, meta: { expiryValue, readCount, isPasswordProtected } });
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
              title: "Verification required",
              description: "Complete the check below, then try creating the note again.",
              variant: "destructive",
            });
            return;
          }
        } catch {
          // not JSON
        }
      }

      let errorMessage = "Failed to create encrypted note. Please try again.";
      if (error instanceof Error) {
        const statusMatch = error.message.match(/^(\d+):/);
        if (statusMatch) {
          const status = statusMatch[1];
          errorMessage = import.meta.env.DEV
            ? `Server error (${status}). Please check the console for details.`
            : `Server error (${status}). Please try again.`;
        } else {
          errorMessage = import.meta.env.DEV ? error.message || errorMessage : errorMessage;
        }
      }

      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Success actions ───────────────────────────────────────────────────────
  const copyToClipboard = async () => {
    if (!noteUrl) return;
    try {
      await navigator.clipboard.writeText(noteUrl);
      setSuccessLinkCopied(true);
      toast({ title: "Copied!", description: "Secret note link copied to clipboard" });
    } catch {
      toast({
        title: "Couldn't copy link",
        description: "Select the link in the field above and copy it manually.",
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

  const handleAllowHostedAiChange = useCallback(
    async (allowed: boolean) => {
      setAllowHostedAi(allowed);
      writeLocalHostedAiAllowed(allowed);
      if (!allowed) {
        setNonPrivateSessionAcknowledged(false);
      }
      if (!user) return;
      try {
        await apiRequest("/api/auth/account/preferences", "PATCH", { allowHostedAi: allowed });
      } catch {
        setAllowHostedAi(!allowed);
        writeLocalHostedAiAllowed(!allowed);
        toast({
          title: "Could not save hosted AI preference",
          description: "Try again from Account → Preferences.",
          variant: "destructive",
        });
      }
    },
    [user, toast],
  );

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiRequest<{ ok: boolean; allowHostedAi?: boolean }>(
          "/api/auth/account/summary",
          "GET",
        );
        if (!cancelled && data.ok && typeof data.allowHostedAi === "boolean") {
          setAllowHostedAi(data.allowHostedAi);
          writeLocalHostedAiAllowed(data.allowHostedAi);
        }
      } catch {
        /* non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleHostedCloudGenerate = async (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => {
    const promptToUse = override?.prompt ?? aiPrompt;
    const enhancementTypeToUse = override?.enhancementType ?? aiEnhancementType;
    if (!promptToUse.trim()) {
      toast({ title: "Error", description: "Please enter a prompt first", variant: "destructive" });
      return;
    }

    setIsGeneratingContent(true);
    setHostedCloudAiStatusText("Cloud assist is writing with Llama 3.2 3B...");
    if (!originalPrompt) setOriginalPrompt(promptToUse);
    setUserPromptHistory((prev) => {
      if (prev.length === 0 || prev[prev.length - 1] !== promptToUse) {
        return [...prev, promptToUse];
      }
      return prev;
    });

    try {
      const response = await generateHostedCloudDraft({
        prompt: promptToUse,
        enhancementType: enhancementTypeToUse,
        language,
        sentenceLength: aiSentenceLength,
      });
      setHostedCloudAiLimit(response.limit);
      setHostedCloudAiRemaining(response.remaining);
      setNoteContentFromAiOutput(response.text);
      setTransformHistory([]);
      setShowPrompt(false);
      setAiDraftAccepted(false);
      toast({
        title: "Cloud draft created",
        description: `${response.remaining} of ${response.limit} free hosted drafts left today.`,
      });
    } catch (error) {
      const parsed = parseHostedCloudAiError(error);
      if (parsed.code === "hosted_ai_quota_exhausted") {
        setHostedCloudAiRemaining(0);
        toast({
          title: "Free hosted drafts used",
          description: "Use the offline templates today, or move to premium when it is available.",
          variant: "destructive",
        });
      } else if (parsed.code === "prompt_too_long") {
        toast({
          title: "Prompt is too long",
          description: parsed.message ?? "Shorten the prompt and try again.",
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_fair_use_limit_reached") {
        toast({
          title: "Monthly fair-use limit reached",
          description: parsed.message ?? "Monthly fair-use text processing limit reached.",
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_auth_required") {
        toast({
          title: "Sign in required",
          description: parsed.message ?? "Sign in to use hosted AI.",
          variant: "destructive",
        });
      } else if (parsed.code === "hosted_ai_not_enabled" || parsed.code === "hosted_ai_consent_required") {
        setAllowHostedAi(false);
        setNonPrivateSessionAcknowledged(false);
        writeLocalHostedAiAllowed(false);
        toast({
          title: "Non-private hosted AI is off",
          description:
            parsed.message ??
            "Enable it in Account → Preferences and confirm you understand prompts leave this device.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cloud assist unavailable",
          description: "Use the offline templates, or try hosted generation again later.",
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
          title: "Private AI is not available on this device",
          description: "Use Cloud Assist (not fully private) or write without AI.",
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
      toast({ title: "Error", description: "Please enter a prompt for the AI", variant: "destructive" });
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
      toast({ title: "Previous version restored", description: "Undid the last AI change to your note content." });
      return;
    }

    setShowPrompt(true);
    setAiDraftAccepted(false);

    if (userPromptHistory.length > 0) {
      const next = [...userPromptHistory];
      const previousPrompt = next.pop() || "";
      setUserPromptHistory(next);
      setAiPrompt(previousPrompt);
      toast({ title: "Previous prompt restored", description: "You can edit this prompt and regenerate content." });
    } else if (originalPrompt) {
      setAiPrompt(originalPrompt);
      toast({ title: "Original prompt restored", description: "You're back to where you started." });
    }
  };

  const handleImprove = async () => {
    if (!noteContent) return;
    setTransformHistory((prev) => [...prev, { kind: "improve", contentBefore: noteContent }]);
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: "Initializing AI..." });
    try {
      const content = await runFreeLocalEnhancement(noteContent, "improve");
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: "Content Improved", description: "The AI has refined your content for better clarity and style." });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: "No change applied",
          description: "On-device AI could not refine this pass. Your previous text is still there.",
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
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: "Initializing AI..." });
    try {
      const content = await runFreeLocalEnhancement(noteContent, "summarize");
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: "Content Summarized", description: "The AI has summarized your content to its key points." });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: "No change applied",
          description: "On-device AI could not summarize this pass. Your previous text is still there.",
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
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: "Initializing AI..." });
    try {
      const content = await runFreeLocalEnhancement(noteContent, "simplify");
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: "Content Simplified", description: "The AI has simplified your content for easier reading." });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: "No change applied",
          description: "On-device AI could not simplify this pass. Your previous text is still there.",
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
    setIsGeneratingContent(true);
    setAiProgress({ progress: 0, text: "Initializing AI..." });
    try {
      const content = await runFreeLocalEnhancement(promptToUse, enhancementTypeToUse, {
        useBuiltTemplatePrompt: true,
        promptAnalysisDwellMs: LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS,
      });
      setNoteContentFromAiOutput(content);
      setAiDraftAccepted(false);
      toast({ title: "Content Regenerated", description: "The AI has created a new version based on your original prompt." });
    } catch {
      if (isLocalAiSupported()) {
        toast({
          title: "No change applied",
          description: "On-device AI could not regenerate this pass. Your previous text is still there.",
        });
      }
    } finally {
      setIsGeneratingContent(false);
      setAiProgress(null);
    }
  };

  // ── Privacy banner (passed to AiComposer) ────────────────────────────────
  const privacyBannerItems = (
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
  );

  const shouldRenderDeferredDialogs =
    isGeneratingContent || cellularPreloadConfirmOpen || showTemplateOfferPrompt;

  const handleUseCloudAssist = useCallback(() => {
    setShowTemplateOfferPrompt(false);
    setPreferHostedCloudAfterLocalFailure(true);
    setIsAiMode(true);
    setShowPrompt(true);
    aiComposerAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
      />
    );
  }

  // ── Create form ───────────────────────────────────────────────────────────
  return (
    <section className="mx-auto w-full min-w-0 max-w-full">
      <div className="pt-4">
        {/* Mode toggle */}
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
                <span className="inline md:hidden">{t.privateAiShort}</span>
                <span className="hidden md:inline">{t.writeWithPrivateAi}</span>
              </div>
            </button>
          </div>
        </div>

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
                allowHostedAi={allowHostedAi}
                onAllowHostedAiChange={handleAllowHostedAiChange}
                nonPrivateSessionAcknowledged={nonPrivateSessionAcknowledged}
                onNonPrivateSessionAcknowledgedChange={setNonPrivateSessionAcknowledged}
                preferencesHref={localizedPath("/account/preferences", language)}
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
                onWriteWithoutAi={() => setIsAiMode(false)}
                />
              </Suspense>
            </div>
          ) : null}

          {shouldShowAiTurnstile && (
            <div
              className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 px-4 py-4"
              role="region"
              aria-label="Human verification"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                This check appears only when our systems flag unusual activity (for example many quick requests).
                Complete it once to keep using AI mode.
              </p>
              <div id="create-note-turnstile-container" className="min-h-[65px] flex justify-center" />
              {!aiTurnstileReady && !aiTurnstileError && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Loading verification…</p>
              )}
              {aiTurnstileError && (
                <p className="text-xs text-red-500 text-center mt-2">{aiTurnstileError}</p>
              )}
            </div>
          )}

          {!isAiMode ? (
            <div className="mb-4">
              <PrefillPartnerBanner
                visible={showPrefillBanner}
                referrer={prefillReferrer}
                onDismiss={dismissPrefillBanner}
              />
              <NotePlaintextUtf8Meter
                noteContent={noteContent}
                maxBytes={MAX_NOTE_PLAINTEXT_UTF8_BYTES}
              />
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
              <div className="mt-2 rounded-md border border-gray-200/70 bg-gray-50/40 px-2.5 py-2 dark:border-gray-800/50 dark:bg-gray-900/20">
                <div className="flex items-center gap-2">
                  <Paperclip
                    className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                      {t.encryptedFileSharingTitle ?? "Encrypted file sharing"}
                    </p>
                    <p className="truncate text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                      {t.encryptedFileSharingDescription ??
                        "Share files with end-to-end encryption."}
                    </p>
                  </div>
                  {canAttachFiles ? (
                    <label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900 sm:px-3 sm:py-1.5 sm:text-xs">
                      {t.attachFiles ?? "Attach files"}
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          event.target.value = "";
                          if (!file) return;
                          if (file.size > fileLimitBytes) {
                            toast({
                              title: t.fileTooLarge ?? "File too large",
                              description: (
                                t.fileTooLargeDescription ??
                                "Maximum file size is {limit} for your account."
                              ).replace("{limit}", formatNoteFileSize(fileLimitBytes)),
                              variant: "destructive",
                            });
                            return;
                          }
                          setSelectedFile(file);
                        }}
                      />
                    </label>
                  ) : (
                    <a
                      href={localizedPath("/auth/sign-in", language)}
                      className="inline-flex shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900 sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      {t.enableFileSharing ?? "Enable file sharing"}
                    </a>
                  )}
                </div>
                {selectedFile ? (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded border border-gray-200/80 bg-white/80 px-2 py-1.5 dark:border-gray-800/80 dark:bg-gray-950/60">
                    <div className="min-w-0 text-xs">
                      <p className="truncate font-medium text-gray-800 dark:text-gray-200">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {formatNoteFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      aria-label={t.removeSelectedFile ?? "Remove selected file"}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="mt-2 hidden md:flex flex-nowrap items-center gap-x-3 text-[11px] text-gray-500 dark:text-gray-400">
                {privacyBannerItems}
              </div>
            </div>
          ) : null}

          <div className="mt-[-0.5rem]" />

          {(!isAiMode || aiDraftAccepted) && !customizeSheetExperiment && (
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
                isPremiumUser={isPremiumUser}
                premiumStatusLoading={premiumStatusLoading}
                readCount={readCount}
                setReadCount={setReadCount}
                fileAccessWindowSeconds={fileAccessWindowSeconds}
                setFileAccessWindowSeconds={setFileAccessWindowSeconds}
              />
            </Suspense>
          )}

          {/* Show create/settings when not in AI mode, or after the AI draft is accepted. */}
          {!isAiMode || (noteContent && isAiMode && !showPrompt && aiDraftAccepted) ? (
            <div className="space-y-3 mt-1">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (customizeSheetExperiment) {
                      setCustomizeSheetOpen(true);
                    } else {
                      setShowAdvancedOptions(!showAdvancedOptions);
                    }
                  }}
                  className="flex w-full min-w-0 items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/80 sm:w-auto sm:min-w-[180px]"
                >
                  {customizeSheetExperiment || !showAdvancedOptions ? (
                    <>
                      <Settings className="w-4 h-4 mr-1.5 text-primary" />
                      <span>{t.customize}</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1.5 text-primary" />
                      <span>{t.hideOptions}</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full min-w-0 items-center justify-center rounded-lg border border-transparent bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-150 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
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
            </div>
          ) : null}
        </form>
      </div>

      {customizeSheetExperiment && (!isAiMode || aiDraftAccepted) ? (
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
              isPremiumUser,
              premiumStatusLoading,
              readCount,
              setReadCount,
              fileAccessWindowSeconds,
              setFileAccessWindowSeconds,
            }}
          />
        </Suspense>
      ) : null}

      {shouldRenderDeferredDialogs ? (
        <Suspense fallback={null}>
          <CreateNoteDeferredDialogs
            aiProgress={aiProgress}
            cellularPreloadConfirmOpen={cellularPreloadConfirmOpen}
            isGeneratingContent={isGeneratingContent}
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
