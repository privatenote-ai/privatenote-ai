import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  billingCountryFromRequest,
  billingCurrencyForCountry,
  billingCurrencyFromBrowser,
  normalizeBillingCountry,
  regionFromLocaleTag,
} from "./billingRegion";

describe("billing region", () => {
  it("uses EUR for European countries and USD elsewhere", () => {
    for (const country of ["LU", "DE", "FR", "GB", "CH", "NO", "UA"]) {
      assert.equal(billingCurrencyForCountry(country), "eur");
    }
    for (const country of ["US", "CA", "AU", "JP", null]) {
      assert.equal(billingCurrencyForCountry(country), "usd");
    }
  });

  it("normalizes only ISO-style country codes", () => {
    assert.equal(normalizeBillingCountry(" lu "), "LU");
    assert.equal(normalizeBillingCountry("Europe"), null);
    assert.equal(normalizeBillingCountry("1"), null);
  });

  it("reads the country forwarded by the Pages edge", () => {
    const request = new Request("https://api.example.test", {
      headers: { "X-PrivateNote-IP-Country": "de" },
    });
    assert.equal(billingCountryFromRequest(request), "DE");
  });

  it("prefers the direct Cloudflare country signal", () => {
    const request = new Request("https://api.example.test", {
      headers: { "X-PrivateNote-IP-Country": "US" },
    }) as Request & { cf?: { country?: string } };
    request.cf = { country: "LU" };
    assert.equal(billingCountryFromRequest(request), "LU");
  });

  it("parses region subtags from locale tags", () => {
    assert.equal(regionFromLocaleTag("en-GB"), "GB");
    assert.equal(regionFromLocaleTag("de_AT"), "AT");
    assert.equal(regionFromLocaleTag("zh-Hans-CN"), "CN");
    assert.equal(regionFromLocaleTag("fr"), null);
  });

  it("guesses display currency from browser signals", () => {
    assert.equal(
      billingCurrencyFromBrowser("en", {
        languages: ["en-US"],
        timeZone: "America/New_York",
      }),
      "usd",
    );
    assert.equal(
      billingCurrencyFromBrowser("en", {
        languages: ["en-GB"],
        timeZone: "Europe/London",
      }),
      "eur",
    );
    assert.equal(
      billingCurrencyFromBrowser("de", {
        languages: ["de"],
        timeZone: "America/New_York",
      }),
      "eur",
    );
    assert.equal(
      billingCurrencyFromBrowser("en", {
        languages: ["en"],
        timeZone: "Europe/Berlin",
      }),
      "eur",
    );
    assert.equal(
      billingCurrencyFromBrowser("en", {
        languages: ["en"],
        timeZone: "America/Chicago",
      }),
      "usd",
    );
  });
});
