import { BILLING_INVOICE_VAT_FOOTER, BILLING_SELLER_ADDRESS, BILLING_SELLER_LEGAL_NAME } from "./billingTerms";

export const BILLING_SUPPORT_EMAIL = "support@privatenote.ai";
export const BILLING_FAQ_ANCHOR = "billing-faq";

export const BILLING_FAQ_IDS = [
  "cancel-vs-withdraw",
  "how-to-cancel",
  "how-to-withdraw",
  "invoices",
  "vat-id",
  "card-fails",
  "paid-still-free",
  "upgrade-downgrade",
  "notes-after-cancel",
] as const;

export type BillingFaqId = (typeof BILLING_FAQ_IDS)[number];

export type BillingFaqLink = {
  href: string;
  label: string;
};

export type BillingFaqItem = {
  id: BillingFaqId;
  question: string;
  /** Plain-text answer for JSON-LD, emails, and support macros. */
  answer: string;
  links: BillingFaqLink[];
};

function paragraphs(...parts: string[]): string {
  return parts.join("\n\n");
}

export function billingFaqItems(): BillingFaqItem[] {
  return [
    {
      id: "cancel-vs-withdraw",
      question: "What is the difference between cancelling and withdrawing?",
      answer: paragraphs(
        "They are two different actions. Cancelling stops the next charge. Withdrawing is a legal right for some EU/EEA consumers and can involve a refund.",
        "Cancel: use Account → Cancel subscription (or Manage billing). Cancellation takes effect at the end of the period you already paid for. You keep Starter or Business until then. That unused time is not refunded. Renewals after the first period follow this rule too.",
        "Withdraw: if you are an EU/EEA consumer, you have 14 calendar days from the start of a paid subscription to withdraw. Because checkout asks us to start access immediately, a withdrawal refund is what you paid minus the proportionate amount for days already used. Access ends when we process the withdrawal — you do not keep the rest of the paid period and a refund. Write to support@privatenote.ai. This right attaches to entering the contract, not to each later renewal.",
        "If you entered a VAT / tax ID at checkout, we treat the purchase as a business purchase. Business customers do not have the statutory 14-day consumer withdrawal right. Ordinary cancellation still works.",
      ),
      links: [
        { href: "/account", label: "Account" },
        { href: "/terms", label: "Terms — cancellation and withdrawal" },
        { href: `mailto:${BILLING_SUPPORT_EMAIL}`, label: BILLING_SUPPORT_EMAIL },
      ],
    },
    {
      id: "how-to-cancel",
      question: "How do I cancel so I am not charged again?",
      answer: paragraphs(
        "Sign in, open Account, then Cancel subscription. That opens Stripe’s billing portal on the cancel flow. You can also choose Manage billing and cancel from there.",
        "You will keep paid features until the date shown as “access continues until…”. Nothing further is charged. You can reverse the cancellation in the portal before that date, or start a new plan from Pricing after it ends.",
        "Deleting your account also cancels the subscription. Time left in the current period is not refunded.",
        "There is no self-serve refund for ordinary cancellation. If the portal will not open, email support@privatenote.ai from the address on the account.",
      ),
      links: [
        { href: "/account", label: "Account — cancel or manage billing" },
        { href: "/premium", label: "Pricing" },
      ],
    },
    {
      id: "how-to-withdraw",
      question: "How do EU consumers withdraw within 14 days?",
      answer: paragraphs(
        "Email support@privatenote.ai from the address on your account before the 14th calendar day after the paid subscription started. Say clearly that you withdraw. A model notice is on the Terms page. You do not have to give a reason.",
        "We refund the unused portion to the original payment method, usually within 14 days of receiving the notice. Banks often take another 5–10 business days to show the credit. The subscription is cancelled immediately, and the account returns to Free. Notes you already created keep the conditions under which they were created.",
        "Withdrawal does not apply to a later renewal charge, to customers acting for a trade or business, or after the 14-day window. Those cases are ordinary cancellation (no refund) unless we agree a goodwill refund in writing.",
      ),
      links: [
        { href: "/terms", label: "Terms — model withdrawal notice" },
        { href: `mailto:${BILLING_SUPPORT_EMAIL}`, label: BILLING_SUPPORT_EMAIL },
      ],
    },
    {
      id: "invoices",
      question: "Where do I get invoices and receipts?",
      answer: paragraphs(
        "Stripe emails a receipt to the address used at checkout after each successful payment. The same documents live in the billing portal: Account → Manage billing → invoices.",
        `Invoices are issued by ${BILLING_SELLER_LEGAL_NAME}, indépendant, ${BILLING_SELLER_ADDRESS}. PrivateNote.ai is the product name. They include the billing name and address collected at checkout, any tax ID you supplied, and this VAT note:`,
        BILLING_INVOICE_VAT_FOOTER,
        "We do not currently add VAT on top of the plan price. The total shown at Stripe Checkout is the amount charged. If you need a copy and cannot open the portal, email support@privatenote.ai with the account email and the charge date.",
      ),
      links: [
        { href: "/account", label: "Account — Manage billing" },
        { href: `mailto:${BILLING_SUPPORT_EMAIL}`, label: BILLING_SUPPORT_EMAIL },
      ],
    },
    {
      id: "vat-id",
      question: "Can I add a VAT ID or company name?",
      answer: paragraphs(
        "Yes. Checkout requires a billing address and lets you add a VAT / tax ID. Use your legal business name and the number as issued (for example an EU VAT ID). Those details are stored on the Stripe customer and printed on invoices.",
        "Adding a VAT ID does not change the price today: we do not charge VAT under Luxembourg’s small-enterprise franchise scheme (régime de franchise, Article 57bis), so there is no reverse-charge deduction to apply. Supplying a tax ID also does not by itself create an exemption or reverse-charge treatment if tax collection starts later.",
        "You can update name, address, and tax ID later in Account → Manage billing. If the portal cannot change a tax ID, email support@privatenote.ai with the account email and the ID to add.",
        "A VAT ID is the signal we use that you purchased as a business. Consumer withdrawal (14 days) is for natural persons not acting for a trade or business.",
      ),
      links: [
        { href: "/account", label: "Account — Manage billing" },
        { href: "/terms", label: "Terms — taxes and VAT" },
      ],
    },
    {
      id: "card-fails",
      question: "What happens if a card payment fails?",
      answer: paragraphs(
        "The first checkout payment must succeed before the plan starts. If it fails at Stripe Checkout, you are not charged and the account stays on Free — try another card or contact your bank (including 3-D Secure).",
        "If a later renewal fails, we email you and keep paid features for a grace period of at least three days while Stripe retries. A second email is sent shortly before that grace period ends. Update the card from Account → Manage billing. Paid access continues if the retry succeeds.",
        "If payment still fails after grace, the account returns to Free. Notes you already created keep the conditions under which they were created; Starter and Business controls for new notes lock until you resubscribe. Failed renewals are not refunds and do not start a withdrawal clock.",
      ),
      links: [{ href: "/account", label: "Account — update payment method" }],
    },
    {
      id: "paid-still-free",
      question: "I paid but I still see Free. What should I check?",
      answer: paragraphs(
        "Paid status is tied to the signed-in PrivateNote account that started Checkout — not to the card alone. Work through this list before writing in:",
        "1. Sign in with the same email you used at checkout, then open Account (not a logged-out Pricing page). After a successful payment Stripe returns you to Account with billing=success; the app refreshes entitlements for several seconds. Wait, then reload once.",
        "2. Confirm the Stripe receipt in that same inbox. If there is no receipt, the charge did not complete (abandoned checkout, failed 3-D Secure, or a bank decline).",
        "3. Check you are not in a different browser profile, private window, or a second PrivateNote account.",
        "4. If Account shows a billing status such as past_due or unpaid, the first charge may have succeeded and a later retry failed — update the card under Manage billing.",
        "5. If the receipt is there and Account still says Free after a minute, email support@privatenote.ai from the account address. Include the charge date, amount and currency, last four digits of the card if you have them, and the Stripe receipt or invoice number. Do not send card numbers, CVC, or note encryption keys.",
      ),
      links: [
        { href: "/account", label: "Account" },
        { href: "/premium", label: "Pricing" },
        { href: `mailto:${BILLING_SUPPORT_EMAIL}`, label: BILLING_SUPPORT_EMAIL },
      ],
    },
    {
      id: "upgrade-downgrade",
      question: "How do upgrades, downgrades, and annual billing work?",
      answer: paragraphs(
        "Change plan or interval from Pricing while signed in, or from Account → Manage billing. An existing subscription is updated in the Stripe portal rather than starting a second checkout.",
        "Upgrades start immediately. Stripe charges the difference for the rest of the current period and credits the unused part of the previous plan. The renewal date does not change.",
        "Downgrades take effect at the end of the current period, so you keep the higher plan until then. Existing notes keep the conditions under which they were created; new notes follow the plan in force when you create them.",
        "Annual plans are charged once per year (two months free versus monthly). Stripe charges USD or EUR from your region; the charge currency is confirmed at Checkout. Prices may change from the next renewal; we email before that takes effect.",
      ),
      links: [
        { href: "/premium", label: "Pricing" },
        { href: "/account", label: "Account" },
      ],
    },
    {
      id: "notes-after-cancel",
      question: "What happens to my notes if I cancel, withdraw, or the card fails?",
      answer: paragraphs(
        "Note plaintext stays encrypted in the browser before upload on every plan. Changing billing does not give PrivateNote access to message content.",
        "Notes already created keep the expiry, open limits, password, attachments, and other conditions from when they were created. Recipients can still open a valid link until the note burns or expires.",
        "After paid access ends (end of a cancelled period, a processed withdrawal, or a failed renewal after grace), Starter and Business controls for new notes — proof of access, recipient verification, branding, higher limits — are locked until you subscribe again. The Free plan remains available.",
      ),
      links: [
        { href: "/how-it-works", label: "How encryption works" },
        { href: "/premium", label: "Plan comparison" },
      ],
    },
  ];
}

export function billingFaqItem(id: BillingFaqId): BillingFaqItem {
  const item = billingFaqItems().find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown billing FAQ id: ${id}`);
  return item;
}

export function buildBillingFaqSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: billingFaqItems().map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function billingFaqPath(path: string): string {
  return `${path}#${BILLING_FAQ_ANCHOR}`;
}
