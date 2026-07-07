import assert from "node:assert/strict";
import test from "node:test";
import { en } from "../client/src/utils/translations/en.ts";
import {
  buildPasswordGeneratorFaqSchema,
  isPasswordGeneratorRoute,
  PASSWORD_GENERATOR_FAQ_IDS,
} from "./passwordGeneratorStructuredData.ts";

test("isPasswordGeneratorRoute matches English and localized paths", () => {
  assert.equal(isPasswordGeneratorRoute("/password-generator"), true);
  assert.equal(isPasswordGeneratorRoute("/de/password-generator"), true);
  assert.equal(isPasswordGeneratorRoute("/secure-file-transfer"), false);
});

test("buildPasswordGeneratorFaqSchema includes all FAQ entries", () => {
  const schema = buildPasswordGeneratorFaqSchema(en);
  assert.equal((schema.mainEntity as unknown[]).length, PASSWORD_GENERATOR_FAQ_IDS.length);
});
