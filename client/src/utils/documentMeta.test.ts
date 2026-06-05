import assert from "node:assert/strict";
import test from "node:test";
import { isNoindexPath } from "./documentMeta.ts";

test("isNoindexPath marks private app routes", () => {
  assert.equal(isNoindexPath("/auth/sign-in"), true);
  assert.equal(isNoindexPath("/magic"), true);
  assert.equal(isNoindexPath("/account"), true);
  assert.equal(isNoindexPath("/note/abc"), true);
  assert.equal(isNoindexPath("/admin/blog"), true);
});

test("isNoindexPath allows public marketing and locale routes", () => {
  assert.equal(isNoindexPath("/"), false);
  assert.equal(isNoindexPath("/de/"), false);
  assert.equal(isNoindexPath("/de"), false);
  assert.equal(isNoindexPath("/fr/about/"), false);
  assert.equal(isNoindexPath("/es/blog/privacy-tools"), false);
});
