import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isFreeRevealBodyFont,
  isRevealBodyFont,
  mayStoreRevealBodyFont,
  parseRevealBodyFont,
  revealBodyFontClassName,
  revealBodyFontEntry,
  REVEAL_BODY_FONT_CATALOG,
  REVEAL_BODY_FONT_IDS,
} from "./revealBodyFont.ts";

describe("revealBodyFont", () => {
  it("allowlists a small catalog including the default and one free extra face", () => {
    assert.deepEqual([...REVEAL_BODY_FONT_IDS], [
      "system",
      "satoshi",
      "source-serif",
      "fraunces",
      "jetbrains-mono",
    ]);
    assert.equal(REVEAL_BODY_FONT_CATALOG.length, 5);
    assert.equal(isFreeRevealBodyFont("system"), true);
    assert.equal(isFreeRevealBodyFont("satoshi"), true);
    assert.equal(isFreeRevealBodyFont("source-serif"), false);
  });

  it("accepts only catalog ids", () => {
    assert.equal(isRevealBodyFont("system"), true);
    assert.equal(isRevealBodyFont("satoshi"), true);
    assert.equal(isRevealBodyFont("source-serif"), true);
    assert.equal(isRevealBodyFont("Inter"), false);
    assert.equal(isRevealBodyFont("Comic Sans MS"), false);
    assert.equal(isRevealBodyFont("url(https://evil.example/x.woff2)"), false);
  });

  it("omits the default and drops unsafe values instead of storing them", () => {
    assert.equal(parseRevealBodyFont("system"), undefined);
    assert.equal(parseRevealBodyFont(null), undefined);
    assert.equal(parseRevealBodyFont("satoshi"), "satoshi");
    assert.equal(parseRevealBodyFont("source-serif"), "source-serif");
    assert.equal(parseRevealBodyFont("fraunces"), "fraunces");
    assert.equal(parseRevealBodyFont("jetbrains-mono"), "jetbrains-mono");
    assert.equal(parseRevealBodyFont(" source-serif "), "source-serif");
    assert.equal(parseRevealBodyFont("Georgia, serif"), undefined);
    assert.equal(parseRevealBodyFont({ id: "source-serif" }), undefined);
  });

  it("lets free plans persist Satoshi but not paid faces", () => {
    assert.equal(mayStoreRevealBodyFont("satoshi", false), true);
    assert.equal(mayStoreRevealBodyFont("source-serif", false), false);
    assert.equal(mayStoreRevealBodyFont("source-serif", true), true);
  });

  it("maps ids to static class names rather than interpolating CSS", () => {
    assert.equal(revealBodyFontClassName("system"), "note-body-font-system");
    assert.equal(revealBodyFontClassName("satoshi"), "note-body-font-satoshi");
    assert.equal(revealBodyFontClassName("source-serif"), "note-body-font-source-serif");
    assert.equal(revealBodyFontClassName(undefined), "note-body-font-system");
    assert.equal(revealBodyFontEntry("jetbrains-mono").cssFamily.includes("JetBrains Mono"), true);
    assert.equal(revealBodyFontEntry("satoshi").cssFamily.includes("Satoshi"), true);
  });
});
