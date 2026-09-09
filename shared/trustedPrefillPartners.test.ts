import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findTrustedPartner,
  resolveRevealBrandingForNoteCreate,
  revealBrandingForTrustedPartner,
  stripTrustedPartnerRevealBanner,
} from "./trustedPrefillPartners";

describe("findTrustedPartner", () => {
  it("matches passwords.lu ids case-insensitively", () => {
    assert.equal(findTrustedPartner("passwords.lu")?.displayName, "passwords.lu");
    assert.equal(findTrustedPartner("PASSWORDS.LU-CHROME")?.id, "passwords.lu-chrome");
  });

  it("rejects unknown referrers so the UI cannot be spoofed", () => {
    assert.equal(findTrustedPartner(null), null);
    assert.equal(findTrustedPartner("your-bank.example"), null);
  });
});

describe("revealBrandingForTrustedPartner", () => {
  it("uses the passwords.lu logo only (no full-page banner)", () => {
    const branding = revealBrandingForTrustedPartner("passwords.lu");
    assert.equal(branding?.logoUrl, "/images/partners/password-dots-logo.svg");
    assert.equal(branding?.companyName, "passwords.lu");
    assert.equal(branding?.bannerUrl, undefined);
    assert.equal(branding?.backgroundStyle, undefined);
  });

  it("returns nothing for an untrusted from= value", () => {
    assert.equal(revealBrandingForTrustedPartner("evil.example"), undefined);
  });
});

describe("stripTrustedPartnerRevealBanner", () => {
  it("drops the full-page banner when passwords.lu is the branded partner", () => {
    const stripped = stripTrustedPartnerRevealBanner({
      companyName: "passwords.lu",
      logoUrl: "/images/partners/password-dots-logo.svg",
      bannerUrl: "/api/auth/branding/banner/abcdefghijklmnopqrstuvwxyz012345.webp",
      backgroundStyle: "banner",
    });
    assert.equal(stripped?.companyName, "passwords.lu");
    assert.equal(stripped?.logoUrl, "/images/partners/password-dots-logo.svg");
    assert.equal(stripped?.bannerUrl, undefined);
    assert.equal(stripped?.backgroundStyle, undefined);
  });

  it("leaves a non-partner Business banner in place", () => {
    const branding = {
      companyName: "Example Law",
      bannerUrl: "/api/auth/branding/banner/abcdefghijklmnopqrstuvwxyz012345.webp",
      backgroundStyle: "banner" as const,
    };
    assert.equal(stripTrustedPartnerRevealBanner(branding), branding);
  });
});

describe("resolveRevealBrandingForNoteCreate", () => {
  it("applies logo-only partner branding when the sender has none", () => {
    const branding = resolveRevealBrandingForNoteCreate(undefined, "passwords.lu");
    assert.equal(branding?.companyName, "passwords.lu");
    assert.equal(branding?.bannerUrl, undefined);
  });

  it("strips a banner from the partner's own Business snapshot", () => {
    const branding = resolveRevealBrandingForNoteCreate(
      {
        companyName: "passwords.lu",
        logoUrl: "/images/partners/password-dots-logo.svg",
        bannerUrl: "/api/auth/branding/banner/abcdefghijklmnopqrstuvwxyz012345.webp",
        backgroundStyle: "banner",
      },
      "passwords.lu",
    );
    assert.equal(branding?.bannerUrl, undefined);
    assert.equal(branding?.backgroundStyle, undefined);
    assert.equal(branding?.logoUrl, "/images/partners/password-dots-logo.svg");
  });
});
