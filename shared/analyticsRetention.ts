/** Documented retention. Do not extend silently. */

/** Raw session-level event histories are not stored. */
export const ANALYTICS_RAW_EVENT_RETENTION_DAYS = 0;

/** Daily aggregates without session identifiers. */
export const ANALYTICS_AGGREGATE_RETENTION_DAYS = 730;

/** Cloudflare KV TTL for aggregate keys (~24 months). */
export const ANALYTICS_AGGREGATE_TTL_SECONDS = ANALYTICS_AGGREGATE_RETENTION_DAYS * 24 * 60 * 60;

export const ANALYTICS_MAX_BODY_BYTES = 4096;

/** Pause engaged-time accumulation after this idle period. */
export const ANALYTICS_IDLE_TIMEOUT_MS = 45_000;
