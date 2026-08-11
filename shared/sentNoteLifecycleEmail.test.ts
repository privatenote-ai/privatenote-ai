import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSentNoteLifecycleEmailContent } from "./sentNoteLifecycleEmail.ts";

describe("buildSentNoteLifecycleEmailContent", () => {
  it("builds a branded receipt email with Activity CTA and logo", () => {
    const email = buildSentNoteLifecycleEmailContent({
      event: "receipt_acknowledged",
      label: "Client pack",
      eventAt: "2026-08-08T15:12:34.505Z",
      country: "LU",
      deviceClass: "desktop",
      browser: "chrome",
      webOrigin: "https://premium.privatenote.ai",
    });

    assert.match(email.subject, /receipt confirmed for "Client pack"/);
    assert.match(email.text, /View in Activity:/);
    assert.match(email.text, /https:\/\/premium\.privatenote\.ai\/account\/activity/);
    assert.match(email.html, /privateNote-logo-mark\.png/);
    assert.match(email.html, /View in Activity/);
    assert.match(email.html, /https:\/\/premium\.privatenote\.ai\/account\/activity/);
    assert.match(email.html, /Approximate country|Country/);
    assert.match(email.html, />LU</);
    assert.match(email.html, /desktop, chrome/);
  });

  it("falls back to production origin when webOrigin is missing", () => {
    const email = buildSentNoteLifecycleEmailContent({
      event: "opened",
      label: "db794d8d...",
      eventAt: "2026-08-08T15:12:34.505Z",
    });
    assert.match(email.html, /https:\/\/privatenote\.ai\/brand\/privateNote-logo-mark\.png/);
    assert.match(email.html, /https:\/\/privatenote\.ai\/account\/activity/);
  });
});
