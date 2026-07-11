import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { joinPublicPath, localizedPath, publicSitePath, blogPostPath } from "./localizedPath.ts";

describe("publicSitePath", () => {
  it("keeps locale home trailing slash", () => {
    assert.equal(publicSitePath("/"), "/");
    assert.equal(publicSitePath("/de/"), "/de/");
    assert.equal(publicSitePath("/de"), "/de/");
    assert.equal(publicSitePath("/fr/"), "/fr/");
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
  it("localizes without trailing slash except locale homes", () => {
    assert.equal(localizedPath("/about", "en"), "/about");
    assert.equal(localizedPath("/about", "de"), "/de/about");
    assert.equal(localizedPath("/", "de"), "/de/");
    assert.equal(localizedPath("/", "fr"), "/fr/");
    assert.equal(localizedPath("/about", "it"), "/it/about");
    assert.equal(localizedPath("/about", "nl"), "/nl/about");
    assert.equal(localizedPath("/developers", "de"), "/de/developers");
  });

  it("translates blog slugs per locale", () => {
    assert.equal(
      localizedPath("/blog/secrets-never-send-in-chat", "nl"),
      "/nl/blog/10-geheimen-die-nooit-in-chat-horen",
    );
    assert.equal(
      localizedPath("/blog/send-secret-message-without-account", "de"),
      "/de/blog/geheime-nachricht-ohne-konto-senden",
    );
    assert.equal(
      localizedPath("/blog/encrypted-vs-secure-file-sharing", "pt"),
      "/pt/blog/compartilhamento-criptografado-vs-seguro",
    );
    assert.equal(
      localizedPath("/blog/encrypted-vs-secure-file-sharing", "it"),
      "/it/blog/condivisione-crittografata-vs-sicura",
    );
  });

  it("joins blog paths with canonical slug helper", () => {
    assert.equal(blogPostPath("privacy-tools", "en"), "/blog/privacy-tools");
    assert.equal(blogPostPath("privacy-tools", "de"), "/de/blog/datenschutz-tools");
    assert.equal(joinPublicPath("blog", "privacy-tools"), "/blog/privacy-tools");
  });

  it("localizes secure file transfer for all locales", () => {
    assert.equal(localizedPath("/secure-file-transfer", "en"), "/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "de"), "/de/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "it"), "/it/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "pt"), "/pt/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "sr"), "/sr/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "hr"), "/hr/secure-file-transfer");
  });
});
