import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatNotificationTimestamp,
  groupNotifications,
  statusLabel,
  statusTone,
  buildProofTimeline,
  hasProofReport,
  type NotificationItem,
} from "./NotificationCenter.logic.ts";

function notification(overrides: Partial<NotificationItem>): NotificationItem {
  return {
    id: "notification-1",
    noteId: "550e8400-e29b-41d4-a716-446655440000",
    recipientEmail: null,
    displayNoteId: "#ABC123",
    status: "created",
    eventAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("NotificationCenter helpers", () => {
  it("groups notifications into relative time buckets in first-seen order", () => {
    const now = Date.now();
    const items = [
      notification({ id: "today", eventAt: new Date(now).toISOString() }),
      notification({ id: "yesterday", eventAt: new Date(now - 24 * 60 * 60 * 1000).toISOString() }),
      notification({ id: "week", eventAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString() }),
      notification({ id: "earlier", eventAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() }),
    ];

    const groups = groupNotifications(items);

    assert.deepEqual(groups.map((group) => group.period), [
      "today",
      "yesterday",
      "this_week",
      "earlier",
    ]);
    assert.deepEqual(groups.map((group) => group.items[0]?.id), [
      "today",
      "yesterday",
      "week",
      "earlier",
    ]);
  });

  it("puts invalid timestamps into the earlier bucket", () => {
    const groups = groupNotifications([
      notification({ id: "bad-time", eventAt: "not-a-date" }),
    ]);

    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.period, "earlier");
    assert.equal(groups[0]?.items[0]?.id, "bad-time");
  });

  it("formats timestamps with Today or Yesterday labels", () => {
    const now = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    assert.match(formatNotificationTimestamp(now.toISOString()), /^Today \d{2}:\d{2}$/);
    assert.match(formatNotificationTimestamp(yesterday.toISOString()), /^Yesterday \d{2}:\d{2}$/);
  });

  it("uses translated status labels and expected tones", () => {
    assert.equal(statusLabel("attachment_downloaded", {
      notificationStatusAttachmentDownloaded: "Attachment opened",
    }), "Attachment opened");
    assert.equal(statusLabel("viewed", {}), "Viewed");
    assert.match(statusTone("attachment_downloaded"), /indigo/);
    assert.match(statusTone("burned"), /amber/);
  });

  it("builds a proof timeline and detects when a report is available", () => {
    assert.equal(hasProofReport(notification({ status: "created" })), false);
    assert.equal(
      hasProofReport(
        notification({
          status: "viewed",
          openedAt: "2026-07-27T12:00:00.000Z",
        }),
      ),
      true,
    );

    const timeline = buildProofTimeline(
      notification({
        status: "burned",
        createdAt: "2026-07-27T10:00:00.000Z",
        openedAt: "2026-07-27T11:00:00.000Z",
        destroyedAt: "2026-07-27T11:01:00.000Z",
      }),
    );
    assert.deepEqual(
      timeline.map((entry) => entry.key),
      ["created", "opened", "destroyed"],
    );
  });
});
