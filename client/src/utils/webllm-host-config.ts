/**
 * Self-hosted WebLLM weights + WASM (optional).
 * When both VITE_WEBLLM_MODEL_BASE_URL and VITE_WEBLLM_WASM_BASE_URL are set,
 * only models listed in OUR_WEBLLM_MODEL_RECORDS are available.
 */
export interface OurWebLLMModelRecord {
  model_id: string;
  /** File name under WEBLLM_WASM_BASE_URL/{modelVersion}/ — same layout as binary-mlc-llm-libs */
  wasm_file: string;
  vram_required_MB?: number;
  low_resource_required?: boolean;
  required_features?: string[];
}

const rawModelBase = (import.meta.env.VITE_WEBLLM_MODEL_BASE_URL as string | undefined)?.trim() ?? '';
const rawWasmBase = (import.meta.env.VITE_WEBLLM_WASM_BASE_URL as string | undefined)?.trim() ?? '';

export const USE_CUSTOM_WEBLLM_HOST = Boolean(rawModelBase && rawWasmBase);

export const WEBLLM_MODEL_BASE_URL = rawModelBase;
export const WEBLLM_WASM_BASE_URL = rawWasmBase;

/**
 * Models you mirror on your CDN (weights at MODEL_BASE_URL/{model_id}/…, wasm at WASM_BASE_URL/v0_2_80/{wasm_file}).
 */
export const OUR_WEBLLM_MODEL_RECORDS: OurWebLLMModelRecord[] = [
  {
    model_id: 'Qwen3-0.6B-q4f16_1-MLC',
    wasm_file: 'Qwen3-0.6B-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 1403.34,
    low_resource_required: true,
  },
  {
    model_id: 'gemma-2-2b-it-q4f16_1-MLC',
    wasm_file: 'gemma-2-2b-it-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 1895.3,
    low_resource_required: false,
    required_features: ['shader-f16'],
  },
];
