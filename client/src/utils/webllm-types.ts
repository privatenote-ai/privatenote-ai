/** Progress while fetching / loading a model (WebLLM init). */
export type ModelProgress =
  | {
      status: 'loading';
      /** 0–1 from WebLLM init callback */
      progress: number;
      file: string;
      loadedBytes: number;
      totalBytes: number;
    }
  | { status: 'ready' }
  | { status: 'error'; error: string };

export const DEFAULT_INFERENCE = {
  temperature: 0.6,
  max_new_tokens: 2048,
} as const;
