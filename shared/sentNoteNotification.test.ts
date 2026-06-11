import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatNotificationNoteDisplayId,
  resolveSentNoteNotificationEvent,
} from "./sentNoteNotification.ts";

describe("sentNoteNotification", () => {
  it("formats a stable short display id", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const displayId = formatNotificationNoteDisplayId(id);
    assert.match(displayId, /^#[0-9A-Z]{6}$/);
    assert.equal(formatNotificationNoteDisplayId(id), displayId);
  });

  it("prefers the latest lifecycle event", () => {
    const viewed = resolveSentNoteNotificationEvent({
      status: "opened",
      created_at: "2026-06-01T10:00:00.000Z",
      opened_at: "2026-06-01T12:00:00.000Z",
      destroyed_at: null,
      revoked_at: null,
    });
    assert.equal(viewed.status, "viewed");
    assert.equal(viewed.eventAt, "2026-06-01T12:00:00.000Z");

    const burned = resolveSentNoteNotificationEvent({
      status: "destroyed",
      created_at: "2026-06-01T10:00:00.000Z",
      opened_at: "2026-06-01T12:00:00.000Z",
      destroyed_at: "2026-06-01T13:00:00.000Z",
      revoked_at: null,
    });
    assert.equal(burned.status, "burned");

    const downloaded = resolveSentNoteNotificationEvent({
      status: "opened",
      created_at: "2026-06-01T10:00:00.000Z",
      opened_at: "2026-06-01T12:00:00.000Z",
      destroyed_at: null,
      revoked_at: null,
      attachment_downloaded_at: "2026-06-01T12:30:00.000Z",
    });
    assert.equal(downloaded.status, "attachment_downloaded");
  });
});
