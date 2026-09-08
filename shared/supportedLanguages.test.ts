import assert from "node:assert/strict";
import test from "node:test";
import {
  intlLocaleForLanguage,
  isLocaleHomeSegment,
  isSupportedLanguage,
  LOCALE_HOME_PATH_PATTERN,
  NON_ENGLISH_LANGUAGE_CODES,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
} from "./supportedLanguages.ts";

test("supported languages include pt, sr, hr", () => {
  assert.deepEqual(SUPPORTED_LANGUAGES, ["en", "de", "fr", "es", "it", "nl", "pt", "sr", "hr"]);
  assert.equal(NON_ENGLISH_LANGUAGE_CODES.length, 8);
});

test("normalizeLanguageCode maps regional tags", () => {
  assert.equal(normalizeLanguageCode("pt-BR"), "pt");
  assert.equal(normalizeLanguageCode("sr-Latn"), "sr");
  assert.equal(normalizeLanguageCode("hr-HR"), "hr");
  assert.equal(normalizeLanguageCode("xx"), "en");
});

test("locale home pattern matches marketing locale codes", () => {
  assert.match("pt", new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`));
  assert.equal(isLocaleHomeSegment("hr"), true);
  assert.equal(isSupportedLanguage("sr"), true);
});

test("intlLocaleForLanguage keeps Serbian on Latin script", () => {
  assert.equal(intlLocaleForLanguage("sr"), "sr-Latn");
  assert.equal(intlLocaleForLanguage("sr-RS"), "sr-Latn");
  assert.equal(intlLocaleForLanguage("de"), "de");
  const formatted = new Intl.DateTimeFormat(intlLocaleForLanguage("sr"), {
    dateStyle: "long",
  }).format(new Date(2026, 8, 8));
  assert.match(formatted, /septembar/i);
  assert.doesNotMatch(formatted, /септембар/);
});
