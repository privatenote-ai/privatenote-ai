/**
 * Version attached to Stripe Checkout and subscription metadata so the
 * accepted legal text can be identified later.
 */
export const BILLING_TERMS_VERSION = "2026-07-30";

/**
 * Default Stripe invoice footer for Pupin Labs under the Luxembourg
 * VAT exemption regime (Article 57bis). Keep in sync with Terms § Taxes / TVA.
 */
export const BILLING_INVOICE_VAT_FOOTER =
  "TVA non applicable – Article 57bis de la loi modifiée du 12 février 1979 (Luxembourg VAT exemption regime).";
