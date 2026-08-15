/**
 * Version attached to Stripe Checkout and subscription metadata so the
 * accepted legal text can be identified later.
 */
export const BILLING_TERMS_VERSION = "2026-08-14";

/** Registered seller: natural person, not a company. */
export const BILLING_SELLER_LEGAL_NAME = "Marjan Skrobot";

/** Luxembourg registration capacity (personne physique). */
export const BILLING_SELLER_CAPACITY = "indépendant";

export const BILLING_SELLER_ADDRESS_LINE1 = "62 Rue Marie-Adelaide";
export const BILLING_SELLER_ADDRESS_LINE2 = "2128 Luxembourg, Luxembourg";

export const BILLING_SELLER_ADDRESS = `${BILLING_SELLER_ADDRESS_LINE1}, ${BILLING_SELLER_ADDRESS_LINE2}`;

/**
 * Default Stripe invoice footer. Luxembourg invoices must state the
 * small-enterprise VAT franchise (régime de franchise, Article 57bis) —
 * VAT is not charged and cannot be deducted. Keep in sync with Terms § Taxes.
 */
export const BILLING_INVOICE_VAT_FOOTER =
  "Marjan Skrobot, indépendant. TVA non applicable – régime de franchise des petites entreprises (article 57bis de la loi modifiée du 12 février 1979).";
