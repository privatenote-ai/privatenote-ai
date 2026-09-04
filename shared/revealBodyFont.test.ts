import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isRevealBodyFont,
  parseRevealBodyFont,
  revealBodyFontClassName,
  revealBodyFontEntry,
  REVEAL_BODY_FONT_CATALOG,
  REVEAL_BODY_FONT_IDS,
} from "./revealBodyFont.ts";

describe("revealBodyFont", () => {
  it("allowlists a small OFL catalog including the default", () => {
    assert.deepEqual([...REVEAL_BODY_FONT_IDS], [
      "system",
      "source-serif",
      "fraunces",
      "jetbrains-mono",
    ]);
    assert.equal(REVEAL_BODY_FONT_CATALOG.length, 4);
  });

  it("accepts only catalog ids", () => {
    assert.equal(isRevealBodyFont("system"), true);
    assert.equal(isRevealBodyFont("source-serif"), true);
    assert.equal(isRevealBodyFont("Inter"), false);
    assert.equal(isRevealBodyFont("Comic Sans MS"), false);
    assert.equal(isRevealBodyFont("url(https://evil.example/x.woff2)"), false);
  });

  it("omits the default and drops unsafe values instead of storing them", () => {
    assert.equal(parseRevealBodyFont("system"), undefined);
    assert.equal(parseRevealBodyFont(null), undefined);
    assert.equal(parseRevealBodyFont("source-serif"), "source-serif");
    assert.equal(parseRevealBodyFont("fraunces"), "fraunces");
    assert.equal(parseRevealBodyFont("jetbrains-mono"), "jetbrains-mono");
    assert.equal(parseRevealBodyFont(" source-serif "), "source-serif");
    assert.equal(parseRevealBodyFont("Georgia, serif"), undefined);
    assert.equal(parseRevealBodyFont({ id: "source-serif" }), undefined);
  });

  it("maps ids to static class names rather than interpolating CSS", () => {
    assert.equal(revealBodyFontClassName("system"), "note-body-font-system");
    assert.equal(revealBodyFontClassName("source-serif"), "note-body-font-source-serif");
    assert.equal(revealBodyFontClassName(undefined), "note-body-font-system");
    assert.equal(revealBodyFontEntry("jetbrains-mono").cssFamily.includes("JetBrains Mono"), true);
  });
});
