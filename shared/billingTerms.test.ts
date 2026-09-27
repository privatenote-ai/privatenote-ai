import assert from "node:assert/strict";
import test from "node:test";
import {
  BILLING_INVOICE_VAT_FOOTER,
  BILLING_SELLER_CAPACITY,
  BILLING_SELLER_LEGAL_NAME,
} from "./billingTerms.ts";

test("invoice VAT footer names the independent seller and the franchise regime", () => {
  assert.match(BILLING_INVOICE_VAT_FOOTER, new RegExp(BILLING_SELLER_LEGAL_NAME));
  assert.match(BILLING_INVOICE_VAT_FOOTER, new RegExp(BILLING_SELLER_CAPACITY));
  assert.match(BILLING_INVOICE_VAT_FOOTER, /régime de franchise/i);
  assert.match(BILLING_INVOICE_VAT_FOOTER, /article 57bis/i);
  assert.match(BILLING_INVOICE_VAT_FOOTER, /TVA non applicable/);
  assert.doesNotMatch(BILLING_INVOICE_VAT_FOOTER, /Pupin Labs/);
});
