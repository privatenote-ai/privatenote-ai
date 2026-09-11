import type { BillingCurrency } from "./planCatalog";

/**
 * Countries shown EUR pricing. This covers geographic Europe rather than only
 * Eurozone members, matching the product decision to offer one European price.
 */
const EUROPE_COUNTRY_CODES = new Set([
  "AD", "AL", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CY", "CZ",
  "DE", "DK", "EE", "ES", "FI", "FO", "FR", "GB", "GG", "GI", "GR",
  "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI", "LT", "LU", "LV",
  "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS",
  "SE", "SI", "SK", "SM", "TR", "UA", "VA", "XK",
]);

export function normalizeBillingCountry(
  value: string | null | undefined,
): string | null {
  const country = value?.trim().toUpperCase() ?? "";
  return /^[A-Z]{2}$/.test(country) ? country : null;
}

export function billingCurrencyForCountry(
  country: string | null | undefined,
): BillingCurrency {
  const normalized = normalizeBillingCountry(country);
  return normalized && EUROPE_COUNTRY_CODES.has(normalized) ? "eur" : "usd";
}

/** ISO 3166-1 alpha-2 region from a BCP 47 tag (e.g. `en-GB` → `GB`). */
export function regionFromLocaleTag(tag: string | null | undefined): string | null {
  const parts = (tag ?? "").trim().replace(/_/g, "-").split("-").filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    // Skip 4-letter script subtags (Hans, Latn); keep 2-letter regions.
    if (/^[A-Za-z]{2}$/.test(part)) return part.toUpperCase();
  }
  return null;
}

/** European UI languages that imply EUR when no region/timezone signal exists. */
const EUROPE_UI_LANGUAGES = new Set(["de", "fr", "es", "it", "nl", "hr", "sr", "tr"]);

/**
 * Best-effort display currency for marketing/pricing UI before checkout.
 * Prefers browser locale region, then Europe/* timezone, then UI language.
 * Checkout still resolves currency from the Cloudflare edge country.
 */
export function billingCurrencyFromBrowser(
  uiLanguage?: string | null,
  options?: {
    languages?: readonly string[] | null;
    timeZone?: string | null;
  },
): BillingCurrency {
  const languages =
    options?.languages ??
    (typeof navigator !== "undefined"
      ? [...(navigator.languages ?? []), navigator.language]
      : []);
  for (const tag of languages) {
    const region = regionFromLocaleTag(tag);
    if (region) return billingCurrencyForCountry(region);
  }

  const timeZone =
    options?.timeZone ??
    (typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : null);
  if (typeof timeZone === "string" && timeZone.startsWith("Europe/")) {
    return "eur";
  }

  const lang = (uiLanguage ?? "").trim().toLowerCase();
  if (EUROPE_UI_LANGUAGES.has(lang)) return "eur";
  return "usd";
}

type RequestWithCloudflareCountry = Request & {
  cf?: { country?: unknown };
};

/**
 * Cloudflare derives `request.cf.country` from the connection IP. The custom
 * header is set by our Pages proxy because a subrequest to the API Worker does
 * not reliably retain the original request.cf object.
 */
export function billingCountryFromRequest(request: Request): string | null {
  const cloudflareCountry = (request as RequestWithCloudflareCountry).cf?.country;
  const direct = normalizeBillingCountry(
    typeof cloudflareCountry === "string" ? cloudflareCountry : null,
  );
  if (direct) return direct;
  return normalizeBillingCountry(
    request.headers.get("X-PrivateNote-IP-Country"),
  );
}
