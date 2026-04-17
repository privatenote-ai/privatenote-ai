/**
 * WebLLM (MLC AI) backend for cross-browser LLM inference (Chrome, Edge, Safari).
 * Uses WebGPU when available; models are sharded and cached in IndexedDB.
 * Set VITE_WEBLLM_MODEL_BASE_URL and VITE_WEBLLM_WASM_BASE_URL to serve models from your own CDN.
 */
import {
  CreateMLCEngine,
  modelVersion,
  prebuiltAppConfig,
  deleteModelAllInfoInCache,
  hasModelInCache,
  type AppConfig,
  type ModelRecord,
  type InitProgressReport,
  type MLCEngineInterface,
} from '@mlc-ai/web-llm';
import type { ModelProgress } from './webllm-types';
import { DEFAULT_INFERENCE } from './webllm-types';
import {
  USE_CUSTOM_WEBLLM_HOST,
  WEBLLM_MODEL_BASE_URL,
  WEBLLM_WASM_BASE_URL,
  OUR_WEBLLM_MODEL_RECORDS,
} from './webllm-host-config';
import {
  createRedactedThinkingStreamFilter,
  extractUserFacingAnswer,
} from '@shared/parseThinkingOutput';
import { userFacingLocalAiLoadProgress } from './localAiUxText';
import { isWebLlmGpuOrDisposeFailure } from './webLlmGpuErrors';

type ProgressCallback = (p: ModelProgress) => void;

let engine: MLCEngineInterface | null = null;
let loadedModelId: string | null = null;
/** AppConfig passed to the last successful `CreateMLCEngine` (custom host or iOS-tweaked prebuilt). */
let lastResolvedAppConfig: AppConfig | undefined;

export function isLoadedWebLLM(): boolean {
  return engine !== null && loadedModelId !== null;
}

export function getLoadedModelIdWebLLM(): string | null {
  return loadedModelId;
}

export function getWebLLMLEngine(): MLCEngineInterface | null {
  return engine;
}

function mapProgressReport(report: InitProgressReport, modelId: string): ModelProgress {
  return {
    status: 'loading',
    progress: report.progress,
    file: userFacingLocalAiLoadProgress(report.text, report.progress, modelId),
    loadedBytes: 0,
    totalBytes: 0,
  };
}

/** Same heuristic as `isIOSWebKit` in transformers-mobile-engine (avoid importing that module here). */
function isIosWebKitForWebLlm(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** Tighter context on iPhone WebGPU reduces KV / buffer pressure (device lost mid-decode). */
function contextWindowForModelRecord(modelId: string): number {
  if (!isIosWebKitForWebLlm()) return 4096;
  if (/SmolLM2-(360M|135M)/i.test(modelId)) return 2048;
  if (/SmolLM2-1\.7B/i.test(modelId)) return 3072;
  if (/Qwen3-0\.6B|gemma-3-1b/i.test(modelId)) return 3072;
  return 4096;
}

function buildCustomModelList(): ModelRecord[] {
  return OUR_WEBLLM_MODEL_RECORDS.map((r) => ({
    model: `${WEBLLM_MODEL_BASE_URL.replace(/\/$/, '')}/${r.model_id}`,
    model_id: r.model_id,
    model_lib: `${WEBLLM_WASM_BASE_URL.replace(/\/$/, '')}/${modelVersion}/${r.wasm_file}`,
    overrides: { context_window_size: contextWindowForModelRecord(r.model_id) },
    vram_required_MB: r.vram_required_MB,
    low_resource_required: r.low_resource_required,
    ...(r.required_features && { required_features: r.required_features }),
  }));
}

/** Prebuilt catalog: narrow context for the one model we load on iOS (full list kept for MLC lookup). */
function buildIosPrebuiltAppConfig(modelId: string): AppConfig | undefined {
  if (!isIosWebKitForWebLlm()) return undefined;
  const list = prebuiltAppConfig?.model_list;
  if (!Array.isArray(list) || list.length === 0) return undefined;
  const ctxTarget = contextWindowForModelRecord(modelId);
  return {
    model_list: list.map((entry) => {
      const rec = entry as ModelRecord;
      if (rec.model_id !== modelId) return rec;
      const prev = rec.overrides?.context_window_size;
      const nextCtx = Math.min(ctxTarget, prev ?? 8192);
      return {
        ...rec,
        overrides: { ...rec.overrides, context_window_size: nextCtx },
      };
    }),
  };
}

export async function loadModelWebLLM(modelId: string, onProgress: ProgressCallback): Promise<void> {
  if (engine && loadedModelId === modelId) {
    console.log('[PrivateNote] loadModelWebLLM: already loaded', modelId);
    onProgress({ status: 'ready' });
    return;
  }

  engine = null;
  loadedModelId = null;
  lastResolvedAppConfig = undefined;

  console.log(
    '[PrivateNote] loadModelWebLLM: loading',
    modelId,
    USE_CUSTOM_WEBLLM_HOST ? '(custom host)' : ''
  );
  onProgress({
    status: 'loading',
    progress: 0,
    file: userFacingLocalAiLoadProgress(undefined, 0, modelId),
    loadedBytes: 0,
    totalBytes: 0,
  });

  const engineConfig: { initProgressCallback: (r: InitProgressReport) => void; appConfig?: AppConfig } = {
    initProgressCallback: (report: InitProgressReport) => {
      onProgress(mapProgressReport(report, modelId));
    },
  };

  if (USE_CUSTOM_WEBLLM_HOST) {
    lastResolvedAppConfig = { model_list: buildCustomModelList() };
    engineConfig.appConfig = lastResolvedAppConfig;
  } else {
    const iosCfg = buildIosPrebuiltAppConfig(modelId);
    if (iosCfg) {
      lastResolvedAppConfig = iosCfg;
      engineConfig.appConfig = iosCfg;
    }
  }

  try {
    engine = await CreateMLCEngine(modelId, engineConfig);
    loadedModelId = modelId;
    console.log('[PrivateNote] loadModelWebLLM: done', modelId);
    onProgress({ status: 'ready' });
  } catch (e) {
    console.error('[PrivateNote] loadModelWebLLM: error', e);
    engine = null;
    loadedModelId = null;
    lastResolvedAppConfig = undefined;
    const msg = e instanceof Error ? e.message : String(e);
    onProgress({ status: 'error', error: msg });
    throw e;
  }
}

/** Chat message shape (role + content) for the WebLLM chat API. */
export interface WebLLMChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Extract display text from WebLLM delta/message content (string or array of parts). */
function extractContentText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        part && typeof part === 'object' && 'text' in part ? String((part as { text: string }).text) : ''
      )
      .join('');
  }
  return '';
}

export async function generateWebLLM(
  messages: WebLLMChatMessage[],
  onToken?: (text: string) => void,
  abortSignal?: AbortSignal
): Promise<string> {
  if (!engine || !loadedModelId) {
    console.error('[PrivateNote] generateWebLLM: engine not loaded');
    throw new Error('WebLLM model not loaded');
  }

  let msgs = [...messages];
  while (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
    msgs = msgs.slice(0, -1);
  }
  if (msgs.length === 0) return '';

  const { temperature, max_new_tokens } = DEFAULT_INFERENCE;
  let maxTokens = Math.min(max_new_tokens, 2048);
  if (isIosWebKitForWebLlm() && loadedModelId && /SmolLM2-(360M|135M)/i.test(loadedModelId)) {
    maxTokens = Math.min(maxTokens, 512);
  } else if (isIosWebKitForWebLlm()) {
    maxTokens = Math.min(maxTokens, 768);
  }
  const opts = {
    messages: msgs,
    temperature: temperature ?? 0.6,
    max_tokens: maxTokens,
  };

  if (onToken) {
    try {
      const chunks = await engine.chat.completions.create({
        ...opts,
        stream: true,
        ...(isIosWebKitForWebLlm() ? {} : { stream_options: { include_usage: true } }),
      });

      const [pushAnswer, flushAnswer] = createRedactedThinkingStreamFilter((s) => onToken(s));
      let full = '';
      for await (const chunk of chunks) {
        if (abortSignal?.aborted) break;
        const delta = chunk.choices?.[0]?.delta?.content;
        const text = extractContentText(delta);
        if (text) {
          full += text;
          pushAnswer(text);
        }
      }
      flushAnswer();
      if (full) return extractUserFacingAnswer(full);
    } catch (e) {
      if (isWebLlmGpuOrDisposeFailure(e)) {
        unloadModelWebLLM();
        throw e instanceof Error ? e : new Error(String(e));
      }
      console.warn('[PrivateNote] generateWebLLM: streaming failed, falling back to non-streaming', e);
    }
    const reply = await engine.chat.completions.create(opts);
    const content = reply.choices?.[0]?.message?.content;
    const text = extractContentText(content);
    const answer = extractUserFacingAnswer(text);
    if (answer && onToken) onToken(answer);
    return answer;
  }

  const reply = await engine.chat.completions.create(opts);
  const content = reply.choices?.[0]?.message?.content;
  return extractUserFacingAnswer(extractContentText(content));
}

export function unloadModelWebLLM(): void {
  engine = null;
  loadedModelId = null;
  lastResolvedAppConfig = undefined;
}

/** Same appConfig used when loading (for cache lookup). */
export function getWebLLMAppConfig(): AppConfig | undefined {
  if (USE_CUSTOM_WEBLLM_HOST) return { model_list: buildCustomModelList() };
  return lastResolvedAppConfig;
}

/** Delete the given WebLLM model from IndexedDB cache. Use same appConfig as load so the correct record is removed. */
export async function deleteWebLLMModelFromCache(modelId: string): Promise<void> {
  await deleteModelAllInfoInCache(modelId, getWebLLMAppConfig());
}

/** Check if the WebLLM model is already in IndexedDB cache. */
export async function isModelInCacheWebLLM(modelId: string): Promise<boolean> {
  return hasModelInCache(modelId, getWebLLMAppConfig());
}
