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
