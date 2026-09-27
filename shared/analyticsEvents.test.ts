import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAnalyticsIngest } from "./analyticsEvents";
import { ANALYTICS_FORBIDDEN_KEY_TOKENS } from "./analyticsEvents";

describe("parseAnalyticsIngest privacy guardrails", () => {
  it("rejects URL fragments on page analytics", () => {
    const parsed = parseAnalyticsIngest({
      kind: "engagement",
      path: "/note/abc#decryption-key-must-never-be-stored",
      visits: 1,
      engagedMs: 1000,
    });
    assert.ok(parsed);
    assert.equal(parsed.kind, "engagement");
    if (parsed.kind === "engagement") {
      assert.equal(parsed.page, "/note");
      assert.equal(JSON.stringify(parsed).includes("decryption"), false);
      assert.equal(JSON.stringify(parsed).includes("#"), false);
    }
  });

  it("rejects query strings that may contain secrets", () => {
    const parsed = parseAnalyticsIngest({
      kind: "session_started",
      path: "/auth?email=user@example.com&token=secret",
      referrerType: "google",
    });
    assert.ok(parsed);
    assert.equal(parsed.kind, "session_started");
    if (parsed.kind === "session_started") {
      assert.equal(parsed.page, "/auth");
      assert.equal(JSON.stringify(parsed).includes("email"), false);
      assert.equal(JSON.stringify(parsed).includes("token"), false);
    }
  });

  it("does not accept a sessionId field", () => {
    assert.equal(
      parseAnalyticsIngest({
        kind: "session_started",
        path: "/",
        referrerType: "direct",
        sessionId: "abc123",
      }),
      null,
    );
  });

  for (const token of ANALYTICS_FORBIDDEN_KEY_TOKENS) {
    it(`rejects payloads with a ${token} field`, () => {
      assert.equal(
        parseAnalyticsIngest({
          event: "note_creation_started",
          [token]: "leak",
        }),
        null,
      );
    });
  }

  it("rejects noteId, email, filename, url, and password even as extra properties", () => {
    assert.equal(parseAnalyticsIngest({ event: "note_link_copied", noteId: "n_1" }), null);
    assert.equal(parseAnalyticsIngest({ event: "signup_started", email: "a@b.c" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_creation_started", filename: "secret.pdf" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_link_copied", url: "https://privatenote.ai/note/x" }), null);
    assert.equal(parseAnalyticsIngest({ event: "wrong_password", password: "hunter2" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_creation_started", content: "plaintext" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_open_page_loaded", recipient: "a@b.c" }), null);
    assert.equal(parseAnalyticsIngest({ event: "auth_page_viewed", token: "abc" }), null);
    assert.equal(parseAnalyticsIngest({ event: "cta_clicked", ctaId: "home_create", fragment: "#x" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_creation_started", file: "x" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_creation_started", secret: "x" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_creation_started", key: "x" }), null);
    assert.equal(parseAnalyticsIngest({ event: "note_creation_started", plaintext: "x" }), null);
  });

  it("accepts the recipient Create New Note CTA and collapses the note id", () => {
    const parsed = parseAnalyticsIngest({
      event: "cta_clicked",
      ctaId: "recipient_create_note",
      path: "/note/abc-uuid-must-never-be-stored",
    });
    assert.ok(parsed);
    assert.equal(parsed.kind, "named");
    if (parsed.kind === "named") {
      assert.equal(parsed.ctaId, "recipient_create_note");
      assert.equal(parsed.page, "/note");
      assert.equal(JSON.stringify(parsed).includes("abc-uuid"), false);
    }
  });

  it("accepts allowlisted named events without extra properties", () => {
    const parsed = parseAnalyticsIngest({ event: "note_creation_started" });
    assert.ok(parsed);
    assert.equal(parsed.kind, "named");
    if (parsed.kind === "named") assert.equal(parsed.event, "note_creation_started");
  });

  it("accepts session summaries without reconstructing a page path list", () => {
    const parsed = parseAnalyticsIngest({
      kind: "session_summary",
      landingPath: "/one-time-link",
      exitPath: "/",
      pageCount: 3,
      openedNote: true,
      createdNote: true,
      recipientLoop: true,
      referrerType: "google",
    });
    assert.ok(parsed);
    assert.equal(parsed.kind, "session_summary");
    if (parsed.kind === "session_summary") {
      assert.equal(parsed.recipientLoop, true);
      assert.equal("pages" in parsed, false);
      assert.equal("sessionId" in parsed, false);
    }
  });

  it("strips unknown UTM characters and ignores arbitrary query keys", () => {
    const parsed = parseAnalyticsIngest({
      kind: "session_started",
      path: "/",
      referrerType: "x",
      utmSource: "X",
      utmMedium: "social",
      utmCampaign: "mcp",
      utmContent: "agent-secrets",
      utm_term: "should-reject-because-unknown-key",
    });
    assert.equal(parsed, null);

    const ok = parseAnalyticsIngest({
      kind: "session_started",
      path: "/",
      referrerType: "x",
      utmSource: "x",
      utmMedium: "social",
      utmCampaign: "mcp",
      utmContent: "agent-secrets",
    });
    assert.ok(ok);
    assert.equal(ok.kind, "session_started");
    if (ok.kind === "session_started") {
      assert.equal(ok.utm.source, "x");
      assert.equal(ok.utm.campaign, "mcp");
      assert.equal(ok.utm.content, "agent-secrets");
    }
  });
});
