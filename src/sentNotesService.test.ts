import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearSentNoteNotifications,
  deleteSentNoteNotification,
  listSentNoteNotificationsForUser,
  recordSentNoteAttachmentDownloaded,
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

function envWithDb(db: FakeD1Database): Env {
  return { AUTH_DB: db } as unknown as Env;
}

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
    ...overrides,
  };
}

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
