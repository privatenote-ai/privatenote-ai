import type { KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";
import { hasPremiumFeatures, normalizeAccountType } from "@shared/planCatalog";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import {
  formatNotificationNoteDisplayId,
  resolveSentNoteNotificationEvent,
  type SentNoteNotificationStatus,
} from "@shared/sentNoteNotification";

export type SentNoteStatus = "created" | "opened" | "expired" | "destroyed" | "revoked";

export type SentNoteRow = {
  id: string;
  user_id: string;
  note_id: string;
  status: SentNoteStatus;
  label: string | null;
  recipient_email_hint: string | null;
  notify_on_open: number;
  notify_on_destroyed: number;
  require_recipient_verification: number;
  proof_enabled: number;
  expires_at: string | null;
  created_at: string;
  opened_at: string | null;
  destroyed_at: string | null;
  revoked_at: string | null;
  opened_notified_at: string | null;
  destroyed_notified_at: string | null;
  open_country: string | null;
  open_device_class: string | null;
  open_browser: string | null;
  attachment_downloaded_at: string | null;
  attachment_downloaded_notified_at: string | null;
  notification_deleted_at: string | null;
};

export type CreateSentNoteInput = {
  userId: string;
  noteId: string;
  label?: string | null;
  recipientEmail?: string | null;
  recipientCode?: string | null;
  notifyOnOpen?: boolean;
  notifyOnDestroyed?: boolean;
  restrictRecipientEmail?: boolean;
  requireRecipientVerification?: boolean;
  proofEnabled?: boolean;
  expiresAt?: string | null;
};

type RecipientGatePayload = {
  codeHash?: string;
  salt?: string;
  emailMac?: string | null;
  emailHash?: string | null;
};

const RECIPIENT_GATE_PREFIX = "note_rcv_gate:";
const RECIPIENT_OK_PREFIX = "note_rcv_ok:";

function gateKey(noteId: string): string {
  return `${RECIPIENT_GATE_PREFIX}${noteId}`;
}

function okKey(noteId: string, token: string): string {
  return `${RECIPIENT_OK_PREFIX}${noteId}:${token}`;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function requireAuthSecretKey(env: Env): string {
  if (!env.AUTH_SECRET_KEY) {
    throw new Error("auth_secret_key_required");
  }
  return env.AUTH_SECRET_KEY;
}

function recipientEmailMacPayload(email: string): string {
  return `recipient-email:v1:${email}`;
}

async function recipientEmailMac(env: Env, email: string): Promise<string> {
  return `hmac-sha256:v1:${await hmacSha256Hex(
    requireAuthSecretKey(env),
    recipientEmailMacPayload(email),
  )}`;
}

function maskEmailHint(email: string | null): string | null {
  if (!email) return null;
  const at = email.indexOf("@");
  if (at <= 0 || at === email.length - 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const [domainName = "", ...domainRest] = domain.split(".");
  const tld = domainRest.length ? `.${domainRest[domainRest.length - 1]}` : "";
  const localHint =
    local.length <= 2
      ? `${local[0] ?? ""}*`
      : `${local.slice(0, 2)}***${local.slice(-1)}`;
  const domainHint =
    domainName.length <= 2
      ? `${domainName[0] ?? ""}*`
      : `${domainName[0]}***${domainName.slice(-1)}`;
  return `${localHint}@${domainHint}${tld}`;
}

function randomSixDigitCode(): string {
  const max = 0x1_0000_0000 - (0x1_0000_0000 % 1_000_000);
  let n = crypto.getRandomValues(new Uint32Array(1))[0]!;
  while (n >= max) {
    n = crypto.getRandomValues(new Uint32Array(1))[0]!;
  }
  return String(n % 1_000_000).padStart(6, "0");
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function kv(env: Env): KVNamespace {
  return env.RATE_LIMIT_KV || env.ANALYTICS_KV || env.NOTES_KV;
}

function parseUserAgent(ua: string | null): { deviceClass: string; browser: string } {
  const s = (ua || "").toLowerCase();
  let deviceClass = "desktop";
  if (/mobile|iphone|android/.test(s)) deviceClass = "mobile";
  else if (/ipad|tablet/.test(s)) deviceClass = "tablet";

  let browser = "unknown";
  if (s.includes("edg/")) browser = "edge";
  else if (s.includes("chrome/") && !s.includes("edg/")) browser = "chrome";
  else if (s.includes("firefox/")) browser = "firefox";
  else if (s.includes("safari/") && !s.includes("chrome/")) browser = "safari";

  return { deviceClass, browser };
}

export async function getUserAccountType(env: Env, userId: string): Promise<string> {
  if (!env.AUTH_DB) return "free";
  const row = await env.AUTH_DB.prepare(
    `SELECT account_type, plan FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(userId)
    .first<{ account_type?: string | null; plan?: string | null }>();
  return normalizeAccountType(row?.account_type ?? row?.plan);
}

export async function insertSentNote(env: Env, input: CreateSentNoteInput): Promise<{ id: string; verificationCode?: string }> {
  if (!env.AUTH_DB) throw new Error("AUTH_DB not configured");
  const sender = await env.AUTH_DB.prepare(
    `SELECT email, email_verified, email_notifications, account_type, plan
     FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(input.userId)
    .first<{
      email: string | null;
      email_verified: number | null;
      email_notifications: number | null;
      account_type: string | null;
      plan: string | null;
    }>();
  const accountType = normalizeAccountType(sender?.account_type ?? sender?.plan);
  if (!hasPremiumFeatures(accountType)) {
    throw new Error("premium_required");
  }
  if (!sender?.email || !isPlausibleEmailFormat(sender.email)) throw new Error("sender_email_required");
  if (sender.email_verified !== 1) throw new Error("sender_email_unverified");
  if (sender.email_notifications !== 1 && (input.notifyOnOpen || input.notifyOnDestroyed)) {
    throw new Error("email_notifications_disabled");
  }

  const id = crypto.randomUUID();
  const restrictRecipientEmail = input.restrictRecipientEmail === true;
  const requireRecipientVerification = input.requireRecipientVerification === true;
  const emailHint =
    input.recipientEmail && isPlausibleEmailFormat(input.recipientEmail)
      ? input.recipientEmail.trim().toLowerCase()
      : null;
  if (restrictRecipientEmail && !emailHint) {
    throw new Error("recipient_email_required");
  }

  const hasRecipientGate = restrictRecipientEmail || requireRecipientVerification;

  await env.AUTH_DB.prepare(
    `INSERT INTO sent_notes (
      id, user_id, note_id, status, label, recipient_email_hint,
      notify_on_open, notify_on_destroyed, require_recipient_verification, proof_enabled, expires_at
    ) VALUES (?, ?, ?, 'created', ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      input.userId,
      input.noteId,
      input.label?.trim().slice(0, 120) || null,
      maskEmailHint(emailHint),
      input.notifyOnOpen ? 1 : 0,
      input.notifyOnDestroyed ? 1 : 0,
      hasRecipientGate ? 1 : 0,
      input.proofEnabled !== false ? 1 : 0,
      input.expiresAt ?? null,
    )
    .run();

  let verificationCode: string | undefined;
  if (hasRecipientGate) {
    const gate: RecipientGatePayload = {};
    if (emailHint) {
      gate.emailMac = await recipientEmailMac(env, emailHint);
    }
    if (requireRecipientVerification) {
      verificationCode = input.recipientCode?.trim() || randomSixDigitCode();
      gate.salt = crypto.randomUUID();
      gate.codeHash = await sha256Hex(`${gate.salt}:${verificationCode}`);
    }
    const ttlSeconds = input.expiresAt
      ? Math.max(3600, Math.floor((Date.parse(input.expiresAt) - Date.now()) / 1000))
      : 7 * 24 * 3600;
    await kv(env).put(gateKey(input.noteId), JSON.stringify(gate), {
      expirationTtl: Math.min(ttlSeconds, 30 * 24 * 3600),
    });
  }

  return { id, verificationCode };
}

export async function listSentNotesForUser(env: Env, userId: string, limit = 50): Promise<SentNoteRow[]> {
  if (!env.AUTH_DB) return [];
  const res = await env.AUTH_DB.prepare(
    `SELECT * FROM sent_notes
      WHERE user_id = ?
        AND notification_deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ?`,
  )
    .bind(userId, limit)
    .all<SentNoteRow>();
  return res.results ?? [];
}

export type SentNoteNotificationItem = {
  id: string;
  noteId: string;
  recipientEmail: string | null;
  displayNoteId: string;
  status: SentNoteNotificationStatus;
  eventAt: string;
};

export function toSentNoteNotificationItem(row: SentNoteRow): SentNoteNotificationItem {
  const { status, eventAt } = resolveSentNoteNotificationEvent(row);
  return {
    id: row.id,
    noteId: row.note_id,
    recipientEmail: row.recipient_email_hint,
    displayNoteId: formatNotificationNoteDisplayId(row.note_id),
    status,
    eventAt,
  };
}

export async function listSentNoteNotificationsForUser(
  env: Env,
  userId: string,
  limit = 50,
): Promise<SentNoteNotificationItem[]> {
  const rows = await listSentNotesForUser(env, userId, limit);
  return rows.map(toSentNoteNotificationItem);
}

export async function deleteSentNoteNotification(
  env: Env,
  userId: string,
  notificationId: string,
): Promise<boolean> {
  if (!env.AUTH_DB) return false;
  const result = await env.AUTH_DB.prepare(
    `UPDATE sent_notes
       SET notification_deleted_at = COALESCE(notification_deleted_at, datetime('now'))
     WHERE id = ? AND user_id = ? AND notification_deleted_at IS NULL`,
  )
    .bind(notificationId, userId)
    .run();
  return ((result?.meta as { changes?: number } | undefined)?.changes ?? 0) > 0;
}

export async function clearSentNoteNotifications(env: Env, userId: string): Promise<number> {
  if (!env.AUTH_DB) return 0;
  const result = await env.AUTH_DB.prepare(
    `UPDATE sent_notes
       SET notification_deleted_at = COALESCE(notification_deleted_at, datetime('now'))
     WHERE user_id = ? AND notification_deleted_at IS NULL`,
  )
    .bind(userId)
    .run();
  return (result?.meta as { changes?: number } | undefined)?.changes ?? 0;
}

export async function recordSentNoteAttachmentDownloaded(
  env: Env,
  noteId: string,
  request?: Request,
  sendEmailFn?: (to: string, subject: string, text: string, html: string) => Promise<unknown>,
): Promise<void> {
  if (!env.AUTH_DB) return;
  const row = await getSentNoteByNoteId(env, noteId);
  if (!row || row.status === "revoked") return;

  const eventAt = row.attachment_downloaded_at ?? new Date().toISOString();
  const update = await env.AUTH_DB.prepare(
    `UPDATE sent_notes
     SET attachment_downloaded_at = COALESCE(attachment_downloaded_at, ?)
     WHERE note_id = ? AND status IN ('created', 'opened', 'destroyed', 'expired')`,
  )
    .bind(eventAt, noteId)
    .run();
  const rowsChanged = (update?.meta as { changes?: number } | undefined)?.changes ?? 0;
  if (rowsChanged < 1 || !sendEmailFn || row.attachment_downloaded_notified_at) return;

  const country = request?.headers.get("CF-IPCountry") || request?.headers.get("cf-ipcountry") || null;
  const { deviceClass, browser } = parseUserAgent(request?.headers.get("User-Agent") ?? null);
  await sendSentNoteLifecycleEmail(env, row, noteId, "attachment_downloaded", eventAt, {
    country,
    deviceClass,
    browser,
    sendEmailFn,
  });
}

export async function getSentNoteByNoteId(env: Env, noteId: string): Promise<SentNoteRow | null> {
  if (!env.AUTH_DB) return null;
  return env.AUTH_DB.prepare(`SELECT * FROM sent_notes WHERE note_id = ? LIMIT 1`)
    .bind(noteId)
    .first<SentNoteRow>();
}

export async function revokeSentNote(env: Env, userId: string, noteId: string): Promise<boolean> {
  if (!env.AUTH_DB) return false;
  const row = await getSentNoteByNoteId(env, noteId);
  if (!row || row.user_id !== userId || (row.status !== "created" && row.status !== "opened")) return false;
  await env.AUTH_DB.prepare(
    `UPDATE sent_notes
     SET status = 'revoked', revoked_at = COALESCE(revoked_at, datetime('now'))
     WHERE note_id = ? AND user_id = ? AND status IN ('created', 'opened')`,
  )
    .bind(noteId, userId)
    .run();
  await kv(env).delete(gateKey(noteId));
  return true;
}

export async function noteRequiresRecipientVerification(env: Env, noteId: string): Promise<boolean> {
  const gate = await kv(env).get(gateKey(noteId));
  return Boolean(gate);
}

export async function getRecipientGateStatus(
  env: Env,
  noteId: string,
): Promise<{ required: boolean; emailRequired: boolean; codeRequired: boolean }> {
  const stored = (await kv(env).get(gateKey(noteId), { type: "json" })) as RecipientGatePayload | null;
  if (!stored || (!stored.codeHash && !stored.emailMac && !stored.emailHash)) {
    return { required: false, emailRequired: false, codeRequired: false };
  }
  return {
    required: true,
    emailRequired: Boolean(stored.emailMac || stored.emailHash),
    codeRequired: Boolean(stored.codeHash),
  };
}

export async function isRecipientVerified(env: Env, noteId: string, request: Request): Promise<boolean> {
  const cookies = parseCookieHeader(request.headers.get("Cookie"));
  const raw = cookies.pn_rcv;
  if (!raw) return false;
  const [cookieNoteId, token] = raw.split(":");
  if (cookieNoteId !== noteId || !token) return false;
  const ok = await kv(env).get(okKey(noteId, token));
  return ok === "1";
}

function parseCookieHeader(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}

export async function verifyRecipientAccess(
  env: Env,
  noteId: string,
  body: { code?: string; email?: string },
): Promise<{ ok: true; setCookie: string } | { ok: false; error: string }> {
  const stored = (await kv(env).get(gateKey(noteId), { type: "json" })) as RecipientGatePayload | null;
  if (!stored || (!stored.codeHash && !stored.emailMac && !stored.emailHash)) return { ok: false, error: "no_gate" };

  if (stored.codeHash) {
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!code) return { ok: false, error: "code_required" };
    const codeHash = await sha256Hex(`${stored.salt}:${code}`);
    if (codeHash !== stored.codeHash) return { ok: false, error: "invalid_code" };
  }

  if (stored.emailMac || stored.emailHash) {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !isPlausibleEmailFormat(email)) return { ok: false, error: "email_required" };
    if (stored.emailMac) {
      const emailMac = await recipientEmailMac(env, email);
      if (emailMac !== stored.emailMac) return { ok: false, error: "invalid_email" };
    } else if (stored.emailHash) {
      const emailHash = await sha256Hex(email);
      if (emailHash !== stored.emailHash) return { ok: false, error: "invalid_email" };
    }
  }

  const token = crypto.randomUUID();
  await kv(env).put(okKey(noteId, token), "1", { expirationTtl: 3600 });
  return { ok: true, setCookie: `${noteId}:${token}` };
}

export function recipientVerifiedCookieHeader(noteId: string, tokenPair: string, request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `pn_rcv=${encodeURIComponent(tokenPair)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${secure}`;
}

export async function recordSentNoteOpened(
  env: Env,
  noteId: string,
  request: Request,
  sendEmailFn: (to: string, subject: string, text: string, html: string) => Promise<unknown>,
  destroyed = false,
): Promise<void> {
  const row = await getSentNoteByNoteId(env, noteId);
  if (!row || row.status === "revoked" || row.status === "destroyed" || row.status === "expired") return;

  const country = request.headers.get("CF-IPCountry") || request.headers.get("cf-ipcountry") || null;
  const ua = request.headers.get("User-Agent");
  const { deviceClass, browser } = parseUserAgent(ua);
  const eventAt = new Date().toISOString();
  const nextStatus: SentNoteStatus = destroyed ? "destroyed" : row.status === "created" ? "opened" : row.status;

  await env.AUTH_DB!.prepare(
    `UPDATE sent_notes
     SET status = ?,
       opened_at = COALESCE(opened_at, ?),
       destroyed_at = CASE WHEN ? = 1 THEN COALESCE(destroyed_at, ?) ELSE destroyed_at END,
       open_country = COALESCE(open_country, ?),
       open_device_class = COALESCE(open_device_class, ?),
       open_browser = COALESCE(open_browser, ?)
     WHERE note_id = ? AND status IN ('created', 'opened')`,
  )
    .bind(nextStatus, eventAt, destroyed ? 1 : 0, eventAt, country, deviceClass, browser, noteId)
    .run();

  if (destroyed && row.notify_on_open === 1 && row.notify_on_destroyed === 1 && !row.opened_notified_at && !row.destroyed_notified_at) {
    await sendSentNoteLifecycleEmail(env, row, noteId, "opened_destroyed", eventAt, {
      country,
      deviceClass,
      browser,
      sendEmailFn,
    });
    return;
  }

  if (row.notify_on_open === 1 && !row.opened_notified_at) {
    await sendSentNoteLifecycleEmail(env, row, noteId, "opened", eventAt, {
      country,
      deviceClass,
      browser,
      sendEmailFn,
    });
  }

  if (destroyed && row.notify_on_destroyed === 1 && !row.destroyed_notified_at) {
    await sendSentNoteLifecycleEmail(env, row, noteId, "destroyed", eventAt, {
      country,
      deviceClass,
      browser,
      sendEmailFn,
    });
  }
}

type SentNoteLifecycleEvent = "opened" | "destroyed" | "opened_destroyed" | "expired" | "attachment_downloaded";

async function sendSentNoteLifecycleEmail(
  env: Env,
  row: SentNoteRow,
  noteId: string,
  event: SentNoteLifecycleEvent,
  eventAt: string,
  context: {
    country?: string | null;
    deviceClass?: string;
    browser?: string;
    sendEmailFn: (to: string, subject: string, text: string, html: string) => Promise<unknown>;
  },
): Promise<void> {
  const senderRow = await env.AUTH_DB!.prepare(
    `SELECT email, email_verified, email_notifications, account_type, plan
     FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(row.user_id)
    .first<{
      email: string | null;
      email_verified: number | null;
      email_notifications: number | null;
      account_type: string | null;
      plan: string | null;
    }>();

  const notifyEmail = senderRow?.email;
  if (!notifyEmail || !isPlausibleEmailFormat(notifyEmail)) return;
  if (senderRow.email_verified !== 1 || senderRow.email_notifications !== 1) return;
  if (!hasPremiumFeatures(normalizeAccountType(senderRow.account_type ?? senderRow.plan))) return;

  const setClause =
    event === "opened"
      ? "opened_notified_at = ?"
      : event === "opened_destroyed"
        ? "opened_notified_at = ?, destroyed_notified_at = ?"
        : event === "attachment_downloaded"
          ? "attachment_downloaded_notified_at = ?"
        : "destroyed_notified_at = ?";
  const whereClause =
    event === "opened"
      ? "opened_notified_at IS NULL"
      : event === "opened_destroyed"
        ? "opened_notified_at IS NULL AND destroyed_notified_at IS NULL"
        : event === "attachment_downloaded"
          ? "attachment_downloaded_notified_at IS NULL"
        : "destroyed_notified_at IS NULL";
  const bindValues =
    event === "opened_destroyed" ? [eventAt, eventAt, noteId] : [eventAt, noteId];
  const claim = await env.AUTH_DB!.prepare(
    `UPDATE sent_notes SET ${setClause} WHERE note_id = ? AND ${whereClause}`,
  )
    .bind(...bindValues)
    .run();
  const rowsChanged = (claim?.meta as { changes?: number } | undefined)?.changes ?? 0;
  if (rowsChanged < 1) return;

  const label = row.label || `${noteId.slice(0, 8)}...`;
  const countryLine = context.country ? `Approximate country: ${context.country}` : "";
  const deviceLine =
    context.deviceClass || context.browser
      ? `Device: ${context.deviceClass ?? "unknown"}, browser: ${context.browser ?? "unknown"}`
      : "";
  const eventLabel =
    event === "opened_destroyed"
      ? "opened and destroyed"
      : event === "attachment_downloaded"
        ? "attachment downloaded"
      : event === "expired"
        ? "expired"
        : event;
  const subject =
    event === "attachment_downloaded"
      ? `PrivateNote: your file "${label}" was downloaded`
      : `PrivateNote: your note "${label}" was ${eventLabel}`;
  const explanatoryLine =
    event === "opened"
      ? "This is proof the link was accessed, not that the recipient read or understood the content."
      : event === "attachment_downloaded"
        ? "This confirms the encrypted attachment was requested for download. PrivateNote cannot see the decrypted file contents."
      : event === "expired"
        ? "This means the note can no longer be opened because its expiry time passed."
        : event === "opened_destroyed"
          ? "This means the link was accessed and the note can no longer be opened."
          : "This means the note can no longer be opened because its read limit was reached.";
  const textIntro =
    event === "attachment_downloaded"
      ? `Your encrypted file "${label}" was downloaded.`
      : `Your secure note "${label}" was ${eventLabel}.`;
  const text = [
    textIntro,
    `Time: ${eventAt}`,
    countryLine,
    deviceLine,
    "",
    explanatoryLine,
    "",
    "PrivateNote cannot see the decrypted message content.",
  ].filter(Boolean).join("\n");

  try {
    await context.sendEmailFn(notifyEmail, subject, text, `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`);
  } catch (error) {
    const resetClause =
      event === "opened"
        ? "opened_notified_at = NULL"
        : event === "opened_destroyed"
          ? "opened_notified_at = NULL, destroyed_notified_at = NULL"
          : event === "attachment_downloaded"
            ? "attachment_downloaded_notified_at = NULL"
          : "destroyed_notified_at = NULL";
    await env.AUTH_DB!.prepare(`UPDATE sent_notes SET ${resetClause} WHERE note_id = ?`)
      .bind(noteId)
      .run();
    throw error;
  }
}

export async function processExpiredSentNotes(
  env: Env,
  sendEmailFn: (to: string, subject: string, text: string, html: string) => Promise<unknown>,
  limit = 100,
): Promise<{ processed: number; notified: number; error?: string }> {
  if (!env.AUTH_DB) return { processed: 0, notified: 0 };
  try {
    const rows = await env.AUTH_DB.prepare(
      `SELECT * FROM sent_notes
       WHERE status IN ('created', 'opened')
         AND expires_at IS NOT NULL
         AND datetime(expires_at) <= datetime('now')
       ORDER BY expires_at ASC
       LIMIT ?`,
    ).bind(limit).all<SentNoteRow>();
    let processed = 0;
    let notified = 0;
    const expiredAt = new Date().toISOString();
    for (const row of rows.results ?? []) {
      const update = await env.AUTH_DB.prepare(
        `UPDATE sent_notes
         SET status = 'expired', destroyed_at = COALESCE(destroyed_at, ?)
         WHERE note_id = ? AND status IN ('created', 'opened')`,
      ).bind(expiredAt, row.note_id).run();
      if (((update?.meta as { changes?: number } | undefined)?.changes ?? 0) < 1) continue;
      processed += 1;
      if (row.notify_on_destroyed === 1 && !row.destroyed_notified_at) {
        await sendSentNoteLifecycleEmail(env, row, row.note_id, "expired", expiredAt, { sendEmailFn });
        notified += 1;
      }
    }
    return { processed, notified };
  } catch (error) {
    return { processed: 0, notified: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getUserNoteDefaults(env: Env, userId: string) {
  if (!env.AUTH_DB) return null;
  return env.AUTH_DB.prepare(`SELECT * FROM user_note_defaults WHERE user_id = ? LIMIT 1`)
    .bind(userId)
    .first<{
      user_id: string;
      expiry_seconds: number | null;
      max_reads: number | null;
      notify_on_open: number;
      require_recipient_verification: number;
    }>();
}

export async function upsertUserNoteDefaults(
  env: Env,
  userId: string,
  body: {
    expirySeconds?: number | null;
    maxReads?: number | null;
    notifyOnOpen?: boolean;
    requireRecipientVerification?: boolean;
  },
): Promise<void> {
  if (!env.AUTH_DB) throw new Error("AUTH_DB not configured");
  const accountType = await getUserAccountType(env, userId);
  if (!hasPremiumFeatures(accountType)) throw new Error("premium_required");

  await env.AUTH_DB.prepare(
    `INSERT INTO user_note_defaults (user_id, expiry_seconds, max_reads, notify_on_open, require_recipient_verification, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       expiry_seconds = excluded.expiry_seconds,
       max_reads = excluded.max_reads,
       notify_on_open = excluded.notify_on_open,
       require_recipient_verification = excluded.require_recipient_verification,
       updated_at = datetime('now')`,
  )
    .bind(
      userId,
      body.expirySeconds ?? null,
      body.maxReads ?? null,
      body.notifyOnOpen ? 1 : 0,
      body.requireRecipientVerification ? 1 : 0,
    )
    .run();
}
