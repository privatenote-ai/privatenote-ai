import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

type BillingMode = "monthly" | "yearly";
type PlanId = "free" | "premium";

const stripePaymentLinks: Record<BillingMode, string> = {
  monthly: (import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PAYMENT_LINK as string | undefined)?.trim() || "",
  yearly: (import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PAYMENT_LINK as string | undefined)?.trim() || "",
};
const stripePrefilledPromoCode =
  (import.meta.env.VITE_STRIPE_PREMIUM_PREFILLED_PROMO_CODE as string | undefined)?.trim() || "";
const earlyAdopterPricingEnabled =
  (import.meta.env.VITE_PREMIUM_EARLY_ADOPTER_PRICING_ENABLED as string | undefined)?.trim().toLowerCase() !== "false";
const earlyAdopterUserLimit = Number.parseInt(
  (import.meta.env.VITE_PREMIUM_EARLY_ADOPTER_USER_LIMIT as string | undefined)?.trim() || "200",
  10,
);

function withStripePromoCode(href: string): string {
  if (!stripePrefilledPromoCode || !/^https?:\/\//i.test(href)) return href;

  const url = new URL(href);
  url.searchParams.set("prefilled_promo_code", stripePrefilledPromoCode);
  return url.toString();
}

const planOrder: PlanId[] = ["free", "premium"];

const planCopy: Record<PlanId, {
  title: string;
  audience: string;
  cta: string;
  highlight?: string;
  features: string[];
}> = {
  free: {
    title: "Free",
    audience: "Core PrivateNote.",
    cta: "Start free",
    features: [
      "Encrypted secure notes",
      "Burn after reading",
      "Password protection",
      "Basic expiry controls",
    ],
  },
  premium: {
    title: "Premium",
    audience: "Delivery controls for notes that need proof, verification, and a branded reveal experience.",
    cta: "Upgrade to Premium",
    highlight: "Recommended",
    features: [
      "Notifications",
      "Recipient verification",
      "Branding",
      "100 MB encrypted file sharing",
    ],
  },
};

const premiumPrices: Record<BillingMode, { price: string; cadence: string; note: string }> = {
  monthly: {
    price: "€3.99",
    cadence: "per month",
    note: "Monthly access for premium delivery controls.",
  },
  yearly: {
    price: "€39",
    cadence: "per year",
    note: "Best value for ongoing secure note delivery.",
  },
};

const featureCards = [
  {
    icon: Bell,
    title: "Notifications",
    text: "Know when a note is opened or destroyed.",
  },
  {
    icon: MailCheck,
    title: "Recipient verification",
    text: "Restrict access to the intended recipient.",
  },
  {
    icon: ShieldCheck,
    title: "Branding",
    text: "Add a branded reveal page for a more trusted recipient experience.",
  },
  {
    icon: Sparkles,
    title: "Encrypted file sharing",
    text: "Attach browser-encrypted files up to 100 MB on Premium.",
  },
];

const comparisonSections = [
  {
    title: "Core",
    rows: [
      ["Encrypted secure notes", "Included", "Included"],
      ["Burn after reading", "Included", "Included"],
      ["Password protection", "Included", "Included"],
      ["Basic expiry controls", "Included", "Included"],
    ],
  },
  {
    title: "Delivery and verification",
    rows: [
      ["Open and destroy notifications", "No", "Included"],
      ["Recipient verification", "No", "Included"],
      ["Custom branding", "No", "Included"],
      ["Encrypted file sharing", "Up to 10 MB", "Up to 100 MB"],
    ],
  },
];

const faqs = [
  {
    q: "Does Premium make notes more encrypted?",
    a: "No. The encryption promise is the same across plans: note plaintext is encrypted in your browser before upload. Premium adds delivery controls and workflow features.",
  },
  {
    q: "What is included in Premium?",
    a: "Premium includes notifications, recipient verification, branding, and encrypted file sharing up to 100 MB.",
  },
  {
    q: "Can I pay online today?",
    a: "Yes, once the Stripe Payment Link environment variables are set. Until then the Premium button falls back to the contact page for staging, early access, or manual enablement.",
  },
  {
    q: "Can I use a discount code?",
    a: "Yes, when promotion codes are enabled on the Stripe Payment Link. Stripe shows the code field during checkout, and the app can optionally prefill a public promo code for testing.",
  },
  {
    q: "When should I use recipient verification?",
    a: "Use it when the link alone is not enough assurance, such as client credentials, vendor onboarding, or any note that should only be revealed by a specific recipient.",
  },
  {
    q: "How are files encrypted?",
    a: "Files are encrypted in the browser with the Web Crypto API using AES-GCM-256 before upload. PrivateNote stores only encrypted file bytes.",
  },
];

function PlanCard({
  plan,
  billingMode,
  href,
}: {
  plan: PlanId;
  billingMode: BillingMode;
  href: string;
}) {
  const copy = planCopy[plan];
  const highlighted = plan === "premium";
  const price = plan === "free" ? { price: "€0", cadence: "forever", note: "No payment required." } : premiumPrices[billingMode];
  const buttonClassName = [
    "mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40",
    highlighted
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
  ].join(" ");
  const externalHref = /^https?:\/\//i.test(href);

  return (
    <article
      className={[
        "relative flex min-w-0 flex-col rounded-xl border bg-white p-5 dark:bg-gray-950",
        highlighted
          ? "border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/10"
          : "border-gray-200 dark:border-gray-800",
      ].join(" ")}
    >
      {copy.highlight ? (
        <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          {copy.highlight}
        </div>
      ) : null}
      <h2 className="pr-28 text-xl font-semibold text-gray-950 dark:text-white">{copy.title}</h2>
      <p className="mt-2 min-h-[3rem] text-sm leading-6 text-gray-600 dark:text-gray-400">
        {copy.audience}
      </p>
      <div className="mt-5 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {price.price}
        </span>
        <span className="pb-1 text-sm text-gray-500 dark:text-gray-400">
          {price.cadence}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{price.note}</p>
      {externalHref ? (
        <a href={href} className={buttonClassName} rel="noopener noreferrer">
          {copy.cta}
        </a>
      ) : (
        <Link href={href} className={buttonClassName}>
          {copy.cta}
        </Link>
      )}
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Includes
      </p>
      <ul className="mt-3 space-y-2.5">
        {copy.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FeatureValue({ value }: { value: string }) {
  const yes = value === "Yes" || value === "Included";
  const no = value === "No";
  return (
    <span
      className={[
        "inline-flex min-h-6 items-center text-sm",
        no ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300",
      ].join(" ")}
    >
      {yes ? <Check className="mr-1.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden /> : null}
      {value}
    </span>
  );
}

export default function Premium() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [billingMode, setBillingMode] = useState<BillingMode>("yearly");
  const lp = (path: string) => localizedPath(path, language);
  const accountHref = user ? "/account" : "/auth/sign-up";
  const premiumCheckoutHref = stripePaymentLinks[billingMode]
    ? withStripePromoCode(stripePaymentLinks[billingMode])
    : lp("/contact");
  const planHref = useMemo(
    () => ({ free: accountHref, premium: premiumCheckoutHref }),
    [accountHref, premiumCheckoutHref]
  );

  return (
    <MarketingDocShell className="mx-auto max-w-7xl">
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Simple plans for secure notes.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          Free gives you Core PrivateNote. Premium adds delivery controls for notifications,
          recipient verification, branding, and 100 MB encrypted file sharing.
        </p>
        {earlyAdopterPricingEnabled ? (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-left shadow-sm dark:border-amber-900/70 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
              Early adopter pricing.
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900/85 dark:text-amber-100/80">
              Existing subscribers keep this price forever. Limited to the first{" "}
              {Number.isFinite(earlyAdopterUserLimit) && earlyAdopterUserLimit > 0
                ? earlyAdopterUserLimit
                : 200}{" "}
              Premium users.
            </p>
          </div>
        ) : null}
        <div className="mt-7 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          {(["monthly", "yearly"] as BillingMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBillingMode(mode)}
              className={[
                "rounded-md px-4 py-2 text-sm font-semibold capitalize transition",
                billingMode === mode
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white",
              ].join(" ")}
            >
              Pay {mode}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Premium is €3.99 monthly or €39 yearly.
          {stripePaymentLinks[billingMode] ? " Secure checkout opens via Stripe." : " Add the Stripe link env vars to enable checkout."}
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        {planOrder.map((plan) => (
          <PlanCard key={plan} plan={plan} billingMode={billingMode} href={planHref[plan]} />
        ))}
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featureCards.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <Icon className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-4 text-sm font-semibold text-gray-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
              Plans and features
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Compare Core PrivateNote with the Premium delivery controls.
            </p>
          </div>
          <Link href={lp("/contact")} className="text-sm font-semibold text-primary hover:underline">
            Request early access
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[minmax(180px,1.4fr)_repeat(2,minmax(120px,1fr))] border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
              <div className="px-4 py-3">Feature</div>
              <div className="px-4 py-3">Free</div>
              <div className="px-4 py-3">Premium</div>
            </div>
            {comparisonSections.map((section) => (
              <div key={section.title}>
                <div className="border-b border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white">
                  {section.title}
                </div>
                {section.rows.map(([feature, free, premium]) => (
                  <div
                    key={feature}
                    className="grid grid-cols-[minmax(180px,1.4fr)_repeat(2,minmax(120px,1fr))] border-b border-gray-100 last:border-b-0 dark:border-gray-900"
                  >
                    <div className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{feature}</div>
                    <div className="px-4 py-3"><FeatureValue value={free} /></div>
                    <div className="px-4 py-3"><FeatureValue value={premium} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-900/70 dark:bg-amber-950/20">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden />
            <div>
              <h2 className="text-base font-semibold text-amber-950 dark:text-amber-100">
                Premium does not change the encryption promise.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900/85 dark:text-amber-100/80">
                Notes are still encrypted in your browser before upload. Premium adds delivery controls,
                convenience, and capacity; it does not give PrivateNote access to plaintext.
              </p>
            </div>
          </div>
          <Link
            href={lp("/how-it-works")}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
          >
            How encryption works
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
          Questions & answers
        </h2>
        <div className="mt-5 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-950 dark:text-white">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </MarketingDocShell>
  );
}
