import assert from "node:assert/strict";
import test from "node:test";
import { en } from "./translations/en.ts";
import { fr } from "./translations/fr.ts";
import { isNoindexPath } from "./documentMeta.ts";
import { resolveDocumentMeta } from "./resolveDocumentMeta.ts";

test("resolveDocumentMeta titles the branding account page separately from preferences", () => {
  const branding = resolveDocumentMeta("/account/branding", en);
  const preferences = resolveDocumentMeta("/account/preferences", en);
  assert.match(branding.title, /Branding/);
  assert.notEqual(branding.title, preferences.title);
  assert.match(branding.description, /recipients/i);
});

test("isNoindexPath marks private app routes", () => {
  assert.equal(isNoindexPath("/auth/sign-in"), true);
  assert.equal(isNoindexPath("/magic"), true);
  assert.equal(isNoindexPath("/account"), true);
  assert.equal(isNoindexPath("/note/abc"), true);
  assert.equal(isNoindexPath("/admin/blog"), true);
});

test("resolveDocumentMeta treats /admin as the admin dashboard, not 404", () => {
  const meta = resolveDocumentMeta("/admin", en);
  assert.equal(meta.title, "Admin · PrivateNote.ai");
  assert.match(meta.description, /admin dashboard/i);
  assert.notEqual(meta.title, resolveDocumentMeta("/missing-page", en).title);
});

test("isNoindexPath allows public marketing and locale routes", () => {
  assert.equal(isNoindexPath("/"), false);
  assert.equal(isNoindexPath("/de/"), false);
  assert.equal(isNoindexPath("/de"), false);
  assert.equal(isNoindexPath("/fr/about/"), false);
  assert.equal(isNoindexPath("/es/blog/privacy-tools"), false);
  assert.equal(isNoindexPath("/it/about"), false);
  assert.equal(isNoindexPath("/nl/blog/privacy-tools"), false);
});

test("resolveDocumentMeta returns unique titles for reported duplicate-title URLs", () => {
  const cases = [
    ["/auth", en],
    ["/auth/sign-up", en],
    ["/about", en],
    ["/security-guides/messenger", en],
    ["/password-generator", en],
    ["/how-it-works", en],
    ["/fr/password-generator", { ...en, ...fr }],
    ["/fr/privacy", { ...en, ...fr }],
    ["/contact", en],
  ] as const;

  const titles = cases.map(([path, t]) => resolveDocumentMeta(path, t).title);
  assert.equal(titles.includes("Encrypted Notes, Photos & Files · PrivateNote.ai"), false);
  assert.equal(titles.includes("PrivateNote.ai - Secure Encrypted Notes"), false);
  assert.deepEqual(
    titles.filter((title, index) => titles.indexOf(title) !== index),
    [],
  );
  assert.equal(resolveDocumentMeta("/auth/sign-up", en).title, "Sign up · PrivateNote.ai");
  assert.equal(
    resolveDocumentMeta("/security-guides/messenger", en).title,
    "Secure Messaging Guide · PrivateNote.ai",
  );
  assert.equal(
    resolveDocumentMeta("/fr/contact", { ...en, ...fr }).title,
    "Contact · PrivateNote.ai",
  );
  assert.equal(
    resolveDocumentMeta("/fr/privacy", { ...en, ...fr }).title,
    "Politique de confidentialité · PrivateNote.ai",
  );
});

test("resolveDocumentMeta returns unique descriptions for reported duplicate-description URLs", () => {
  const cases = [
    ["/auth", en],
    ["/auth/sign-up", en],
    ["/how-it-works", en],
    ["/password-generator", en],
    ["/fr/password-generator", { ...en, ...fr }],
    ["/about", en],
    ["/security-guides/messenger", en],
  ] as const;
  const defaultShellDescription =
    "Send encrypted messages, photos, audio, video, and files via a one-time link that disappears after opening. Recipients don't need an account.";

  const descriptions = cases.map(([path, t]) => resolveDocumentMeta(path, t).description);
  assert.equal(descriptions.includes(defaultShellDescription), false);
  assert.deepEqual(
    descriptions.filter((description, index) => descriptions.indexOf(description) !== index),
    [],
  );
  for (const description of descriptions) {
    assert.equal(description.length >= 150, true);
    assert.equal(description.length <= 160, true);
  }
});
