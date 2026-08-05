import type { D1Database } from "@cloudflare/workers-types";
import type { Env } from "./types";

export type BillingNotificationType =
  | "payment_failed"
  | "trial_ending"
  | "grace_ending"
  | "cancellation_confirmed";

type NotificationRow = {
  id: string;
  user_id: string;
  email: string | null;
  email_verified: number | null;
  subscription_status: string | null;
  notification_type: BillingNotificationType;
  effective_at: string | null;
  status: string;
  attempts: number;
};

export function buildBillingNotificationContent(
  type: BillingNotificationType,
  effectiveAt: string | null,
  accountUrl: string,
): { subject: string; text: string; html: string } {
  const date = effectiveAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })
        .format(new Date(effectiveAt))
    : null;
  const copy = {
    payment_failed: {
      subject: "Payment failed for your PrivateNote subscription",
      lead: "We could not process your latest subscription payment.",
      detail: date
        ? `Your paid-plan grace period is currently scheduled to end on ${date} UTC.`
        : "Paid access may be limited unless your billing details are updated.",
      action: "Update your payment method",
    },
    trial_ending: {
      subject: "Your PrivateNote trial is ending soon",
      lead: "Your paid-plan trial is nearing its end.",
      detail: date ? `Your trial is scheduled to end on ${date} UTC.` : "Review your subscription before the trial ends.",
      action: "Review your subscription",
    },
    grace_ending: {
      subject: "Your PrivateNote payment grace period is ending",
      lead: "Your payment grace period is almost over.",
      detail: date
        ? `Paid access is scheduled to end on ${date} UTC unless payment succeeds.`
        : "Paid access will end soon unless payment succeeds.",
      action: "Fix billing",
    },
    cancellation_confirmed: {
      subject: "Your PrivateNote subscription cancellation is confirmed",
      lead: "Your subscription cancellation has been recorded.",
      detail: date
        ? `Paid access remains available until ${date} UTC.`
        : "Paid access has ended. Existing notes keep the conditions under which they were created.",
      action: "View subscription",
    },
  }[type];
  const text = `${copy.lead}\n\n${copy.detail}\n\n${copy.action}: ${accountUrl}`;
  const html = `<p>${copy.lead}</p><p>${copy.detail}</p><p><a href="${accountUrl}">${copy.action}</a></p><p>PrivateNote</p>`;
  return { subject: copy.subject, text, html };
}

async function sendBillingEmail(
  env: Env,
  input: { to: string; subject: string; text: string; html: string },
  fetchImpl: typeof fetch,
): Promise<void> {
  if (env.AUTH_EMAIL_PROVIDER?.toLowerCase() !== "resend" || !env.RESEND_API_KEY || !env.AUTH_EMAIL_FROM) {
    throw new Error("Billing email provider is not configured");
  }
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.AUTH_EMAIL_FROM, ...input }),
  });
  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}

async function deliverNotification(
  env: Env,
  notificationKey: string,
  fetchImpl: typeof fetch,
): Promise<boolean> {
  if (!env.AUTH_DB) return false;
  const row = await env.AUTH_DB.prepare(
    `SELECT n.id, n.user_id, u.email, u.email_verified, u.subscription_status,
            n.notification_type,
            n.effective_at, n.status, n.attempts
     FROM billing_customer_notifications n
     JOIN users u ON u.id = n.user_id
     WHERE n.notification_key = ?
     LIMIT 1`,
  ).bind(notificationKey).first<NotificationRow>();
  if (!row || row.status === "sent" || row.status === "skipped" || row.attempts >= 5) return false;
  if (!row.email || row.email_verified !== 1) {
    await env.AUTH_DB.prepare(
      `UPDATE billing_customer_notifications
       SET status = 'skipped', last_error = 'verified_email_unavailable',
           last_attempt_at = datetime('now')
       WHERE id = ?`,
    ).bind(row.id).run();
    return false;
  }
  const currentSubscriptionStatus = row.subscription_status?.toLowerCase() ?? "";
  const stillApplicable =
    row.notification_type === "grace_ending"
      ? ["past_due", "unpaid"].includes(currentSubscriptionStatus)
      : row.notification_type === "trial_ending"
        ? currentSubscriptionStatus === "trialing"
        : true;
  if (!stillApplicable) {
    await env.AUTH_DB.prepare(
      `UPDATE billing_customer_notifications
       SET status = 'skipped', last_error = 'subscription_state_changed',
           last_attempt_at = datetime('now')
       WHERE id = ?`,
    ).bind(row.id).run();
    return false;
  }
  const claim = await env.AUTH_DB.prepare(
    `UPDATE billing_customer_notifications
     SET status = 'sending', attempts = attempts + 1, last_attempt_at = datetime('now')
     WHERE id = ? AND (
       status IN ('pending', 'failed')
       OR (status = 'sending' AND last_attempt_at < datetime('now', '-15 minutes'))
     )`,
  ).bind(row.id).run();
  if ((claim.meta?.changes ?? 0) < 1) return false;
  try {
    const origin = env.PUBLIC_WEB_APP_ORIGIN?.replace(/\/+$/, "") || "https://privatenote.ai";
    const content = buildBillingNotificationContent(
      row.notification_type,
      row.effective_at,
      `${origin}/account/subscription`,
    );
    await sendBillingEmail(env, { to: row.email, ...content }, fetchImpl);
    await env.AUTH_DB.prepare(
      `UPDATE billing_customer_notifications
       SET status = 'sent', sent_at = datetime('now'), last_error = NULL
       WHERE id = ?`,
    ).bind(row.id).run();
    return true;
  } catch (error) {
    await env.AUTH_DB.prepare(
      `UPDATE billing_customer_notifications
       SET status = 'failed', last_error = ?
       WHERE id = ?`,
    ).bind((error instanceof Error ? error.message : String(error)).slice(0, 500), row.id).run();
    return false;
  }
}

export async function queueBillingNotification(
  env: Env,
  input: {
    key: string;
    userId: string;
    subscriptionId: string | null;
    type: BillingNotificationType;
    effectiveAt: string | null;
  },
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(
    `INSERT OR IGNORE INTO billing_customer_notifications
       (id, notification_key, user_id, stripe_subscription_id, notification_type, effective_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(),
    input.key,
    input.userId,
    input.subscriptionId,
    input.type,
    input.effectiveAt,
  ).run();
  return deliverNotification(env, input.key, fetchImpl);
}

export async function processBillingCommunications(
  env: Env,
  options: { now?: Date; fetchImpl?: typeof fetch } = {},
): Promise<{ queued: number; sent: number; failed: number }> {
  if (!env.AUTH_DB) return { queued: 0, sent: 0, failed: 0 };
  const db: D1Database = env.AUTH_DB;
  const now = options.now ?? new Date();
  const nowIso = now.toISOString();
  const trialCutoff = new Date(now.getTime() + 3 * 86400_000).toISOString();
  const graceCutoff = new Date(now.getTime() + 86400_000).toISOString();
  let queued = 0;
  for (const definition of [
    {
      type: "trial_ending" as const,
      statuses: ["trialing"],
      column: "subscription_current_period_end",
      cutoff: trialCutoff,
    },
    {
      type: "grace_ending" as const,
      statuses: ["past_due", "unpaid"],
      column: "subscription_grace_period_end",
      cutoff: graceCutoff,
    },
  ]) {
    const statusPlaceholders = definition.statuses.map(() => "?").join(", ");
    const statusClause = `AND subscription_status IN (${statusPlaceholders})`;
    const bindings = [nowIso, definition.cutoff, ...definition.statuses];
    const rows = await db.prepare(
      `SELECT id, stripe_subscription_id, ${definition.column} AS effective_at
       FROM users
       WHERE ${definition.column} > ? AND ${definition.column} <= ?
         ${statusClause}
         AND stripe_subscription_id IS NOT NULL
       LIMIT 200`,
    ).bind(...bindings).all<{ id: string; stripe_subscription_id: string; effective_at: string }>();
    for (const row of rows.results ?? []) {
      await db.prepare(
        `INSERT OR IGNORE INTO billing_customer_notifications
           (id, notification_key, user_id, stripe_subscription_id, notification_type, effective_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(
        crypto.randomUUID(),
        `${definition.type}:${row.stripe_subscription_id}:${row.effective_at}`,
        row.id,
        row.stripe_subscription_id,
        definition.type,
        row.effective_at,
      ).run();
      queued += 1;
    }
  }
  const pending = await db.prepare(
    `SELECT notification_key
     FROM billing_customer_notifications
     WHERE (
       status IN ('pending', 'failed')
       OR (status = 'sending' AND last_attempt_at < datetime('now', '-15 minutes'))
     )
       AND attempts < 5
     ORDER BY created_at
     LIMIT 100`,
  ).all<{ notification_key: string }>();
  let sent = 0;
  for (const row of pending.results ?? []) {
    if (await deliverNotification(env, row.notification_key, options.fetchImpl ?? fetch)) sent += 1;
  }
  return { queued, sent, failed: Math.max(0, (pending.results?.length ?? 0) - sent) };
}
