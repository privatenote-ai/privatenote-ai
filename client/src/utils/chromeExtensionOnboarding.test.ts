import assert from "node:assert/strict";
import test from "node:test";
import {
  getWebNotesCreatedCount,
  meetsChromeExtensionOnboardingPrerequisites,
  recordWebNoteCreated,
} from "./chromeExtensionOnboarding.ts";

const NOTES_KEY = "privatenote_web_notes_created_count";
const DISMISS_KEY = "privatenote_chrome_extension_prompt_dismissed";

function mockChromeNavigator() {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
}

test("recordWebNoteCreated increments persisted count", () => {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    },
  });

  assert.equal(getWebNotesCreatedCount(), 0);
  assert.equal(recordWebNoteCreated(), 1);
  assert.equal(recordWebNoteCreated(), 2);
  assert.equal(storage.get(NOTES_KEY), "2");
});

test("meetsChromeExtensionOnboardingPrerequisites requires second note on Chrome", () => {
  mockChromeNavigator();
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    },
  });

  assert.equal(meetsChromeExtensionOnboardingPrerequisites(), false);
  storage.set(NOTES_KEY, "1");
  assert.equal(meetsChromeExtensionOnboardingPrerequisites(), false);
  storage.set(NOTES_KEY, "2");
  assert.equal(meetsChromeExtensionOnboardingPrerequisites(), true);
  storage.set(DISMISS_KEY, "1");
  assert.equal(meetsChromeExtensionOnboardingPrerequisites(), false);
});
