import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";
import {
  commitHostedAiQuota,
  hostedAiQuotaKey,
  readHostedAiQuota,
  readHostedAiQuotaSnapshot,
} from "./planHostedAi";

function createEnv(entries: Map<string, string>): Env {
  const kv = {
    async get(key: string, options?: { type?: string }) {
      const value = entries.get(key) ?? null;
      return options?.type === "json" && value ? JSON.parse(value) : value;
    },
    async put(key: string, value: string) {
      entries.set(key, value);
    },
  } as unknown as KVNamespace;
  return {
    NOTES_KV: kv,
    ANALYTICS_KV: kv,
  } as Env;
}

describe("hosted AI monthly plan quotas", () => {
  it("enforces Free / Starter / Business monthly limits", async () => {
    const empty = createEnv(new Map());
    assert.equal((await readHostedAiQuotaSnapshot(empty, "u", "free")).limit, 3);
    assert.equal((await readHostedAiQuotaSnapshot(empty, "u", "personal_premium")).limit, 50);
    assert.equal((await readHostedAiQuotaSnapshot(empty, "u", "business_premium")).limit, 300);
  });

  it("reports the same monthly usage enforced by draft generation", async () => {
    const entries = new Map<string, string>();
    const env = createEnv(entries);
    const key = hostedAiQuotaKey("user-1", "personal_premium");
    const monthKey = key.split(":").at(-1);
    entries.set(key, JSON.stringify({ count: 37, monthKey }));

    const snapshot = await readHostedAiQuotaSnapshot(env, "user-1", "personal_premium");
    const enforcement = await readHostedAiQuota(env, "user-1", "personal_premium");

    assert.deepEqual(
      {
        used: snapshot.used,
        limit: snapshot.limit,
        remaining: snapshot.remaining,
      },
      { used: 37, limit: 50, remaining: 13 },
    );
    assert.equal(enforcement.remaining, snapshot.remaining);
    assert.equal(enforcement.nextCount, 38);
    assert.equal(enforcement.resetAt, snapshot.resetAt);
  });

  it("commits usage under a plan-scoped monthly key", async () => {
    const entries = new Map<string, string>();
    const env = createEnv(entries);
    const before = await readHostedAiQuota(env, "user-2", "free");
    assert.equal(before.allowed, true);
    assert.equal(before.limit, 3);

    await commitHostedAiQuota(env, "user-2", "free", before.nextCount, before.resetAt);
    const after = await readHostedAiQuotaSnapshot(env, "user-2", "free");
    assert.equal(after.used, 1);
    assert.equal(after.remaining, 2);
  });
});
