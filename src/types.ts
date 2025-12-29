import type { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  NOTES_KV: KVNamespace;
  OPENAI_API_KEY?: string;
}
