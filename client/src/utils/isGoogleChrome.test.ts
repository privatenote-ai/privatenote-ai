import assert from "node:assert/strict";
import test from "node:test";
import { isGoogleChrome } from "./isGoogleChrome.ts";

test("isGoogleChrome detects desktop Chrome", () => {
  const chromeUa =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { userAgent: chromeUa },
  });
  assert.equal(isGoogleChrome(), true);
});

test("isGoogleChrome rejects Edge and mobile Chrome", () => {
  const edgeUa =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { userAgent: edgeUa },
  });
  assert.equal(isGoogleChrome(), false);

  const androidChromeUa =
    "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { userAgent: androidChromeUa },
  });
  assert.equal(isGoogleChrome(), false);
});
