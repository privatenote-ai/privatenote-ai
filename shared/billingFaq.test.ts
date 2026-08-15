import assert from "node:assert/strict";
import test from "node:test";
import { BILLING_INVOICE_VAT_FOOTER } from "./billingTerms.ts";
import {
  BILLING_FAQ_IDS,
  BILLING_SUPPORT_EMAIL,
  billingFaqItem,
  billingFaqItems,
  billingFaqPath,
  buildBillingFaqSchema,
} from "./billingFaq.ts";

test("billing FAQ covers the ticket topics support asked for", () => {
  const byId = Object.fromEntries(billingFaqItems().map((item) => [item.id, item]));
  assert.deepEqual(Object.keys(byId), [...BILLING_FAQ_IDS]);

  const cancel = byId["cancel-vs-withdraw"]!.answer.toLowerCase();
  assert.match(cancel, /cancel/);
  assert.match(cancel, /withdraw/);
  assert.match(cancel, /14/);
  assert.match(cancel, /vat/);

  assert.match(byId["invoices"]!.answer, new RegExp(BILLING_INVOICE_VAT_FOOTER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(byId["vat-id"]!.answer.toLowerCase(), /tax id|vat/);
  assert.match(byId["card-fails"]!.answer.toLowerCase(), /grace/);
  assert.match(byId["paid-still-free"]!.answer.toLowerCase(), /same email/);
  assert.equal(BILLING_SUPPORT_EMAIL, "support@privatenote.ai");
});

test("buildBillingFaqSchema lists every billing FAQ answer", () => {
  const schema = buildBillingFaqSchema();
  const entities = schema.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
  assert.equal(entities.length, BILLING_FAQ_IDS.length);
  assert.equal(entities[0]?.name, billingFaqItem("cancel-vs-withdraw").question);
  assert.ok(entities.every((entity) => entity.acceptedAnswer.text.length > 80));
});

test("billingFaqPath points at the shared page anchor", () => {
  assert.equal(billingFaqPath("/premium"), "/premium#billing-faq");
  assert.equal(billingFaqPath("/contact"), "/contact#billing-faq");
});
