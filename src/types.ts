import type { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  NOTES_KV: KVNamespace;
  OPENAI_API_KEY?: string;
  // Rate limiting KV namespace (can use same as NOTES_KV or separate)
  RATE_LIMIT_KV?: KVNamespace;
}
