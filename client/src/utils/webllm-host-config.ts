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
 * Extend when you add shards to R2.
 */
export const OUR_WEBLLM_MODEL_RECORDS: OurWebLLMModelRecord[] = [
  {
    model_id: 'SmolLM2-360M-Instruct-q4f32_1-MLC',
    wasm_file: 'SmolLM2-360M-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 700,
    low_resource_required: true,
  },
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
  {
    model_id: 'Qwen3-1.7B-q4f16_1-MLC',
    wasm_file: 'Qwen3-1.7B-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 2036.66,
    low_resource_required: true,
  },
  {
    model_id: 'Qwen3-4B-q4f16_1-MLC',
    wasm_file: 'Qwen3-4B-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 3431.59,
    low_resource_required: false,
  },
  {
    model_id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    wasm_file: 'Llama-3.2-1B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 2353.26,
    low_resource_required: true,
  },
  {
    model_id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    wasm_file: 'Llama-3.2-3B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 3507.34,
    low_resource_required: true,
  },
  {
    model_id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    wasm_file: 'Llama-3_1-8B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 5001.0,
    low_resource_required: false,
  },
  {
    model_id: 'mlc-ai/gemma-3-1b-it-q4f32_1-MLC',
    wasm_file: 'gemma-3-1b-it-q4f32_1-webgpu.wasm',
    vram_required_MB: 2200,
    low_resource_required: true,
  },
];
