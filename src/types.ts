import type { DurableObjectNamespace, KVNamespace, R2Bucket, D1Database } from "@cloudflare/workers-types";

export interface Env {
  NOTES_KV: KVNamespace;
  SECURE_NOTES: DurableObjectNamespace;
  OPENAI_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  // Rate limiting KV namespace (can use same as NOTES_KV or separate)
  RATE_LIMIT_KV?: KVNamespace;
  // Analytics KV namespace (can use same as NOTES_KV or separate)
  ANALYTICS_KV?: KVNamespace;
  // R2 bucket for WebLLM models
  WEBLLM_MODELS?: R2Bucket;
  // Auth scaffolding (optional until configured)
  AUTH_DB?: D1Database;
  AUTH_KV?: KVNamespace;
  AUTH_TOKENS?: DurableObjectNamespace;
  AUTH_EMAIL_FROM?: string;
  AUTH_EMAIL_PROVIDER?: string;
  RESEND_API_KEY?: string;
}
