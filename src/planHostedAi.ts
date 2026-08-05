import type { Env } from "./types";
import { hostedAiMonthlyLimit, normalizeAccountType } from "@shared/planCatalog";

const HOSTED_AI_DRAFT = {
  KEY_PREFIX: "hosted_ai_month:",
} as const;

type HostedAiQuota = {
  count: number;
  monthKey: string;
};

export type HostedAiQuotaSnapshot = {
  used: number;
  limit: number;
  remaining: number;
  resetAt: number;
};

function currentMonthKey(now = new Date()): string {
  const d = now;
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthResetAt(monthKey: string): number {
  const [y, m] = monthKey.split("-").map(Number);
  const next = m === 12 ? { year: y + 1, month: 1 } : { year: y, month: m + 1 };
  return Math.floor(Date.UTC(next.year, next.month - 1, 1) / 1000);
}

export function hostedAiQuotaKey(identifier: string, accountType: string | null | undefined): string {
  const plan = normalizeAccountType(accountType);
  return `${HOSTED_AI_DRAFT.KEY_PREFIX}${plan}:${identifier}:${currentMonthKey()}`;
}

export async function readHostedAiQuotaSnapshot(
  env: Env,
  identifier: string,
  accountType: string | null | undefined,
): Promise<HostedAiQuotaSnapshot> {
  const kv = env.RATE_LIMIT_KV || env.ANALYTICS_KV || env.NOTES_KV;
  const monthKey = currentMonthKey();
  const limit = hostedAiMonthlyLimit(accountType);
  const resetAt = monthResetAt(monthKey);

  try {
    const stored = (await kv.get(hostedAiQuotaKey(identifier, accountType), {
      type: "json",
    })) as HostedAiQuota | null;
    const used =
      stored?.monthKey === monthKey
        ? Math.max(0, Math.min(limit, Number(stored.count) || 0))
        : 0;
    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      resetAt,
    };
  } catch (error) {
    console.error("[HOSTED_AI] Error reading quota snapshot:", error);
    return { used: 0, limit, remaining: limit, resetAt };
  }
}

export async function readHostedAiQuota(
  env: Env,
  identifier: string,
  accountType: string | null | undefined,
): Promise<{ allowed: boolean; remaining: number; resetAt: number; nextCount: number; limit: number }> {
  const snapshot = await readHostedAiQuotaSnapshot(env, identifier, accountType);
  return {
    allowed: snapshot.used < snapshot.limit,
    remaining: snapshot.remaining,
    resetAt: snapshot.resetAt,
    nextCount: snapshot.used + 1,
    limit: snapshot.limit,
  };
}

export async function commitHostedAiQuota(
  env: Env,
  identifier: string,
  accountType: string | null | undefined,
  count: number,
  resetAt: number,
): Promise<void> {
  const kv = env.RATE_LIMIT_KV || env.ANALYTICS_KV || env.NOTES_KV;
  const monthKey = currentMonthKey();
  const now = Math.floor(Date.now() / 1000);
  try {
    await kv.put(
      hostedAiQuotaKey(identifier, accountType),
      JSON.stringify({ count, monthKey }),
      { expirationTtl: Math.max(3600, resetAt - now + 86400) },
    );
  } catch (error) {
    console.error("[HOSTED_AI] Error committing quota:", error);
  }
}
