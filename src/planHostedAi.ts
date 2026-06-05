import type { Env } from "./types";
import { hostedAiMonthlyLimit, normalizeAccountType } from "@shared/planCatalog";

const HOSTED_AI_DRAFT = {
  KEY_PREFIX: "hosted_ai_month:",
} as const;

type HostedAiQuota = {
  count: number;
  monthKey: string;
};

function currentMonthKey(): string {
  const d = new Date();
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

export async function readHostedAiQuota(
  env: Env,
  identifier: string,
  accountType: string | null | undefined,
): Promise<{ allowed: boolean; remaining: number; resetAt: number; nextCount: number; limit: number }> {
  const kv = env.RATE_LIMIT_KV || env.ANALYTICS_KV || env.NOTES_KV;
  const monthKey = currentMonthKey();
  const limit = hostedAiMonthlyLimit(accountType);
  const resetAt = monthResetAt(monthKey);

  try {
    const stored = (await kv.get(hostedAiQuotaKey(identifier, accountType), { type: "json" })) as HostedAiQuota | null;
    const count = stored?.monthKey === monthKey ? stored.count : 0;
    if (count >= limit) {
      return { allowed: false, remaining: 0, resetAt, nextCount: count, limit };
    }
    return {
      allowed: true,
      remaining: limit - count,
      resetAt,
      nextCount: count + 1,
      limit,
    };
  } catch (error) {
    console.error("[HOSTED_AI] Error reading quota:", error);
    return { allowed: true, remaining: limit, resetAt, nextCount: 1, limit };
  }
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
