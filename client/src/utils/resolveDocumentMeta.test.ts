import assert from "node:assert/strict";
import test from "node:test";
import { resolveDocumentMeta } from "./resolveDocumentMeta.ts";
import { de } from "./translations/de.ts";
import { en } from "./translations/en.ts";
import { fr } from "./translations/fr.ts";

test("resolveDocumentMeta compounds German security-resources hero title", () => {
  const meta = resolveDocumentMeta("/de/security-resources", { ...en, ...de });
  assert.match(meta.title, /Sicherheitsarchitektur/);
  assert.doesNotMatch(meta.title, /Sicherheits architektur/);
});

test("resolveDocumentMeta keeps spaced French security-resources hero title", () => {
  const meta = resolveDocumentMeta("/fr/security-resources", { ...en, ...fr });
  assert.match(meta.title, /Architecture de sécurité/);
});
