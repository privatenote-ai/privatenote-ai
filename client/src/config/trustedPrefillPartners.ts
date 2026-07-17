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

/** Optional visual identity for the prefill banner (allowlisted partners only). */
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
  /** Rams-themed banner + logo when set (passwords.lu uses dot-grid mark). */
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
