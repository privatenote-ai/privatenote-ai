import type { KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";
import { normalizeAccountType, planFeaturesFor } from "@shared/planCatalog";
import { getAccountEntitlements } from "./accountEntitlements";
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
  alert_notify_account_email: number | null;
  alert_custom_email: string | null;
};

export type CreateSentNoteInput = {
  userId: string;
  noteId: string;
  label?: string | null;
  recipientEmail?: string | null;
  notifyOnOpen?: boolean;
  notifyOnDestroyed?: boolean;
  /** When open/destroy alerts are on, whether to email the sender account address (default true). */
  alertNotifyAccountEmail?: boolean;
  /** Optional extra inbox for open/destroy alerts (premium). */
  alertCustomEmail?: string | null;
  requireRecipientVerification?: boolean;
  proofEnabled?: boolean;
  expiresAt?: string | null;
};

type RecipientGatePayload = {
  /** Recipient address that receives the one-time code on reveal. */
  recipientEmail: string;
  codeHash?: string;
  salt?: string;
  codeSentAt?: number;
};

const RECIPIENT_GATE_PREFIX = "note_rcv_gate:";
const RECIPIENT_OK_PREFIX = "note_rcv_ok:";
const RECIPIENT_CODE_SEND_COOLDOWN_MS = 60_000;

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

function randomSixDigitCode(): string {
  const max = 0x1_0000_0000 - (0x1_0000_0000 % 1_000_000);
  let n = crypto.getRandomValues(new Uint32Array(1))[0]!;
  while (n >= max) {
    n = crypto.getRandomValues(new Uint32Array(1))[0]!;
  }
  return String(n % 1_000_000).padStart(6, "0");
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
  return (await getAccountEntitlements(env, userId)).accountType;
}

export async function insertSentNote(env: Env, input: CreateSentNoteInput): Promise<{ id: string }> {
  if (!env.AUTH_DB) throw new Error("AUTH_DB not configured");
  const sender = await env.AUTH_DB.prepare(
    `SELECT email, email_verified, email_notifications
     FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(input.userId)
    .first<{
      email: string | null;
      email_verified: number | null;
      email_notifications: number | null;
    }>();
  const entitlements = await getAccountEntitlements(env, input.userId);
  const capabilities = entitlements.capabilities;
  const requireRecipientVerification = input.requireRecipientVerification === true;
  const wantsOpenNotifications = input.notifyOnOpen === true || input.notifyOnDestroyed === true;
  const wantsRecipientGate = requireRecipientVerification;
  const proofEnabled =
    capabilities.proofOfAccess && input.proofEnabled !== false;
  const alertNotifyAccountEmail = input.alertNotifyAccountEmail !== false;
  const alertCustomEmail =
    input.alertCustomEmail && isPlausibleEmailFormat(input.alertCustomEmail)
      ? input.alertCustomEmail.trim().toLowerCase()
      : null;

  if (wantsRecipientGate && !capabilities.recipientVerification) {
    throw new Error("premium_required");
  }
  if (wantsOpenNotifications && !capabilities.openNotifications) {
    throw new Error("premium_required");
  }
  if (!sender?.email || !isPlausibleEmailFormat(sender.email)) throw new Error("sender_email_required");
  if (sender.email_verified !== 1) throw new Error("sender_email_unverified");
  if (wantsOpenNotifications) {
    if (!alertNotifyAccountEmail && !alertCustomEmail) {
      throw new Error("alert_destination_required");
    }
    if (alertNotifyAccountEmail && sender.email_notifications !== 1) {
      throw new Error("email_notifications_disabled");
    }
    if (alertCustomEmail && !capabilities.openNotifications) {
      throw new Error("premium_required");
    }
  }

  const id = crypto.randomUUID();
  const recipientEmail =
    input.recipientEmail && isPlausibleEmailFormat(input.recipientEmail)
      ? input.recipientEmail.trim().toLowerCase()
      : null;
  if (requireRecipientVerification && !recipientEmail) {
    throw new Error("recipient_email_required");
  }

  const hasRecipientGate = wantsRecipientGate;

  await env.AUTH_DB.prepare(
    `INSERT INTO sent_notes (
      id, user_id, note_id, status, label, recipient_email_hint,
      notify_on_open, notify_on_destroyed, require_recipient_verification, proof_enabled, expires_at,
      alert_notify_account_email, alert_custom_email
    ) VALUES (?, ?, ?, 'created', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      input.userId,
      input.noteId,
      input.label?.trim().slice(0, 120) || null,
      maskEmailHint(recipientEmail),
      input.notifyOnOpen ? 1 : 0,
      input.notifyOnDestroyed ? 1 : 0,
      hasRecipientGate ? 1 : 0,
      proofEnabled ? 1 : 0,
      input.expiresAt ?? null,
      wantsOpenNotifications && alertNotifyAccountEmail ? 1 : 0,
      wantsOpenNotifications ? alertCustomEmail : null,
    )
    .run();

  if (hasRecipientGate && recipientEmail) {
    const gate: RecipientGatePayload = { recipientEmail };
    const ttlSeconds = input.expiresAt
      ? Math.max(3600, Math.floor((Date.parse(input.expiresAt) - Date.now()) / 1000))
      : 7 * 24 * 3600;
    await kv(env).put(gateKey(input.noteId), JSON.stringify(gate), {
      expirationTtl: Math.min(ttlSeconds, 30 * 24 * 3600),
    });
  }

  return { id };
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
  label: string | null;
  createdAt: string;
  openedAt: string | null;
  destroyedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
  proofEnabled: boolean;
  openCountry: string | null;
  openDeviceClass: string | null;
  openBrowser: string | null;
  attachmentDownloadedAt: string | null;
};

export function toSentNoteNotificationItem(row: SentNoteRow): SentNoteNotificationItem {
  const { status, eventAt } = resolveSentNoteNotificationEvent(row);
  const proofEnabled = row.proof_enabled === 1;
  return {
    id: row.id,
    noteId: row.note_id,
    recipientEmail: row.recipient_email_hint,
    displayNoteId: formatNotificationNoteDisplayId(row.note_id),
    status,
    eventAt,
    label: null,
    createdAt: row.created_at,
    openedAt: row.opened_at,
    destroyedAt: row.destroyed_at,
    revokedAt: row.revoked_at,
    expiresAt: row.expires_at,
    proofEnabled,
    openCountry: proofEnabled ? row.open_country : null,
    openDeviceClass: proofEnabled ? row.open_device_class : null,
    openBrowser: proofEnabled ? row.open_browser : null,
    attachmentDownloadedAt: row.attachment_downloaded_at,
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

export async function revokeSentNote(
  env: Env,
  userId: string,
  noteId: string,
): Promise<{ ok: true } | { ok: false; error: "not_found" | "already_opened" | "not_configured" }> {
  if (!env.AUTH_DB) return { ok: false, error: "not_configured" };
  const row = await getSentNoteByNoteId(env, noteId);
  if (!row || row.user_id !== userId) return { ok: false, error: "not_found" };
  if (row.status !== "created") return { ok: false, error: "already_opened" };
  await env.AUTH_DB.prepare(
    `UPDATE sent_notes SET status = 'revoked', revoked_at = datetime('now') WHERE note_id = ? AND user_id = ? AND status = 'created'`,
  )
    .bind(noteId, userId)
    .run();
  await kv(env).delete(gateKey(noteId));
  return { ok: true };
}

export async function noteRequiresRecipientVerification(env: Env, noteId: string): Promise<boolean> {
  const gate = await kv(env).get(gateKey(noteId));
  return Boolean(gate);
}

export async function getRecipientGateStatus(
  env: Env,
  noteId: string,
): Promise<{
  required: boolean;
  codeRequired: boolean;
  emailHint: string | null;
  codeSent: boolean;
}> {
  const stored = (await kv(env).get(gateKey(noteId), { type: "json" })) as RecipientGatePayload | null;
  if (!stored?.recipientEmail) {
    return { required: false, codeRequired: false, emailHint: null, codeSent: false };
  }
  return {
    required: true,
    codeRequired: true,
    emailHint: maskEmailHint(stored.recipientEmail),
    codeSent: Boolean(stored.codeHash),
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

export async function sendRecipientVerificationCode(
  env: Env,
  noteId: string,
  sendEmailFn: (to: string, subject: string, text: string, html: string) => Promise<unknown>,
): Promise<
  | { ok: true; emailHint: string | null }
  | { ok: false; error: string; retryAfterSeconds?: number }
> {
  const raw = await kv(env).get(gateKey(noteId));
  if (!raw) return { ok: false, error: "no_gate" };
  let stored: RecipientGatePayload;
  try {
    stored = JSON.parse(raw) as RecipientGatePayload;
  } catch {
    return { ok: false, error: "no_gate" };
  }
  if (!stored.recipientEmail || !isPlausibleEmailFormat(stored.recipientEmail)) {
    return { ok: false, error: "no_gate" };
  }

  const now = Date.now();
  if (
    typeof stored.codeSentAt === "number" &&
    now - stored.codeSentAt < RECIPIENT_CODE_SEND_COOLDOWN_MS
  ) {
    return {
      ok: false,
      error: "cooldown",
      retryAfterSeconds: Math.ceil(
        (RECIPIENT_CODE_SEND_COOLDOWN_MS - (now - stored.codeSentAt)) / 1000,
      ),
    };
  }

  const verificationCode = randomSixDigitCode();
  const salt = crypto.randomUUID();
  const nextGate: RecipientGatePayload = {
    recipientEmail: stored.recipientEmail,
    salt,
    codeHash: await sha256Hex(`${salt}:${verificationCode}`),
    codeSentAt: now,
  };

  // Preserve remaining TTL best-effort by rewriting with a fresh week if unknown.
  await kv(env).put(gateKey(noteId), JSON.stringify(nextGate), {
    expirationTtl: 7 * 24 * 3600,
  });

  const subject = "Your PrivateNote verification code";
  const text = [
    "Someone is trying to open a private note addressed to you.",
    "",
    `Your verification code is: ${verificationCode}`,
    "",
    "If you were not expecting this, you can ignore this email.",
    "The code expires when the note link expires.",
  ].join("\n");
  const html = `<p>Someone is trying to open a private note addressed to you.</p>
<p style="font-size:24px;letter-spacing:0.2em;font-family:monospace;font-weight:700">${escapeHtml(verificationCode)}</p>
<p>If you were not expecting this, you can ignore this email.</p>`;

  try {
    await sendEmailFn(stored.recipientEmail, subject, text, html);
  } catch (error) {
    console.warn("[RECIPIENT_CODE] Failed to email verification code:", error);
    return { ok: false, error: "send_failed" };
  }

  return { ok: true, emailHint: maskEmailHint(stored.recipientEmail) };
}

export async function verifyRecipientAccess(
  env: Env,
  noteId: string,
  body: { code?: string },
): Promise<{ ok: true; setCookie: string } | { ok: false; error: string }> {
  const stored = (await kv(env).get(gateKey(noteId), { type: "json" })) as RecipientGatePayload | null;
  if (!stored?.recipientEmail) return { ok: false, error: "no_gate" };
  if (!stored.codeHash || !stored.salt) return { ok: false, error: "code_not_sent" };

  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code) return { ok: false, error: "code_required" };
  const codeHash = await sha256Hex(`${stored.salt}:${code}`);
  if (codeHash !== stored.codeHash) return { ok: false, error: "invalid_code" };

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

  const proofEnabled = row.proof_enabled === 1;
  const country = proofEnabled
    ? request.headers.get("CF-IPCountry") || request.headers.get("cf-ipcountry") || null
    : null;
  const proofClient = proofEnabled
    ? parseUserAgent(request.headers.get("User-Agent"))
    : { deviceClass: null as string | null, browser: null as string | null };
  const { deviceClass, browser } = proofClient;
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
      deviceClass: deviceClass ?? undefined,
      browser: browser ?? undefined,
      sendEmailFn,
    });
    return;
  }

  if (row.notify_on_open === 1 && !row.opened_notified_at) {
    await sendSentNoteLifecycleEmail(env, row, noteId, "opened", eventAt, {
      country,
      deviceClass: deviceClass ?? undefined,
      browser: browser ?? undefined,
      sendEmailFn,
    });
  }

  if (destroyed && row.notify_on_destroyed === 1 && !row.destroyed_notified_at) {
    await sendSentNoteLifecycleEmail(env, row, noteId, "destroyed", eventAt, {
      country,
      deviceClass: deviceClass ?? undefined,
      browser: browser ?? undefined,
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
    `SELECT email, email_verified, email_notifications
     FROM users WHERE id = ? LIMIT 1`,
  )
    .bind(row.user_id)
    .first<{
      email: string | null;
      email_verified: number | null;
      email_notifications: number | null;
    }>();

  const recipients = new Set<string>();
  const notifyAccount = row.alert_notify_account_email !== 0;
  if (
    notifyAccount &&
    senderRow?.email &&
    isPlausibleEmailFormat(senderRow.email) &&
    senderRow.email_verified === 1 &&
    senderRow.email_notifications === 1
  ) {
    recipients.add(senderRow.email.trim().toLowerCase());
  }
  if (row.alert_custom_email && isPlausibleEmailFormat(row.alert_custom_email)) {
    recipients.add(row.alert_custom_email.trim().toLowerCase());
  }
  if (recipients.size === 0) return;

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
  const html = `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;

  try {
    for (const notifyEmail of recipients) {
      await context.sendEmailFn(notifyEmail, subject, text, html);
    }
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
      file_access_window_seconds: number | null;
      reader_language: string | null;
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
    fileAccessWindowSeconds?: number | null;
    readerLanguage?: string | null;
    notifyOnOpen?: boolean;
    requireRecipientVerification?: boolean;
  },
): Promise<void> {
  if (!env.AUTH_DB) throw new Error("AUTH_DB not configured");
  const accountType = await getUserAccountType(env, userId);
  if (!planFeaturesFor(accountType).savedDefaults) throw new Error("premium_required");

  await env.AUTH_DB.prepare(
    `INSERT INTO user_note_defaults (user_id, expiry_seconds, max_reads, file_access_window_seconds, reader_language, notify_on_open, require_recipient_verification, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       expiry_seconds = excluded.expiry_seconds,
       max_reads = excluded.max_reads,
       file_access_window_seconds = excluded.file_access_window_seconds,
       reader_language = excluded.reader_language,
       notify_on_open = excluded.notify_on_open,
       require_recipient_verification = excluded.require_recipient_verification,
       updated_at = datetime('now')`,
  )
    .bind(
      userId,
      body.expirySeconds ?? null,
      body.maxReads ?? null,
      body.fileAccessWindowSeconds ?? null,
      body.readerLanguage ?? null,
      body.notifyOnOpen ? 1 : 0,
      body.requireRecipientVerification ? 1 : 0,
    )
    .run();
}

export async function deleteUserNoteDefaults(env: Env, userId: string): Promise<boolean> {
  if (!env.AUTH_DB) throw new Error("AUTH_DB not configured");
  const result = await env.AUTH_DB.prepare(
    "DELETE FROM user_note_defaults WHERE user_id = ?",
  )
    .bind(userId)
    .run();
  return ((result.meta as { changes?: number } | undefined)?.changes ?? 0) > 0;
}
