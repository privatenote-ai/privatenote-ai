import assert from "node:assert/strict";
import test from "node:test";
import {
  intlLocaleForLanguage,
  isLocaleHomeSegment,
  isSupportedLanguage,
  LOCALE_HOME_PATH_PATTERN,
  NON_ENGLISH_LANGUAGE_CODES,
  normalizeAccountPreferredLanguageInput,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
} from "./supportedLanguages.ts";

test("supported languages include pt, sr, hr, tr, pl", () => {
  assert.deepEqual(SUPPORTED_LANGUAGES, ["en", "de", "fr", "es", "it", "nl", "pt", "sr", "hr", "tr", "pl"]);
  assert.equal(NON_ENGLISH_LANGUAGE_CODES.length, 10);
});

test("account preferred language accepts every product UI language", () => {
  for (const language of SUPPORTED_LANGUAGES) {
    assert.deepEqual(normalizeAccountPreferredLanguageInput(language), {
      ok: true,
      value: language,
    });
  }
  assert.deepEqual(normalizeAccountPreferredLanguageInput("it-IT"), { ok: true, value: "it" });
  assert.deepEqual(normalizeAccountPreferredLanguageInput("sr-Latn"), { ok: true, value: "sr" });
  assert.deepEqual(normalizeAccountPreferredLanguageInput("nl-NL"), { ok: true, value: "nl" });
  assert.deepEqual(normalizeAccountPreferredLanguageInput(null), { ok: true, value: null });
  const rejected = normalizeAccountPreferredLanguageInput("xx");
  assert.equal(rejected.ok, false);
  if (!rejected.ok) {
    assert.equal(
      rejected.message,
      `preferredLanguage must be one of ${SUPPORTED_LANGUAGES.join(", ")} (or a regional tag such as en-US), or null`,
    );
  }
});

test("normalizeLanguageCode maps regional tags", () => {
  assert.equal(normalizeLanguageCode("pt-BR"), "pt");
  assert.equal(normalizeLanguageCode("sr-Latn"), "sr");
  assert.equal(normalizeLanguageCode("hr-HR"), "hr");
  assert.equal(normalizeLanguageCode("tr-TR"), "tr");
  assert.equal(normalizeLanguageCode("pl-PL"), "pl");
  assert.equal(normalizeLanguageCode("xx"), "en");
});

test("locale home pattern matches marketing locale codes", () => {
  assert.match("pt", new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`));
  assert.equal(isLocaleHomeSegment("hr"), true);
  assert.equal(isSupportedLanguage("sr"), true);
  assert.equal(isSupportedLanguage("tr"), true);
  assert.equal(isSupportedLanguage("pl"), true);
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
