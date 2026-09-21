import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearRecipientGate,
  clearSentNoteNotifications,
  deleteSentNoteNotification,
  getSentNoteNotificationsByNoteIds,
  listSentNoteNotificationsForUser,
  insertSentNote,
  noteRequiresRecipientVerification,
  recordSentNoteAttachmentDownloaded,
  recordSentNoteOpened,
  revokeSentNote,
  sendRecipientVerificationCode,
  toSentNoteNotificationItem,
  updateSentNoteLabel,
  updateSentNoteOrganization,
  verifyRecipientAccess,
  type SentNoteRow,
} from "./sentNotesService.ts";
import type { Env } from "./types.ts";

class FakePreparedStatement {
  public bindings: unknown[] = [];

  constructor(
    public readonly sql: string,
    private readonly db: FakeD1Database,
  ) {}

  bind(...values: unknown[]): this {
    this.bindings = values;
    return this;
  }

  async run(): Promise<{ meta: { changes: number } }> {
    this.db.runs.push({ sql: this.sql, bindings: this.bindings });
    return { meta: { changes: this.db.nextChanges } };
  }

  async all<T>(): Promise<{ results: T[] }> {
    this.db.alls.push({ sql: this.sql, bindings: this.bindings });
    return { results: this.db.rows as T[] };
  }

  async first<T>(): Promise<T | null> {
    this.db.firsts.push({ sql: this.sql, bindings: this.bindings });
    return (this.db.firstRows.shift() as T | undefined) ?? null;
  }
}

class FakeD1Database {
  public runs: Array<{ sql: string; bindings: unknown[] }> = [];
  public alls: Array<{ sql: string; bindings: unknown[] }> = [];
  public firsts: Array<{ sql: string; bindings: unknown[] }> = [];
  public rows: SentNoteRow[] = [];
  public firstRows: unknown[] = [];
  public nextChanges = 1;

  prepare(sql: string): FakePreparedStatement {
    return new FakePreparedStatement(sql, this);
  }
}

type StoredKvValue = { value: string; expirationTtl?: number };

class FakeKvNamespace {
  public store = new Map<string, StoredKvValue>();
  public deletes: string[] = [];

  async get(key: string, options?: { type?: "json" }): Promise<unknown> {
    const entry = this.store.get(key);
    if (!entry) return null;
    return options?.type === "json" ? JSON.parse(entry.value) : entry.value;
  }

  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    this.store.set(key, { value, expirationTtl: options?.expirationTtl });
  }

  async delete(key: string): Promise<void> {
    this.deletes.push(key);
    this.store.delete(key);
  }
}

function envWithDb(db: FakeD1Database, kv?: FakeKvNamespace): Env {
  return { AUTH_DB: db, RATE_LIMIT_KV: kv ?? new FakeKvNamespace() } as unknown as Env;
}

const GATE_NOTE_ID = "550e8400-e29b-41d4-a716-446655440000";
const GATE_KEY = `note_rcv_gate:${GATE_NOTE_ID}`;

function sentNote(overrides: Partial<SentNoteRow> = {}): SentNoteRow {
  return {
    id: "sent-note-1",
    user_id: "user-1",
    note_id: "550e8400-e29b-41d4-a716-446655440000",
    status: "created",
    label: null,
    recipient_email_hint: "al***e@e***e.com",
    notify_on_open: 1,
    notify_on_destroyed: 0,
    notify_on_attachment_download: 0,
    require_recipient_verification: 0,
    require_receipt_ack: 0,
    receipt_ack_token_hash: null,
    receipt_acknowledged_at: null,
    receipt_ack_notified_at: null,
    receipt_ack_statement: null,
    receipt_ack_statement_id: null,
    activity_folder: null,
    activity_tags: null,
    unopened_reminder_at: null,
    unopened_reminded_at: null,
    proof_enabled: 1,
    expires_at: null,
    created_at: "2026-06-14T09:00:00.000Z",
    opened_at: null,
    destroyed_at: null,
    revoked_at: null,
    opened_notified_at: null,
    destroyed_notified_at: null,
    open_country: null,
    open_device_class: null,
    open_browser: null,
    attachment_downloaded_at: null,
    attachment_downloaded_notified_at: null,
    notification_deleted_at: null,
    alert_notify_account_email: 1,
    alert_custom_email: null,
    open_count: 0,
    max_reads: null,
    ...overrides,
  };
}

/**
 * `.first()` is a queue: insertSentNote reads the sender row, then
 * getAccountEntitlements reads the plan row.
 */
function gateDb(options: {
  emailVerified: number;
  accountType: string;
}): FakeD1Database {
  const db = new FakeD1Database();
  db.firstRows = [
    {
      email: "sender@example.com",
      email_verified: options.emailVerified,
      email_notifications: 1,
    },
    {
      account_type: options.accountType,
      plan: options.accountType,
      subscription_status: options.accountType === "free" ? null : "active",
      subscription_current_period_end:
        options.accountType === "free" ? null : "2099-01-01T00:00:00.000Z",
      subscription_grace_period_end: null,
      manual_entitlement_expires_at: null,
      manual_entitlement_account_type: null,
    },
  ];
  return db;
}

function insertGatedNote(db: FakeD1Database, kvNamespace: FakeKvNamespace) {
  return insertSentNote(envWithDb(db, kvNamespace), {
    userId: "user-1",
    noteId: GATE_NOTE_ID,
    recipientEmail: "recipient@example.com",
    requireRecipientVerification: true,
  });
}

/**
 * Recipient verification is access control, and the note is already stored by
 * the time this runs. If it were to return quietly without writing the gate,
 * the caller would hand back a link that opens for anyone — so refusing loudly
 * is the contract the note-create route relies on to discard the note.
 */
describe("recipient verification gate creation", () => {
  it("refuses to skip the gate when the sender's email is unverified", async () => {
    const db = gateDb({ emailVerified: 0, accountType: "business_premium" });
    const kvNamespace = new FakeKvNamespace();

    await assert.rejects(insertGatedNote(db, kvNamespace), /sender_email_unverified/);
    assert.equal(kvNamespace.store.has(GATE_KEY), false);
    assert.equal(db.runs.length, 0);
  });

  it("refuses to skip the gate when the plan does not include it", async () => {
    const db = gateDb({ emailVerified: 1, accountType: "free" });
    const kvNamespace = new FakeKvNamespace();

    await assert.rejects(insertGatedNote(db, kvNamespace), /premium_required/);
    assert.equal(kvNamespace.store.has(GATE_KEY), false);
    assert.equal(db.runs.length, 0);
  });

  it("refuses to skip the gate when no recipient address was given", async () => {
    const db = gateDb({ emailVerified: 1, accountType: "business_premium" });
    const kvNamespace = new FakeKvNamespace();

    await assert.rejects(
      insertSentNote(envWithDb(db, kvNamespace), {
        userId: "user-1",
        noteId: GATE_NOTE_ID,
        requireRecipientVerification: true,
      }),
      /recipient_email_required/,
    );
    assert.equal(kvNamespace.store.has(GATE_KEY), false);
    assert.equal(db.runs.length, 0);
  });

  it("writes the gate alongside the row when it returns successfully", async () => {
    const db = gateDb({ emailVerified: 1, accountType: "business_premium" });
    const kvNamespace = new FakeKvNamespace();

    await insertGatedNote(db, kvNamespace);

    assert.equal(kvNamespace.store.has(GATE_KEY), true);
    const gate = JSON.parse(kvNamespace.store.get(GATE_KEY)?.value ?? "{}");
    assert.equal(gate.recipientEmail, "recipient@example.com");
    assert.equal(db.runs.length, 1);
    assert.match(db.runs[0]?.sql ?? "", /INSERT INTO sent_notes/);
    assert.match(db.runs[0]?.sql ?? "", /open_count, max_reads/);
  });
});

describe("sent note notification service", () => {
  it("lists only non-hidden notification rows", async () => {
    const db = new FakeD1Database();
    db.rows = [
      sentNote({
        status: "opened",
        opened_at: "2026-06-14T10:00:00.000Z",
      }),
    ];

    const notifications = await listSentNoteNotificationsForUser(envWithDb(db), "user-1", 25);

    assert.equal(notifications.length, 1);
    assert.equal(notifications[0]?.status, "viewed");
    assert.match(db.alls[0]?.sql ?? "", /notification_deleted_at IS NULL/);
    assert.deepEqual(db.alls[0]?.bindings, ["user-1", 25]);
  });

  it("maps delivery items by note id for activity expand", async () => {
    const db = new FakeD1Database();
    const noteId = "550e8400-e29b-41d4-a716-446655440000";
    db.rows = [sentNote({ note_id: noteId, status: "opened", opened_at: "2026-06-14T10:00:00.000Z" })];

    const map = await getSentNoteNotificationsByNoteIds(envWithDb(db), "user-1", [noteId, noteId, ""]);

    assert.equal(map.size, 1);
    assert.equal(map.get(noteId)?.status, "viewed");
    assert.match(db.alls[0]?.sql ?? "", /note_id IN \(\?\)/);
    assert.doesNotMatch(db.alls[0]?.sql ?? "", /notification_deleted_at/);
    assert.deepEqual(db.alls[0]?.bindings, ["user-1", noteId]);
  });

  it("maps Business confirmation and organization metadata", () => {
    const item = toSentNoteNotificationItem(sentNote({
      receipt_ack_statement: "I confirm that I received these credentials securely.",
      receipt_ack_statement_id: "credentials",
      activity_folder: "Client A",
      activity_tags: JSON.stringify(["credentials", "urgent"]),
      unopened_reminder_at: "2026-06-15T09:00:00.000Z",
    }));
    assert.equal(item.receiptAckStatementId, "credentials");
    assert.equal(item.folder, "Client A");
    assert.deepEqual(item.tags, ["credentials", "urgent"]);
    assert.equal(item.unopenedReminderAt, "2026-06-15T09:00:00.000Z");
    assert.equal(item.openCount, 0);
    assert.equal(item.maxReads, null);
  });

  it("maps persisted open counts onto notification items", () => {
    const item = toSentNoteNotificationItem(sentNote({
      status: "opened",
      opened_at: "2026-06-14T10:00:00.000Z",
      open_count: 3,
      max_reads: 10,
    }));
    assert.equal(item.noteId, "550e8400-e29b-41d4-a716-446655440000");
    assert.equal(item.openCount, 3);
    assert.equal(item.maxReads, 10);
  });

  it("accepts D1 integer counts returned as strings", () => {
    const item = toSentNoteNotificationItem(sentNote({
      status: "opened",
      opened_at: "2026-06-14T10:00:00.000Z",
      open_count: "3" as unknown as number,
      max_reads: "10" as unknown as number,
    }));
    assert.equal(item.openCount, 3);
    assert.equal(item.maxReads, 10);
  });

  it("persists reveal readCount and maxReads on the sent-note row", async () => {
    const db = new FakeD1Database();
    db.firstRows = [sentNote({ notify_on_open: 0, proof_enabled: 1, open_count: 2, max_reads: 10 })];
    const request = new Request("https://privatenote.ai/api/notes/550e8400-e29b-41d4-a716-446655440000/reveal", {
      method: "POST",
      headers: { "User-Agent": "Mozilla/5.0 Chrome/125.0" },
    });

    await recordSentNoteOpened(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      request,
      async () => {
        throw new Error("should not email");
      },
      false,
      { readCount: 3, maxReads: 10 },
    );

    const sql = db.runs[0]?.sql ?? "";
    assert.match(sql, /open_count = \?/);
    assert.match(sql, /max_reads = COALESCE\(\?, max_reads\)/);
    assert.equal(db.runs[0]?.bindings[2], 3);
    assert.equal(db.runs[0]?.bindings[3], 10);
    assert.equal(db.runs.length, 1);
  });

  it("keeps the last reveal count when ciphertext is destroyed", async () => {
    const db = new FakeD1Database();
    db.firstRows = [
      sentNote({
        status: "opened",
        notify_on_open: 0,
        notify_on_destroyed: 0,
        proof_enabled: 1,
        open_count: 9,
        max_reads: 10,
        opened_at: "2026-06-14T10:00:00.000Z",
      }),
    ];

    await recordSentNoteOpened(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      new Request("https://privatenote.ai/api/notes/550e8400-e29b-41d4-a716-446655440000/reveal", {
        method: "POST",
      }),
      async () => {
        throw new Error("should not email");
      },
      true,
      { readCount: 10, maxReads: 10 },
    );

    assert.equal(db.runs[0]?.bindings[0], "destroyed");
    assert.equal(db.runs[0]?.bindings[2], 10);
    assert.equal(db.runs[0]?.bindings[3], 10);
  });

  it("shows an overdue unopened note as expired before scheduled cleanup runs", async () => {
    const item = toSentNoteNotificationItem(
      sentNote({
        status: "created",
        expires_at: "2026-06-14 10:00:00",
        destroyed_at: null,
      }),
      Date.parse("2026-06-14T10:00:01.000Z"),
    );

    assert.equal(item.status, "expired");
    assert.equal(item.eventAt, "2026-06-14T10:00:00.000Z");
    assert.equal(item.destroyedAt, "2026-06-14T10:00:00.000Z");
  });

  it("soft-deletes one notification without deleting the sent_notes row", async () => {
    const db = new FakeD1Database();

    const deleted = await deleteSentNoteNotification(envWithDb(db), "user-1", "sent-note-1");

    assert.equal(deleted, true);
    const sql = db.runs[0]?.sql ?? "";
    assert.match(sql, /^UPDATE sent_notes/i);
    assert.match(sql, /notification_deleted_at = COALESCE\(notification_deleted_at, datetime\('now'\)\)/);
    assert.match(sql, /notification_deleted_at IS NULL/);
    assert.doesNotMatch(sql, /\bDELETE\b/i);
    assert.deepEqual(db.runs[0]?.bindings, ["sent-note-1", "user-1"]);
  });

  it("updates a sent-note label only for its owner", async () => {
    const db = new FakeD1Database();

    const updated = await updateSentNoteLabel(
      envWithDb(db),
      "user-1",
      "sent-note-1",
      "  Payroll access  ",
    );

    assert.equal(updated, true);
    assert.match(db.runs[0]?.sql ?? "", /UPDATE sent_notes/);
    assert.deepEqual(db.runs[0]?.bindings, ["Payroll access", "sent-note-1", "user-1"]);
  });

  it("updates Business folder and tags with the label", async () => {
    const db = new FakeD1Database();
    const updated = await updateSentNoteOrganization(envWithDb(db), "user-1", "sent-note-1", {
      label: "Payroll",
      folder: "Finance",
      tags: ["urgent", "quarterly", "urgent"],
    });
    assert.equal(updated, true);
    assert.deepEqual(db.runs[0]?.bindings, [
      "Payroll", "Finance", JSON.stringify(["urgent", "quarterly"]), "sent-note-1", "user-1",
    ]);
  });

  it("soft-clears notification history without deleting operational records", async () => {
    const db = new FakeD1Database();
    db.nextChanges = 3;

    const cleared = await clearSentNoteNotifications(envWithDb(db), "user-1");

    assert.equal(cleared, 3);
    const sql = db.runs[0]?.sql ?? "";
    assert.match(sql, /^UPDATE sent_notes/i);
    assert.match(sql, /notification_deleted_at = COALESCE\(notification_deleted_at, datetime\('now'\)\)/);
    assert.match(sql, /notification_deleted_at IS NULL/);
    assert.doesNotMatch(sql, /\bDELETE\b/i);
    assert.deepEqual(db.runs[0]?.bindings, ["user-1"]);
  });

  it("records an attachment download and sends one premium receipt email when enabled", async () => {
    const db = new FakeD1Database();
    db.firstRows = [
      sentNote({ label: "Quarterly report", notify_on_attachment_download: 1 }),
      {
        email: "sender@example.com",
        email_verified: 1,
        email_notifications: 1,
        account_type: "personal_premium",
        plan: null,
      },
    ];
    const emails: Array<{ to: string; subject: string; text: string; html: string }> = [];
    const request = new Request("https://privatenote.ai/api/notes/550e8400-e29b-41d4-a716-446655440000/file/chunks/0", {
      headers: {
        "CF-IPCountry": "US",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/125.0 Safari/537.36",
      },
    });

    await recordSentNoteAttachmentDownloaded(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      request,
      async (to, subject, text, html) => {
        emails.push({ to, subject, text, html });
      },
    );

    assert.equal(emails.length, 1);
    assert.equal(emails[0]?.to, "sender@example.com");
    assert.equal(emails[0]?.subject, 'PrivateNote: your file "Quarterly report" was downloaded');
    assert.match(emails[0]?.text ?? "", /encrypted attachment was requested for download/);
    assert.match(db.runs[0]?.sql ?? "", /attachment_downloaded_at = COALESCE/);
    assert.match(db.runs[1]?.sql ?? "", /attachment_downloaded_notified_at = \?/);
  });

  it("records an attachment download without emailing when the alert is off", async () => {
    const db = new FakeD1Database();
    db.firstRows = [sentNote({ notify_on_attachment_download: 0 })];
    let emailCount = 0;

    await recordSentNoteAttachmentDownloaded(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      undefined,
      async () => {
        emailCount += 1;
      },
    );

    assert.equal(emailCount, 0);
    assert.equal(db.runs.length, 1);
    assert.match(db.runs[0]?.sql ?? "", /attachment_downloaded_at = COALESCE/);
  });

  it("does not resend an attachment download receipt after it was claimed", async () => {
    const db = new FakeD1Database();
    db.firstRows = [
      sentNote({
        attachment_downloaded_at: "2026-06-14T10:00:00.000Z",
        attachment_downloaded_notified_at: "2026-06-14T10:00:01.000Z",
      }),
    ];
    let emailCount = 0;

    await recordSentNoteAttachmentDownloaded(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      undefined,
      async () => {
        emailCount += 1;
      },
    );

    assert.equal(emailCount, 0);
    assert.equal(db.runs.length, 1);
  });

  it("acknowledges receipt once and is idempotent on repeat", async () => {
    const { hashReceiptAckTokenHex } = await import("@shared/noteReceiptAck");
    const { acknowledgeSentNoteReceipt } = await import("./sentNotesService.ts");
    const ackToken = "ab".repeat(32);
    const tokenHash = await hashReceiptAckTokenHex(ackToken);
    const db = new FakeD1Database();
    db.firstRows = [
      sentNote({
        require_receipt_ack: 1,
        receipt_ack_token_hash: tokenHash,
        status: "destroyed",
        opened_at: "2026-06-14T10:00:00.000Z",
        destroyed_at: "2026-06-14T10:00:00.000Z",
      }),
      {
        email: "sender@example.com",
        email_verified: 1,
        email_notifications: 1,
      },
    ];
    let emailCount = 0;

    const first = await acknowledgeSentNoteReceipt(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      ackToken,
      undefined,
      async () => {
        emailCount += 1;
      },
    );
    assert.equal(first.ok, true);
    if (first.ok) {
      assert.equal(first.alreadyConfirmed, false);
    }
    assert.equal(emailCount, 1);
    assert.match(db.runs[0]?.sql ?? "", /receipt_acknowledged_at/);

    db.firstRows = [
      sentNote({
        require_receipt_ack: 1,
        receipt_ack_token_hash: tokenHash,
        receipt_acknowledged_at: "2026-06-14T10:01:00.000Z",
        receipt_ack_notified_at: "2026-06-14T10:01:00.000Z",
        status: "destroyed",
      }),
    ];
    const second = await acknowledgeSentNoteReceipt(
      envWithDb(db),
      "550e8400-e29b-41d4-a716-446655440000",
      ackToken,
      undefined,
      async () => {
        emailCount += 1;
      },
    );
    assert.equal(second.ok, true);
    if (second.ok) {
      assert.equal(second.alreadyConfirmed, true);
      assert.equal(second.acknowledgedAt, "2026-06-14T10:01:00.000Z");
    }
    assert.equal(emailCount, 1);
  });
});

describe("recipient verification gate", () => {
  it("still requires verification when the KV gate is gone but D1 says it is required", async () => {
    const db = new FakeD1Database();
    db.firstRows = [{ require_recipient_verification: 1 }];
    const kv = new FakeKvNamespace();

    const required = await noteRequiresRecipientVerification(envWithDb(db, kv), GATE_NOTE_ID);

    assert.equal(required, true);
    assert.equal(kv.store.has(GATE_KEY), false);
  });

  it("does not require verification when D1 says it was never enabled", async () => {
    const db = new FakeD1Database();
    db.firstRows = [{ require_recipient_verification: 0 }];
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    const required = await noteRequiresRecipientVerification(envWithDb(db, kv), GATE_NOTE_ID);

    assert.equal(required, false);
  });

  it("falls back to gate presence for notes with no sent_notes row", async () => {
    const db = new FakeD1Database();
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    const required = await noteRequiresRecipientVerification(envWithDb(db, kv), GATE_NOTE_ID);

    assert.equal(required, true);
  });

  it("keeps the gate alive for the whole note lifetime when sending a code", async () => {
    const db = new FakeD1Database();
    const kv = new FakeKvNamespace();
    const twentyDays = 20 * 24 * 3600;
    const expiresAt = new Date(Date.now() + twentyDays * 1000).toISOString();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com", expiresAt }));

    const result = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async () => {},
    );

    assert.equal(result.ok, true);
    const ttl = kv.store.get(GATE_KEY)?.expirationTtl ?? 0;
    // A flat 7-day rewrite would expire the gate while the note is still readable.
    assert.ok(
      ttl > 7 * 24 * 3600,
      `expected gate TTL to outlive a 7-day window, got ${ttl}`,
    );
    assert.ok(ttl <= twentyDays, `expected gate TTL within note lifetime, got ${ttl}`);
  });

  it("recovers the note lifetime from D1 for gates written before expiresAt was stored", async () => {
    const db = new FakeD1Database();
    const twentyDays = 20 * 24 * 3600;
    db.firstRows = [{ expires_at: new Date(Date.now() + twentyDays * 1000).toISOString() }];
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    const result = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async () => {},
    );

    assert.equal(result.ok, true);
    const ttl = kv.store.get(GATE_KEY)?.expirationTtl ?? 0;
    assert.ok(ttl > 7 * 24 * 3600, `expected gate TTL from D1 expiry, got ${ttl}`);
  });

  it("leaves the gate in place on revoke so a failed purge cannot drop verification", async () => {
    const db = new FakeD1Database();
    db.firstRows = [sentNote({ require_recipient_verification: 1 })];
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    const revoked = await revokeSentNote(envWithDb(db, kv), "user-1", GATE_NOTE_ID);

    assert.equal(revoked.ok, true);
    assert.equal(kv.deletes.length, 0);
    assert.equal(kv.store.has(GATE_KEY), true);
  });

  it("clears the gate only when the caller confirms the ciphertext is gone", async () => {
    const db = new FakeD1Database();
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    await clearRecipientGate(envWithDb(db, kv), GATE_NOTE_ID);

    assert.deepEqual(kv.deletes, [GATE_KEY]);
    assert.equal(kv.store.has(GATE_KEY), false);
  });

  it("rolls back a failed send so Resend is not locked behind cooldown", async () => {
    const db = new FakeD1Database();
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    const failed = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async () => {
        throw new Error("smtp_down");
      },
    );
    assert.equal(failed.ok, false);
    if (!failed.ok) assert.equal(failed.error, "send_failed");

    const gateAfterFailure = JSON.parse(kv.store.get(GATE_KEY)?.value ?? "{}") as {
      codeHash?: string;
      codeSentAt?: number;
      sendClaimId?: string;
    };
    assert.equal(gateAfterFailure.codeHash, undefined);
    assert.equal(gateAfterFailure.codeSentAt, undefined);
    assert.equal(gateAfterFailure.sendClaimId, undefined);

    let emailedCode = "";
    const retried = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async (_to, _subject, text) => {
        const match = text.match(/\b(\d{6})\b/);
        emailedCode = match?.[1] ?? "";
      },
    );
    assert.equal(retried.ok, true);
    assert.match(emailedCode, /^\d{6}$/);

    const verified = await verifyRecipientAccess(envWithDb(db, kv), GATE_NOTE_ID, {
      code: emailedCode,
    });
    assert.equal(verified.ok, true);
  });

  it("restores the previous working code when a resend email fails", async () => {
    const db = new FakeD1Database();
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    let firstCode = "";
    const first = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async (_to, _subject, text) => {
        firstCode = text.match(/\b(\d{6})\b/)?.[1] ?? "";
      },
    );
    assert.equal(first.ok, true);

    // Simulate cooldown expiry so a resend is allowed.
    const afterFirst = JSON.parse(kv.store.get(GATE_KEY)?.value ?? "{}") as Record<string, unknown>;
    afterFirst.codeSentAt = Date.now() - 61_000;
    await kv.put(GATE_KEY, JSON.stringify(afterFirst));

    const failedResend = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async () => {
        throw new Error("smtp_down");
      },
    );
    assert.equal(failedResend.ok, false);

    const verified = await verifyRecipientAccess(envWithDb(db, kv), GATE_NOTE_ID, {
      code: firstCode,
    });
    assert.equal(verified.ok, true);
  });

  it("rejects a concurrent send while another claim is in flight", async () => {
    const db = new FakeD1Database();
    const kv = new FakeKvNamespace();
    await kv.put(GATE_KEY, JSON.stringify({ recipientEmail: "alice@example.com" }));

    let releaseFirstEmail: (() => void) | undefined;
    const firstEmailHeld = new Promise<void>((resolve) => {
      releaseFirstEmail = resolve;
    });
    let firstEnteredSend = false;

    const firstPromise = sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async () => {
        firstEnteredSend = true;
        await firstEmailHeld;
      },
    );

    // Wait until the first request has claimed and entered sendEmailFn.
    for (let i = 0; i < 50 && !firstEnteredSend; i += 1) {
      await new Promise((r) => setTimeout(r, 5));
    }
    assert.equal(firstEnteredSend, true);

    const second = await sendRecipientVerificationCode(
      envWithDb(db, kv),
      GATE_NOTE_ID,
      async () => {
        throw new Error("should_not_send");
      },
    );
    assert.equal(second.ok, false);
    if (!second.ok) assert.equal(second.error, "cooldown");

    releaseFirstEmail?.();
    const first = await firstPromise;
    assert.equal(first.ok, true);
  });
});
