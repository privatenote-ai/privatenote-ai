import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isFreeRevealBodyFont,
  isRevealBodyFont,
  mayStoreRevealBodyFont,
  parseRevealBodyFont,
  revealBodyFontClassName,
  revealBodyFontEntry,
  revealBodyFontUpgradePlan,
  REVEAL_BODY_FONT_CATALOG,
  REVEAL_BODY_FONT_IDS,
} from "./revealBodyFont.ts";

const FREE = { starter: false, business: false };
const STARTER = { starter: true, business: false };
const BUSINESS = { starter: true, business: true };

describe("revealBodyFont", () => {
  it("allowlists a small catalog including the default and one free extra face", () => {
    assert.deepEqual([...REVEAL_BODY_FONT_IDS], [
      "system",
      "satoshi",
      "source-serif",
      "ibm-plex-serif",
      "fraunces",
      "jetbrains-mono",
    ]);
    assert.equal(REVEAL_BODY_FONT_CATALOG.length, 6);
    assert.equal(isFreeRevealBodyFont("system"), true);
    assert.equal(isFreeRevealBodyFont("satoshi"), true);
    assert.equal(isFreeRevealBodyFont("source-serif"), false);
    assert.equal(isFreeRevealBodyFont("ibm-plex-serif"), false);
    assert.equal(revealBodyFontEntry("ibm-plex-serif").plan, "business");
  });

  it("accepts only catalog ids", () => {
    assert.equal(isRevealBodyFont("system"), true);
    assert.equal(isRevealBodyFont("satoshi"), true);
    assert.equal(isRevealBodyFont("source-serif"), true);
    assert.equal(isRevealBodyFont("ibm-plex-serif"), true);
    assert.equal(isRevealBodyFont("Inter"), false);
    assert.equal(isRevealBodyFont("Comic Sans MS"), false);
    assert.equal(isRevealBodyFont("url(https://evil.example/x.woff2)"), false);
  });

  it("omits the default and drops unsafe values instead of storing them", () => {
    assert.equal(parseRevealBodyFont("system"), undefined);
    assert.equal(parseRevealBodyFont(null), undefined);
    assert.equal(parseRevealBodyFont("satoshi"), "satoshi");
    assert.equal(parseRevealBodyFont("source-serif"), "source-serif");
    assert.equal(parseRevealBodyFont("ibm-plex-serif"), "ibm-plex-serif");
    assert.equal(parseRevealBodyFont("fraunces"), "fraunces");
    assert.equal(parseRevealBodyFont("jetbrains-mono"), "jetbrains-mono");
    assert.equal(parseRevealBodyFont(" source-serif "), "source-serif");
    assert.equal(parseRevealBodyFont("Georgia, serif"), undefined);
    assert.equal(parseRevealBodyFont({ id: "source-serif" }), undefined);
  });

  it("lets free plans persist Satoshi but not paid faces", () => {
    assert.equal(mayStoreRevealBodyFont("satoshi", FREE), true);
    assert.equal(mayStoreRevealBodyFont("source-serif", FREE), false);
    assert.equal(mayStoreRevealBodyFont("source-serif", STARTER), true);
    assert.equal(mayStoreRevealBodyFont("ibm-plex-serif", STARTER), false);
    assert.equal(mayStoreRevealBodyFont("ibm-plex-serif", BUSINESS), true);
  });

  it("maps ids to static class names rather than interpolating CSS", () => {
    assert.equal(revealBodyFontClassName("system"), "note-body-font-system");
    assert.equal(revealBodyFontClassName("satoshi"), "note-body-font-satoshi");
    assert.equal(revealBodyFontClassName("source-serif"), "note-body-font-source-serif");
    assert.equal(revealBodyFontClassName("ibm-plex-serif"), "note-body-font-ibm-plex-serif");
    assert.equal(revealBodyFontClassName(undefined), "note-body-font-system");
    assert.equal(revealBodyFontEntry("jetbrains-mono").cssFamily.includes("JetBrains Mono"), true);
    assert.equal(revealBodyFontEntry("satoshi").cssFamily.includes("Satoshi"), true);
    assert.equal(revealBodyFontEntry("ibm-plex-serif").cssFamily.includes("IBM Plex Serif"), true);
    assert.equal(revealBodyFontUpgradePlan("satoshi"), null);
    assert.equal(revealBodyFontUpgradePlan("source-serif"), "starter");
    assert.equal(revealBodyFontUpgradePlan("ibm-plex-serif"), "business");
  });
});
