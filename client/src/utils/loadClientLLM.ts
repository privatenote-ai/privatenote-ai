/** Lazy-load the heavy on-device LLM stack (WebLLM / Transformers) on demand. */
export type ClientLLMModule = typeof import("./clientLLM");

let cached: ClientLLMModule | null = null;
let loading: Promise<ClientLLMModule> | null = null;

export function loadClientLLM(): Promise<ClientLLMModule> {
  if (cached) return Promise.resolve(cached);
  if (!loading) {
    loading = import("./clientLLM").then((mod) => {
      cached = mod;
      return mod;
    });
  }
  return loading;
}
