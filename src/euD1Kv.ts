import type { D1Database, KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";

type KvGetOptions = "text" | "json" | "arrayBuffer" | "stream" | { type?: string };
type KvPutOptions = { expiration?: number; expirationTtl?: number };

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS operational_kv (
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (namespace, key)
)`;

let schemaReady = false;

function getRequestedType(options?: KvGetOptions): string {
  if (!options) return "text";
  if (typeof options === "string") return options;
  return options.type ?? "text";
}

function expirationFromOptions(options?: KvPutOptions): number | null {
  if (!options) return null;
  if (typeof options.expiration === "number") return Math.floor(options.expiration);
  if (typeof options.expirationTtl === "number") {
    return Math.floor(Date.now() / 1000) + Math.floor(options.expirationTtl);
  }
  return null;
}

export class EuD1KvNamespace {
  constructor(
    private readonly db: D1Database,
    private readonly namespace: string,
  ) {}

  private async ensureSchema(): Promise<void> {
    if (schemaReady) return;
    await this.db.prepare(TABLE_SQL).run();
    await this.db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_operational_kv_expires_at ON operational_kv(expires_at)",
    ).run();
    schemaReady = true;
  }

  async get(key: string, options?: KvGetOptions): Promise<any> {
    await this.ensureSchema();
    const now = Math.floor(Date.now() / 1000);
    const row = await this.db
      .prepare(
        `SELECT value, expires_at FROM operational_kv
         WHERE namespace = ? AND key = ?
         LIMIT 1`,
      )
      .bind(this.namespace, key)
      .first<{ value: string; expires_at: number | null }>();

    if (!row) return null;
    if (row.expires_at !== null && row.expires_at <= now) {
      await this.delete(key);
      return null;
    }

    const type = getRequestedType(options);
    if (type === "json") {
      try {
        return JSON.parse(row.value);
      } catch {
        return null;
      }
    }
    if (type === "arrayBuffer") {
      return new TextEncoder().encode(row.value).buffer;
    }
    if (type === "stream") {
      return new Response(row.value).body;
    }
    return row.value;
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: KvPutOptions): Promise<void> {
    await this.ensureSchema();
    let stored: string;
    if (typeof value === "string") {
      stored = value;
    } else if (value instanceof ReadableStream) {
      stored = await new Response(value).text();
    } else if (value instanceof ArrayBuffer) {
      stored = new TextDecoder().decode(value);
    } else {
      stored = new TextDecoder().decode(value.buffer);
    }

    await this.db
      .prepare(
        `INSERT INTO operational_kv (namespace, key, value, expires_at, updated_at)
         VALUES (?, ?, ?, ?, datetime('now'))
         ON CONFLICT(namespace, key) DO UPDATE SET
           value = excluded.value,
           expires_at = excluded.expires_at,
           updated_at = datetime('now')`,
      )
      .bind(this.namespace, key, stored, expirationFromOptions(options))
      .run();
  }

  async delete(key: string): Promise<void> {
    await this.ensureSchema();
    await this.db
      .prepare("DELETE FROM operational_kv WHERE namespace = ? AND key = ?")
      .bind(this.namespace, key)
      .run();
  }

  async list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: Array<{ name: string; expiration?: number; metadata?: unknown }>;
    list_complete: boolean;
    cursor?: string;
  }> {
    await this.ensureSchema();
    const prefix = options?.prefix ?? "";
    const limit = Math.min(Math.max(options?.limit ?? 1000, 1), 1000);
    const offset = Number(options?.cursor ?? "0") || 0;
    const now = Math.floor(Date.now() / 1000);
    const rows = await this.db
      .prepare(
        `SELECT key, expires_at FROM operational_kv
         WHERE namespace = ?
           AND key LIKE ?
           AND (expires_at IS NULL OR expires_at > ?)
         ORDER BY key
         LIMIT ? OFFSET ?`,
      )
      .bind(this.namespace, `${prefix}%`, now, limit + 1, offset)
      .all<{ key: string; expires_at: number | null }>();

    const allRows = rows.results ?? [];
    const visibleRows = allRows.slice(0, limit);
    const hasMore = allRows.length > limit;
    return {
      keys: visibleRows.map((row) => ({
        name: row.key,
        ...(row.expires_at ? { expiration: row.expires_at } : {}),
      })),
      list_complete: !hasMore,
      ...(hasMore ? { cursor: String(offset + limit) } : {}),
    };
  }
}

export function withEuStoredDataEnv(env: Env): Env {
  if (!env.AUTH_DB) return env;
  // Local wrangler dev: use Miniflare KV bindings (see wrangler.local.toml LOCAL_DEV).
  if (env.LOCAL_DEV === "1" || env.LOCAL_DEV === "true") {
    return env;
  }
  const notesKv = new EuD1KvNamespace(env.AUTH_DB, "NOTES_KV") as unknown as KVNamespace;
  const analyticsKv = new EuD1KvNamespace(env.AUTH_DB, "ANALYTICS_KV") as unknown as KVNamespace;
  const authKv = new EuD1KvNamespace(env.AUTH_DB, "AUTH_KV") as unknown as KVNamespace;
  const rateLimitKv = new EuD1KvNamespace(env.AUTH_DB, "RATE_LIMIT_KV") as unknown as KVNamespace;

  return {
    ...env,
    NOTES_KV: notesKv,
    ANALYTICS_KV: analyticsKv,
    AUTH_KV: authKv,
    RATE_LIMIT_KV: rateLimitKv,
  };
}
