import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Crown,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { PLAN_CATALOG, type AccountType } from "@shared/planCatalog";

type BillingMode = "monthly" | "yearly";

const planOrder: AccountType[] = ["free", "personal_premium", "business_premium"];

const planCopy: Record<AccountType, { audience: string; cta: string; highlight?: string }> = {
  free: {
    audience: "For occasional secure notes and read-once sharing.",
    cta: "Start free",
  },
  personal_premium: {
    audience: "For people who want proof, recipient checks, and saved defaults.",
    cta: "Request Premium",
    highlight: "Recommended",
  },
  business_premium: {
    audience: "For power users and teams that need higher limits.",
    cta: "Contact us",
  },
};

const topFeatures: Record<AccountType, string[]> = {
  free: [
    "Read-once encrypted notes",
    "Up to 7 day expiration",
    "Password protection",
    "3 hosted AI drafts/month",
  ],
  personal_premium: [
    "Open and destroy notifications",
    "Recipient email restrictions",
    "14 and 30 day expirations",
    "100 hosted AI drafts/month",
  ],
  business_premium: [
    "Everything in Premium Individual",
    "Higher hosted AI capacity",
    "Team-oriented premium controls",
    "500 hosted AI drafts/month",
  ],
};

const deliveryFeatureCards = [
  {
    icon: Bell,
    title: "Open alerts",
    text: "Know when a note link has been accessed without exposing note contents.",
  },
  {
    icon: MailCheck,
    title: "Recipient verification",
    text: "Add delivery controls around who can reveal sensitive notes.",
  },
  {
    icon: Clock,
    title: "Longer windows",
    text: "Use longer expirations when a recipient needs more time.",
  },
  {
    icon: ShieldCheck,
    title: "Read controls",
    text: "Stay read-once by default, or allow limited extra views when needed.",
  },
];

const comparisonSections = [
  {
    title: "Note delivery",
    rows: [
      ["Read-once notes", "Included", "Included", "Included"],
      ["Read limit options", "1 view", "1, 2, 3, or 5 views", "1, 2, 3, or 5 views"],
      ["Expiration options", "Up to 7 days", "Up to 30 days", "Up to 30 days"],
      ["Open notifications", "No", "Yes", "Yes"],
      ["Destroy notifications", "No", "Planned", "Planned"],
    ],
  },
  {
    title: "Access and verification",
    rows: [
      ["Password protection", "Included", "Included", "Included"],
      ["Restrict to recipient email", "No", "Planned", "Planned"],
      ["Require email verification", "No", "Planned", "Planned"],
      ["Saved note defaults", "No", "Yes", "Yes"],
      ["Sent notes dashboard", "No", "Planned", "Planned"],
    ],
  },
  {
    title: "AI capacity",
    rows: [
      ["Private local AI", "When device supports it", "When device supports it", "When device supports it"],
      ["Hosted AI drafts", "3/month", "100/month", "500/month"],
      ["Hosted AI privacy", "Non-private opt-in", "Non-private opt-in", "Non-private opt-in"],
    ],
  },
];

const faqs = [
  {
    q: "Does Premium make notes more encrypted?",
    a: "No. The encryption promise is the same across plans: note plaintext is encrypted in your browser before upload. Premium adds delivery controls, capacity, and workflow features.",
  },
  {
    q: "Why do some Premium controls say planned?",
    a: "The Premium branch exposes the product direction and early controls. Some items are staged as locked discovery rows until checkout and the related delivery workflows are fully connected.",
  },
  {
    q: "Can I pay online today?",
    a: "Checkout is not connected yet. Use the contact button to request Premium access for staging, early access, or manual enablement.",
  },
  {
    q: "Does hosted AI become private on Premium?",
    a: "No. Hosted AI still sends your prompt to Cloudflare Workers AI. Premium increases limits; Private AI remains the on-device path when your browser and hardware support it.",
  },
  {
    q: "What should I use recipient verification for?",
    a: "Use it when the link alone is not enough assurance, such as client credentials, vendor onboarding, or any note that should only be revealed by a specific recipient.",
  },
  {
    q: "Can I keep using read-once notes on Premium?",
    a: "Yes. Read-once remains the safest default. Premium only adds extra read-limit options for workflows where limited re-opening is useful.",
  },
];

function planPrice(plan: AccountType, billingMode: BillingMode): string {
  const p = PLAN_CATALOG[plan];
  const price = billingMode === "monthly" ? p.priceMonthlyUsd : p.priceYearlyUsd;
  if (price === 0) return "$0";
  return `$${price}`;
}

function planCadence(plan: AccountType, billingMode: BillingMode): string {
  const p = PLAN_CATALOG[plan];
  if (p.priceMonthlyUsd === 0) return "forever";
  return billingMode === "monthly" ? "per month" : "per year";
}

function PlanCard({
  plan,
  billingMode,
  href,
}: {
  plan: AccountType;
  billingMode: BillingMode;
  href: string;
}) {
  const p = PLAN_CATALOG[plan];
  const copy = planCopy[plan];
  const highlighted = plan === "personal_premium";

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
      <h2 className="pr-28 text-xl font-semibold text-gray-950 dark:text-white">{p.label}</h2>
      <p className="mt-2 min-h-[3rem] text-sm leading-6 text-gray-600 dark:text-gray-400">
        {copy.audience}
      </p>
      <div className="mt-5 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {planPrice(plan, billingMode)}
        </span>
        <span className="pb-1 text-sm text-gray-500 dark:text-gray-400">
          {planCadence(plan, billingMode)}
        </span>
      </div>
      {plan !== "free" ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {billingMode === "yearly" ? "Best value for early access." : "Switch to yearly for lower annual cost."}
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No payment required.</p>
      )}
      <Link
        href={href}
        className={[
          "mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40",
          highlighted
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
        ].join(" ")}
      >
        {copy.cta}
      </Link>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Includes
      </p>
      <ul className="mt-3 space-y-2.5">
        {topFeatures[plan].map((feature) => (
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
  const planHref = useMemo(() => ({ free: accountHref, personal_premium: lp("/contact"), business_premium: lp("/contact") }), [accountHref, lp]);

  return (
    <MarketingDocShell className="mx-auto max-w-7xl">
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-300">
          <Crown className="h-3.5 w-3.5" aria-hidden />
          Premium
        </div>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Plans for secure note delivery.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          Start with encrypted read-once notes. Upgrade when you need delivery alerts, recipient checks,
          longer expirations, saved defaults, and more hosted AI capacity.
        </p>
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
          Yearly pricing mirrors the catalog discount. Checkout is not connected yet.
        </p>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        {planOrder.map((plan) => (
          <PlanCard key={plan} plan={plan} billingMode={billingMode} href={planHref[plan]} />
        ))}
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {deliveryFeatureCards.map(({ icon: Icon, title, text }) => (
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
              Compare the controls that affect how notes are delivered and opened.
            </p>
          </div>
          <Link href={lp("/contact")} className="text-sm font-semibold text-primary hover:underline">
            Request early access
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(120px,1fr))] border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
              <div className="px-4 py-3">Feature</div>
              <div className="px-4 py-3">Free</div>
              <div className="px-4 py-3">Premium Individual</div>
              <div className="px-4 py-3">Premium Plus</div>
            </div>
            {comparisonSections.map((section) => (
              <div key={section.title}>
                <div className="border-b border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white">
                  {section.title}
                </div>
                {section.rows.map(([feature, free, personal, business]) => (
                  <div
                    key={feature}
                    className="grid grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(120px,1fr))] border-b border-gray-100 last:border-b-0 dark:border-gray-900"
                  >
                    <div className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{feature}</div>
                    <div className="px-4 py-3"><FeatureValue value={free} /></div>
                    <div className="px-4 py-3"><FeatureValue value={personal} /></div>
                    <div className="px-4 py-3"><FeatureValue value={business} /></div>
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
