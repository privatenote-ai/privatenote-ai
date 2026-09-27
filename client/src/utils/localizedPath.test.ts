import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { joinPublicPath, localizedPath, publicSitePath, blogPostPath, blogCategoryPath, switchLanguagePath } from "./localizedPath.ts";

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

  it("localizes one-time link for all locales", () => {
    assert.equal(localizedPath("/one-time-link", "en"), "/one-time-link");
    assert.equal(localizedPath("/one-time-link", "de"), "/de/one-time-link");
    assert.equal(localizedPath("/one-time-link", "es"), "/es/one-time-link");
    assert.equal(localizedPath("/one-time-link", "nl"), "/nl/one-time-link");
    assert.equal(localizedPath("/one-time-link", "fr"), "/fr/one-time-link");
    assert.equal(localizedPath("/one-time-link", "it"), "/it/one-time-link");
    assert.equal(localizedPath("/one-time-link", "pt"), "/pt/one-time-link");
    assert.equal(localizedPath("/one-time-link", "hr"), "/hr/one-time-link");
    assert.equal(localizedPath("/one-time-link", "sr"), "/sr/one-time-link");
    assert.equal(localizedPath("/one-time-link", "tr"), "/tr/one-time-link");
    assert.equal(localizedPath("/one-time-link", "pl"), "/pl/one-time-link");
    assert.equal(switchLanguagePath("/de/one-time-link", "en"), "/one-time-link");
    assert.equal(switchLanguagePath("/one-time-link", "fr"), "/fr/one-time-link");
  });

  it("localizes privnote alternative for all locales", () => {
    assert.equal(localizedPath("/privnote-alternative", "en"), "/privnote-alternative");
    assert.equal(localizedPath("/privnote-alternative", "de"), "/de/privnote-alternative");
    assert.equal(localizedPath("/privnote-alternative", "fr"), "/fr/privnote-alternative");
    assert.equal(localizedPath("/privnote-alternative", "es"), "/es/privnote-alternative");
    assert.equal(localizedPath("/privnote-alternative", "it"), "/it/privnote-alternative");
    assert.equal(switchLanguagePath("/privnote-alternative", "de"), "/de/privnote-alternative");
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

  it("localizes blog category landing paths", () => {
    assert.equal(blogCategoryPath("secrets", "en"), "/blog/category/secrets");
    assert.equal(blogCategoryPath("encryption", "de"), "/de/blog/category/encryption");
    assert.equal(switchLanguagePath("/blog/category/ai", "fr"), "/fr/blog/category/ai");
    assert.equal(localizedPath("/blog/category/privacy", "nl"), "/nl/blog/category/privacy");
  });

  it("localizes secure file transfer for all locales", () => {
    assert.equal(localizedPath("/secure-file-transfer", "en"), "/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "de"), "/de/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "it"), "/it/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "pt"), "/pt/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "sr"), "/sr/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "hr"), "/hr/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "tr"), "/tr/secure-file-transfer");
    assert.equal(localizedPath("/secure-file-transfer", "pl"), "/pl/secure-file-transfer");
  });

  it("localizes the pricing page for all locales", () => {
    assert.equal(localizedPath("/premium", "en"), "/premium");
    assert.equal(localizedPath("/premium", "de"), "/de/premium");
    assert.equal(localizedPath("/premium", "fr"), "/fr/premium");
    assert.equal(localizedPath("/premium", "es"), "/es/premium");
  });

  it("keeps reveal note URLs on /note/:id when switching language", () => {
    assert.equal(switchLanguagePath("/note/abc123", "de"), "/note/abc123");
    assert.equal(switchLanguagePath("/de/note/abc123", "fr"), "/note/abc123");
    assert.equal(localizedPath("/note/abc123", "de"), "/note/abc123");
  });

  it("localizes vpn and password security guides", () => {
    assert.equal(localizedPath("/security-guides/vpn", "en"), "/security-guides/vpn");
    assert.equal(localizedPath("/security-guides/vpn", "de"), "/de/security-guides/vpn");
    assert.equal(localizedPath("/security-guides/password", "fr"), "/fr/security-guides/password");
    assert.equal(localizedPath("/security-guides/messenger", "de"), "/security-guides/messenger");
  });
});
