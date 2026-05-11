import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { getTurnstileSiteKeyForClient } from "@/lib/turnstileClient";
import {
  encryptNote,
  generateContentKey,
  arrayBufferToBase64,
  encryptWithPassword,
  serializeEncryptedPayload,
} from "@/utils/encryption";
import {
  MAX_NOTE_PLAINTEXT_UTF8_BYTES,
  truncateUtf8StringToMaxBytes,
  utf8ByteLength,
} from "@shared/noteSizeLimits";
import {
  NOTE_EXPIRY_DEFAULT_PRESET_ID,
  noteExpiryPresetIdToSeconds,
  type NoteExpiryPresetId,
} from "@shared/noteExpiry";
import { normalizeUrlFragmentKey } from "@shared/urlFragmentKey";
import {
  enhanceNoteClientSide,
  initializeClientLLM,
  isEngineLoaded,
  isLocalAiSupported,
  getLocalAiSupportHint,
  getRecommendedLocalModelId,
  MODEL_GEMMA_2_2B,
  MODEL_LLAMA_3_2_1B,
  MODEL_QWEN_0_6,
  resetLocalAiLoadState,
  clearEngine,
  isWebLlmGpuOrDisposeFailure,
  type ModelLoadProgress,
} from "@/utils/clientLLM";
import {
  localAiAnalyzingPromptLabel,
  localAiAnalyzingDetailHint,
  LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS,
  getLocalAiGenerationGlyph,
} from "@/utils/localAiUxText";
import { useToast } from "@/hooks/use-toast";
import {
  getPromptTemplatesForLanguage,
  buildPromptFromTemplate,
  formatSentenceLengthUserSuffix,
  applySentenceLengthToUserPrompt,
  type PromptTemplate,
  type AiSentenceLengthId,
} from "@/components/note/promptTemplates";
import { getLoadedModelIdWebLLM } from "@/utils/webllm-engine";
import { getLocalAiPreloadNetworkPolicy } from "@/utils/localAiNetworkDownloadPolicy";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Lock,
  ChevronUp,
  Eye,
  Key,
  Settings,
  Sparkles,
  Loader2,
} from "lucide-react";
import { usePasswordBreachCheck } from "@/hooks/usePasswordBreachCheck";
import { useQrShare } from "@/hooks/useQrShare";
import { usePrefillFromFragment } from "@/hooks/usePrefillFromFragment";
import { CreateNoteSuccess } from "./CreateNoteSuccess";
import type { CreatedNoteState } from "./CreateNoteSuccess";
import { NoteSettingsPanel } from "./NoteSettingsPanel";
import { AiComposer } from "./AiComposer";
import type { AiPostGenTransform } from "./AiComposer";
import { NotePlaintextUtf8Meter } from "./NotePlaintextUtf8Meter";
import { PrefillPartnerBanner } from "./PrefillPartnerBanner";
import { ThinkingBrainIcon } from "./ThinkingBrainIcon";
import { WritingPencilIcon } from "./WritingPencilIcon";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";

function localAiDialogPrimaryLine(progress: { text: string } | null): string {
  const t = progress?.text?.trim() ?? "";
  if (!t) return "Working…";
  // After load, WebLLM reports "ready"; keep "analyzing" until streaming updates the headline.
  if (t === "Ready to generate") return localAiAnalyzingPromptLabel();
  return t;
}

function askAnythingScaffoldPrompt(sentenceLength: AiSentenceLengthId, language: SupportedLanguage): string {
  const templates = getPromptTemplatesForLanguage(language);
  const tmpl = templates.find((x) => x.id === "ask-anything");
  const base = tmpl?.userTemplate ?? "";
  return `${base}\n${formatSentenceLengthUserSuffix(sentenceLength, language)}`;
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
  return expiryValue;
}

interface CreateNoteProps {
  onSuccessStateChange?: (isSuccess: boolean) => void;
}

export const CreateNote: React.FC<CreateNoteProps> = ({ onSuccessStateChange }) => {
  const { t, language } = useLanguage();
  const promptTemplates = useMemo(() => getPromptTemplatesForLanguage(language), [language]);

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
  const [aiPrompt, setAiPrompt] = useState(() => askAnythingScaffoldPrompt("2-3", language));
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [aiEnhancementType, setAiEnhancementType] = useState<
    "improve" | "summarize" | "secure" | "ask"
  >(
    () =>
      getPromptTemplatesForLanguage(language).find((x) => x.id === "ask-anything")
        ?.enhancementType ?? "improve",
  );
  const [aiProgress, setAiProgress] = useState<ModelLoadProgress | null>(null);
  const [isAiModelLoading, setIsAiModelLoading] = useState(false);
  const [aiModelProgress, setAiModelProgress] = useState<{
    progress: number;
    text: string;
    detail?: string;
  } | null>(null);
  const [showTemplateOfferPrompt, setShowTemplateOfferPrompt] = useState(false);
  const [cellularPreloadConfirmOpen, setCellularPreloadConfirmOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>("ask-anything");
  const [aiSentenceLength, setAiSentenceLength] = useState<AiSentenceLengthId>("2-3");
  const [showPrompt, setShowPrompt] = useState<boolean>(true);
  const [originalPrompt, setOriginalPrompt] = useState<string>("");
  const [userPromptHistory, setUserPromptHistory] = useState<string[]>([]);
  const [transformHistory, setTransformHistory] = useState<AiPostGenTransform[]>([]);
  const [aiDraftAccepted, setAiDraftAccepted] = useState(false);

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
  const [expiryValue, setExpiryValue] = useState<NoteExpiryPresetId>(NOTE_EXPIRY_DEFAULT_PRESET_ID);
  const readCount = 1;
  const isPasswordProtected = password.trim().length > 0;

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
    setShowTemplateOfferPrompt(true);
    setIsAiMode(true);
    setSelectedTemplateId((prev) => prev ?? "ask-anything");
    setShowPrompt(true);
  }, []);

  const ensureFreeLocalModel = useCallback(
    async (onProgress?: (progress: { progress: number; text: string }) => void) => {
      if (!isLocalAiSupported()) {
        throw new Error(
          getLocalAiSupportHint() ??
            "On-device AI isn't available right now. If a previous attempt failed, try resetting and starting again."
        );
      }
      const modelId = await getRecommendedLocalModelId();
      if (!modelId) {
        throw new Error(getLocalAiSupportHint() ?? "On-device AI is not available on this device.");
      }
      try {
        await initializeClientLLM(onProgress, modelId);
      } catch (error) {
        if (modelId === MODEL_GEMMA_2_2B) {
          console.warn("[AI] Gemma 2 failed; falling back to compact local model:", error);
          clearEngine();
          await initializeClientLLM(onProgress, MODEL_QWEN_0_6);
          return;
        }
        if (modelId === MODEL_LLAMA_3_2_1B) {
          console.warn("[AI] Llama 3.2 1B failed; falling back to Qwen 0.6:", error);
          clearEngine();
          await initializeClientLLM(onProgress, MODEL_QWEN_0_6);
          return;
        }
        throw error;
      }
    },
    [],
  );

  const startFreeModelDownload = useCallback(async () => {
    if (isEngineLoaded() || isAiModelLoading) return;
    setIsAiModelLoading(true);
    setAiModelProgress({ progress: 0, text: "Preparing private AI…" });
    try {
      await ensureFreeLocalModel((progress) => setAiModelProgress(progress));
      setAiModelProgress(null);
    } catch (error) {
      console.warn("[AI] Failed to preload free model:", error);
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "On-device AI could not start",
        description: message,
        variant: "destructive",
      });
      setAiModelProgress(null);
      offerTemplateFallback();
    } finally {
      setIsAiModelLoading(false);
    }
  }, [ensureFreeLocalModel, isAiModelLoading, toast, offerTemplateFallback]);

  const resetFreeModelDownloadState = useCallback(async () => {
    setShowTemplateOfferPrompt(false);
    try {
      // Always clear caches even when no modelId is resolvable — a stuck session
      // failure flag would otherwise make getRecommendedLocalModelId() return null
      // and block the reset entirely. resetLocalAiLoadState() handles undefined
      // modelId by collecting known IDs internally and clears session flags first.
      await resetLocalAiLoadState(undefined);
      toast({
        title: "On-device AI reset",
        description: "The incomplete download was cleared. You can try downloading it again.",
      });
    } catch (error) {
      console.warn("[AI] Failed to reset local model state before retry:", error);
      toast({
        title: "Reset failed",
        description: "We couldn't clear the local AI download on this device.",
        variant: "destructive",
      });
      return;
    }
  }, [toast]);

  useEffect(() => {
    if (selectedTemplateId !== "ask-anything") return;
    setAiPrompt(askAnythingScaffoldPrompt(aiSentenceLength, language));
    // Only refresh scaffold when UI language changes (not when the user edits the prompt).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const retryFreeModelDownloadAfterReset = useCallback(async () => {
    await resetFreeModelDownloadState();
    void startFreeModelDownload();
  }, [resetFreeModelDownloadState, startFreeModelDownload]);

  const enterAiMode = useCallback(() => {
    setIsAiMode(true);
    if (!isLocalAiSupported()) return;
    if (isEngineLoaded()) return;
    if (getLocalAiPreloadNetworkPolicy() === "confirm") {
      setCellularPreloadConfirmOpen(true);
      return;
    }
    void startFreeModelDownload();
  }, [startFreeModelDownload]);

  const runFreeLocalEnhancement = async (
    content: string,
    enhancementType: "improve" | "summarize" | "secure" | "ask" | "simplify",
    options?: { useBuiltTemplatePrompt?: boolean; promptAnalysisDwellMs?: number },
  ): Promise<string> => {
    setAiProgress({ progress: 0, text: "Initializing AI..." });
    try {
      await ensureFreeLocalModel((progress) => setAiProgress(progress));
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
      const modelId = getLoadedModelIdWebLLM() ?? (await getRecommendedLocalModelId());
      if (!modelId) {
        throw new Error(getLocalAiSupportHint() ?? "On-device AI is not available on this device.");
      }
      const finalUserMessage =
        useBuild && selectedTemplate
          ? buildPromptFromTemplate(
              selectedTemplate,
              content.trim(),
              modelId,
              aiSentenceLength,
              language,
            )
          : undefined;
      return await enhanceNoteClientSide(content, enhancementTypeForModel, (p) => setAiProgress(p), {
        ...baseOpts,
        ...(finalUserMessage ? { finalUserMessage } : {}),
        templateId: selectedTemplateId ?? undefined,
        promptLocale: language,
      });
    } catch (error) {
      if (isWebLlmGpuOrDisposeFailure(error)) {
        clearEngine();
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

    let intervalId: number | null = null;
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

    if (!window.turnstile) {
      intervalId = window.setInterval(() => {
        if (window.turnstile) {
          if (intervalId !== null) window.clearInterval(intervalId);
          initTurnstile();
        }
      }, 200);
    } else {
      initTurnstile();
    }

    return () => {
      if (intervalId !== null) window.clearInterval(intervalId);
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

    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
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
      let encryptedBase64,
        ivBase64,
        exportedKey,
        saltBase64,
        encryptedKeyBase64,
        encryptedKeyIvBase64;
      const encodeBase64 = (value: ArrayBuffer | Uint8Array) => {
        const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
        const copy = new Uint8Array(bytes.byteLength);
        copy.set(bytes);
        return arrayBufferToBase64(copy.buffer);
      };

      const { id: reservedId } = await apiRequest("/api/notes/reserve", "POST");
      const expirySeconds = noteExpiryPresetIdToSeconds(expiryValue);

      let aad: string;
      let kdfParams: unknown;

      const aadBinding = {
        noteId: reservedId,
        expirySeconds,
        maxReads: readCount,
      };

      if (isPasswordProtected) {
        const encryptionResult = await encryptWithPassword(noteContent, password, aadBinding);
        const { encryptedData, iv, salt, encryptedKey, encryptedKeyIv, aadBytes } = encryptionResult;
        const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
        aad = wirePayload.aad;
        kdfParams = encryptionResult.kdfParams;
        encryptedBase64 = wirePayload.content;
        ivBase64 = wirePayload.iv;
        saltBase64 = encodeBase64(salt);
        encryptedKeyBase64 = encodeBase64(encryptedKey);
        encryptedKeyIvBase64 = encodeBase64(encryptedKeyIv);
      } else {
        const { key, exportedKey: generatedKey } = await generateContentKey();
        exportedKey = generatedKey;
        const encryptionResult = await encryptNote(noteContent, key, aadBinding);
        const { encryptedData, iv, aadBytes } = encryptionResult;
        const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
        aad = wirePayload.aad;
        encryptedBase64 = wirePayload.content;
        ivBase64 = wirePayload.iv;
      }

      const { id } = await apiRequest("/api/notes", "POST", {
        id: reservedId,
        content: encryptedBase64,
        iv: ivBase64,
        expirySeconds,
        maxReads: readCount,
        aiMode: isAiMode,
        isPasswordProtected,
        aad,
        _hp: honeypotValue,
        ...(prefillReferrer ? { referrer: prefillReferrer } : {}),
        ...(isAiMode && aiTurnstileToken && { turnstileToken: aiTurnstileToken }),
        ...(isPasswordProtected && {
          salt: saltBase64,
          encryptedKey: encryptedKeyBase64,
          encryptedKeyIv: encryptedKeyIvBase64,
          kdfParams,
        }),
      });

      const baseUrl = window.location.origin;
      const fragmentKey = isPasswordProtected ? encryptedKeyBase64 : exportedKey;
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
        console.error("[CreateNote] Failed to create note");
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
    setAiPrompt(askAnythingScaffoldPrompt("2-3", language));
    setOriginalPrompt("");
    setUserPromptHistory([]);
    setTransformHistory([]);
    setShowAdvancedOptions(false);
    setShowPrompt(true);
    setAiDraftAccepted(false);
    setSelectedTemplateId("ask-anything");
    setAiSentenceLength("2-3");
    setAiEnhancementType(
      getPromptTemplatesForLanguage(language).find((x) => x.id === "ask-anything")
        ?.enhancementType ?? "improve",
    );
    setPassword("");
    setShowPassword(false);
    setPasswordSource(null);
    setExpiryValue(NOTE_EXPIRY_DEFAULT_PRESET_ID);
  };

  // ── AI actions ────────────────────────────────────────────────────────────
  const selectTemplate = (template: PromptTemplate) => {
    if (template.id === "ask-anything" && selectedTemplateId === "ask-anything") {
      setSelectedTemplateId(null);
      setAiPrompt("");
      return;
    }
    setAiPrompt(
      template.userTemplate + formatSentenceLengthUserSuffix(aiSentenceLength, language),
    );
    setAiEnhancementType(template.enhancementType);
    setSelectedTemplateId(template.id);
  };

  const handleSentenceLengthChange = useCallback(
    (id: AiSentenceLengthId) => {
      setAiSentenceLength(id);
      if (selectedTemplateId === null) return;
      setAiPrompt((p) => applySentenceLengthToUserPrompt(p, id, language));
    },
    [selectedTemplateId, language],
  );

  const handleUseFallbackTemplate = useCallback((text: string) => {
    setNoteContentFromAiOutput(text);
    setTransformHistory([]);
    setShowPrompt(false);
    setAiDraftAccepted(true);
  }, [setNoteContentFromAiOutput]);

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
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
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
      toast({ title: "Error", description: "Failed to improve content. Please try again.", variant: "destructive" });
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
      toast({ title: "Error", description: "Failed to summarize content. Please try again.", variant: "destructive" });
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
      toast({ title: "Error", description: "Failed to simplify content. Please try again.", variant: "destructive" });
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
      toast({ title: "Error", description: "Failed to regenerate content. Please try again.", variant: "destructive" });
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
                  isGeneratingContent ? localAiDialogPrimaryLine(aiProgress) : null
                }
                isAiModelLoading={isAiModelLoading}
                aiModelProgress={aiModelProgress}
                transformHistory={transformHistory}
                onGenerate={(override) => void handleAiGenerate(override)}
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
                onUseFallbackTemplate={handleUseFallbackTemplate}
              />
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
                required
              />
              <div className="mt-2 hidden md:flex flex-nowrap items-center gap-x-3 text-[11px] text-gray-500 dark:text-gray-400">
                {privacyBannerItems}
              </div>
            </div>
          ) : null}

          <div className="mt-[-0.5rem]" />

          {(!isAiMode || aiDraftAccepted) && (
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
            />
          )}

          {/* Show create/settings when not in AI mode, or after the AI draft is accepted. */}
          {!isAiMode || (noteContent && isAiMode && !showPrompt && aiDraftAccepted) ? (
            <div className="space-y-3 mt-1">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
                <button
                  type="button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex w-full min-w-0 items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/80 sm:w-auto sm:min-w-[180px]"
                >
                  {showAdvancedOptions ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1.5 text-primary" />
                      <span>{t.hideOptions}</span>
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-1.5 text-primary" />
                      <span>{t.customize}</span>
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

      <Dialog open={isGeneratingContent}>
        <DialogContent
          className="[&>button]:hidden sm:max-w-md border-primary/15"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              {getLocalAiGenerationGlyph(localAiDialogPrimaryLine(aiProgress)) === "brain" ? (
                <ThinkingBrainIcon sizeClassName="h-14 w-14" />
              ) : (
                <WritingPencilIcon sizeClassName="h-14 w-14" />
              )}
            </div>
            <DialogTitle className="text-center text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
              {localAiDialogPrimaryLine(aiProgress)}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2 text-center">
                {aiProgress?.detail ? (
                  <p className="text-sm font-medium leading-snug text-foreground/90">{aiProgress.detail}</p>
                ) : null}
                <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        Math.min(100, Math.max(0, aiProgress?.progress ?? 0)),
                      )}%`,
                    }}
                  />
                </div>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground/85">
                  Private AI runs entirely in your browser. Longer tasks and slower devices can take
                  noticeably more time than cloud APIs — that&apos;s normal for local generation.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={cellularPreloadConfirmOpen}
        onOpenChange={setCellularPreloadConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download the on-device AI now?</AlertDialogTitle>
            <AlertDialogDescription>
              This connection looks like cellular or a slower network (for example 3G). The private
              AI model is a large download and can use a noticeable amount of mobile data. You can
              download it now, or cancel and use Wi‑Fi first. If you skip, the model will still
              download when you run your first generation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCellularPreloadConfirmOpen(false);
                void startFreeModelDownload();
              }}
            >
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTemplateOfferPrompt} onOpenChange={setShowTemplateOfferPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Local AI couldn&apos;t start</AlertDialogTitle>
            <AlertDialogDescription>
              We couldn&apos;t prepare on-device AI on this device right now. You can retry after
              clearing the partial download, or continue with built-in writing templates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                void retryFreeModelDownloadAfterReset();
              }}
            >
              Reset AI and try again
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowTemplateOfferPrompt(false);
                setIsAiMode(true);
                setShowPrompt(true);
                aiComposerAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Use templates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
