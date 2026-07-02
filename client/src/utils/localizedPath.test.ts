import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { joinPublicPath, localizedPath, publicSitePath } from "./localizedPath.ts";

describe("publicSitePath", () => {
  it("keeps locale home as slash only", () => {
    assert.equal(publicSitePath("/"), "/");
    assert.equal(publicSitePath("/de/"), "/de");
  });

  it("uses no trailing slash for marketing pages", () => {
    assert.equal(publicSitePath("/about"), "/about");
    assert.equal(publicSitePath("/blog/myth-good-enough-security"), "/blog/myth-good-enough-security");
  });

  it("does not slash app routes", () => {
    assert.equal(publicSitePath("/auth/sign-in"), "/auth/sign-in");
    assert.equal(publicSitePath("/note/abc"), "/note/abc");
  });
});

describe("localizedPath", () => {
  it("localizes without trailing slash", () => {
    assert.equal(localizedPath("/about", "en"), "/about");
    assert.equal(localizedPath("/about", "de"), "/de/about");
    assert.equal(localizedPath("/about", "it"), "/it/about");
    assert.equal(localizedPath("/about", "nl"), "/nl/about");
    assert.equal(localizedPath("/developers", "de"), "/de/developers");
  });

  it("joins blog paths", () => {
    assert.equal(joinPublicPath("blog", "privacy-tools"), "/blog/privacy-tools");
    assert.equal(
      localizedPath("/blog/how-we-generate-passwords", "de"),
      "/de/blog/how-we-generate-passwords",
    );
    assert.equal(
      localizedPath("/blog/encrypted-vs-secure-file-sharing", "it"),
      "/it/blog/encrypted-vs-secure-file-sharing",
    );
  });

  it("localizes secure file transfer", () => {
    assert.equal(localizedPath("/secure-file-transfer", "en"), "/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "de"), "/de/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "it"), "/it/secure-file-transfer");
  });
});
