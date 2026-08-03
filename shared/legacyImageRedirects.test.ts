import assert from "node:assert/strict";
import test from "node:test";
import { LEGACY_IMAGE_REDIRECTS, resolveLegacyImageRedirect } from "./legacyImageRedirects.ts";

test("resolveLegacyImageRedirect maps retired PNG heroes to JPEG", () => {
  assert.equal(
    resolveLegacyImageRedirect("/images/blog-chat-control-is-back-hero.png"),
    "/images/blog-chat-control-is-back-hero.jpg",
  );
  assert.equal(
    resolveLegacyImageRedirect("/images/blog-secret-message-no-account-hero.png"),
    "/images/blog-secret-message-no-account-hero.jpg",
  );
  assert.equal(resolveLegacyImageRedirect("/images/blog-email-secrets-hero.jpg"), null);
});

test("LEGACY_IMAGE_REDIRECTS targets only known retired assets", () => {
  assert.equal(Object.keys(LEGACY_IMAGE_REDIRECTS).length, 2);
});
