/**
 * Trusted prefill partners.
 *
 * Only partners listed here will have their name shown in the prefill banner.
 * Anyone can pass `&from=anything` in the URL — but if the value does not
 * match an entry in this list the banner shows a generic "external website"
 * message, preventing UI spoofing attacks (e.g. &from=Your+Bank+IT+Dept).
 *
 * To add a new partner: append an entry to TRUSTED_PREFILL_PARTNERS.
 * The `id` is matched case-insensitively against the sanitized `&from=` value.
 */

import { parseStoredRevealBranding, type RevealBranding } from "./businessBranding";

/** Optional visual identity (allowlisted partners only). */
export interface TrustedPartnerBranding {
  /** Path under `client/public`, e.g. `/images/partners/password-dots-logo.svg` */
  logoSrc: string;
  logoAlt: string;
}

export interface TrustedPartner {
  /** Exact id to match (case-insensitive). Should be the partner's domain. */
  id: string;
  /** Display name shown in the banner and stored in analytics. */
  displayName: string;
  /** Partner mark shown on the create-note notice and recipient reveal page. */
  branding?: TrustedPartnerBranding;
}

const PASSWORDS_LU_BRANDING: TrustedPartnerBranding = {
  logoSrc: "/images/partners/password-dots-logo.svg",
  logoAlt: "passwords.lu",
};

export const TRUSTED_PREFILL_PARTNERS: readonly TrustedPartner[] = [
  {
    id: "passwords.lu",
    displayName: "passwords.lu",
    branding: PASSWORDS_LU_BRANDING,
  },
  {
    id: "passwords.lu-chrome",
    displayName: "passwords.lu",
    branding: PASSWORDS_LU_BRANDING,
  },
];

/**
 * Returns the matching trusted partner entry, or null if the referrer is
 * absent or not on the allowlist.
 */
export function findTrustedPartner(referrer: string | null): TrustedPartner | null {
  if (!referrer) return null;
  const lower = referrer.toLowerCase().trim();
  return TRUSTED_PREFILL_PARTNERS.find((p) => p.id.toLowerCase() === lower) ?? null;
}

/**
 * Recipient-page branding for a trusted prefill partner. Logo and company name
 * only — never a full-page banner. Paths are re-validated by
 * `parseStoredRevealBranding` so a config typo cannot smuggle an unsafe URL.
 */
export function revealBrandingForTrustedPartner(
  referrer: string | null,
): RevealBranding | undefined {
  const partner = findTrustedPartner(referrer);
  if (!partner?.branding?.logoSrc) return undefined;
  return parseStoredRevealBranding({
    companyName: partner.displayName,
    logoUrl: partner.branding.logoSrc,
  });
}

function isTrustedPartnerRevealBranding(
  branding: RevealBranding | undefined,
): boolean {
  if (!branding) return false;
  const name = branding.companyName?.toLowerCase().trim();
  const logo = branding.logoUrl;
  return TRUSTED_PREFILL_PARTNERS.some((partner) => {
    if (name && partner.displayName.toLowerCase() === name) return true;
    if (logo && partner.branding?.logoSrc === logo) return true;
    return false;
  });
}

/**
 * Partner identity on the reveal page is the mark and name, not a full-page
 * photograph. Strips banner fields even when the partner's own Business
 * account has one configured.
 */
export function stripTrustedPartnerRevealBanner(
  branding: RevealBranding | undefined,
): RevealBranding | undefined {
  if (!branding) return undefined;
  if (!isTrustedPartnerRevealBranding(branding)) return branding;
  if (!branding.bannerUrl && branding.backgroundStyle !== "banner") return branding;
  const next: RevealBranding = { ...branding };
  delete next.bannerUrl;
  if (next.backgroundStyle === "banner") delete next.backgroundStyle;
  return next;
}

/**
 * Note-create snapshot: keep the sender's Business branding when present,
 * otherwise apply allowlisted partner identity from `from=`. Partner pages
 * never store a full-page banner.
 */
export function resolveRevealBrandingForNoteCreate(
  accountOrClientBranding: RevealBranding | undefined,
  referrer: string | null,
): RevealBranding | undefined {
  const branding =
    accountOrClientBranding ?? revealBrandingForTrustedPartner(referrer);
  return stripTrustedPartnerRevealBanner(branding);
}
