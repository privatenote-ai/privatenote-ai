/**
 * Session-scoped local LLM outcomes (tab lifetime). Downgrades effective device tier when a model fails
 * so we never retry larger workloads in the same session.
 */
import { setGemma22BoostEnabled, setGemma4BoostEnabled } from "./localLlmBoostPreference";

const STORAGE_KEY = "privatenote_llm_sess_v2";

interface SessionStateV2 {
  v: 2;
  /** Qwen 0.6 failed — disable local AI for this session. */
  qwen06Failed?: boolean;
  /** Gemma 2 2B (WebLLM) failed — only Qwen 0.6 is allowed afterward. */
  gemma22WebLlmFailed?: boolean;
  /** Gemma 4 (Transformers) boost failed — hide that boost only. */
  gemma4TransformersFailed?: boolean;
  loadAbortCount?: number;
}

function readState(): SessionStateV2 {
  if (typeof sessionStorage === "undefined") return { v: 2 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { v: 2 };
    const parsed = JSON.parse(raw) as SessionStateV2 & { v?: number };
    if (parsed?.v !== 2) return { v: 2 };
    return parsed;
  } catch {
    return { v: 2 };
  }
}

function writeState(partial: Partial<Omit<SessionStateV2, "v">>): void {
  const next: SessionStateV2 = { ...readState(), ...partial, v: 2 };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

const ID_QWEN_0_6 = "Qwen3-0.6B-q4f16_1-MLC";
const ID_GEMMA_22B = "gemma-2-2b-it-q4f16_1-MLC";

function isGemma22WebLlmId(modelId: string): boolean {
  return modelId === ID_GEMMA_22B || /gemma-2-2b.*-MLC/i.test(modelId);
}

function isGemma4TransformersId(modelId: string): boolean {
  return /gemma-4/i.test(modelId) && !/MLC$/i.test(modelId);
}

/**
 * Future telemetry: coarse device key + server allow/deny map. Not wired yet.
 */
export type DeviceOverride = {
  forceSafeChain?: boolean;
  neverLeadWithQwen06?: boolean;
  allowGemmaBoost?: boolean;
};

export function sessionQwen06Failed(): boolean {
  return readState().qwen06Failed === true;
}

export function sessionGemma22WebLlmFailed(): boolean {
  return readState().gemma22WebLlmFailed === true;
}

export function sessionGemma4BoostInvalidated(): boolean {
  return readState().gemma4TransformersFailed === true;
}

export function recordLocalLlmLoadAborted(): void {
  const n = (readState().loadAbortCount ?? 0) + 1;
  writeState({ loadAbortCount: n });
}

/** Model failed to compile / load (WebLLM CreateMLCEngine or Transformers init). */
export function recordLocalLlmInitFailure(modelId: string): void {
  if (modelId === ID_QWEN_0_6) {
    writeState({ qwen06Failed: true });
  } else if (isGemma22WebLlmId(modelId)) {
    writeState({ gemma22WebLlmFailed: true });
    setGemma22BoostEnabled(false);
  } else if (isGemma4TransformersId(modelId)) {
    writeState({ gemma4TransformersFailed: true });
    setGemma4BoostEnabled(false);
  }
}

/** GPU device lost or runtime failure after a model was running. */
export function recordLocalLlmGpuOrRuntimeFailure(modelId: string | null | undefined): void {
  if (!modelId) return;
  if (modelId === ID_QWEN_0_6) {
    writeState({ qwen06Failed: true });
  } else if (isGemma22WebLlmId(modelId)) {
    writeState({ gemma22WebLlmFailed: true });
    setGemma22BoostEnabled(false);
  } else if (isGemma4TransformersId(modelId)) {
    writeState({ gemma4TransformersFailed: true });
    setGemma4BoostEnabled(false);
  }
}
