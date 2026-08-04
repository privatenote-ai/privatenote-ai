import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  PLAN_CATALOG,
  annualPlanSavingsPercent,
  planPriceFor,
  type AccountType,
  type BillingCurrency,
  type BillingInterval,
} from "@shared/planCatalog";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

const PLAN_ORDER: AccountType[] = ["free", "personal_premium", "business_premium"];
const HIGHLIGHTED_PLAN: AccountType = "personal_premium";
/** Public page uses EUR labels; checkout still picks regional currency in Stripe. */
const DISPLAY_CURRENCY: BillingCurrency = "eur";

const MB = 1024 * 1024;
const GB = 1024 * MB;
const DAY = 24 * 60 * 60;

function formatMoney(amount: number, currency: BillingCurrency): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatBytesLabel(bytes: number): string {
  if (bytes >= GB) return `${Math.round(bytes / GB)} GB`;
  return `${Math.round(bytes / MB)} MB`;
}

function formatFileWindowLabel(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes >= 60) return `${Math.round(minutes / 60)} hour`;
  return `${minutes} minute`;
}

function planCta(planId: AccountType): string {
  if (planId === "free") return "Start free";
  if (planId === "personal_premium") return "Choose Starter";
  return "Choose Business";
}

function planHighlights(planId: AccountType): string[] {
  const features = PLAN_CATALOG[planId].features;
  const attachment = formatBytesLabel(features.attachmentMaxBytes);
  const buffer = formatBytesLabel(features.activePayloadBufferBytes);
  const expiryDays = Math.round(features.maxExpirySeconds / DAY);
  const readCounts = features.allowedReadCounts.join(", ").replace(/, ([^,]*)$/, " or $1");
  const items = [
    "Unlimited basic encrypted notes · fair use",
    `${attachment} attachments · ${buffer} active payload buffer`,
    `Notes can expire up to ${expiryDays} days`,
    `${readCounts} permitted open${features.allowedReadCounts.length > 1 ? "s" : ""} per note`,
    `${formatFileWindowLabel(features.maxFileAccessWindowSeconds)} attachment download window`,
    `${features.hostedAiMonthly} hosted AI drafts each month`,
  ];
  if (features.proofOfAccess) items.push("Proof of access and recipient verification");
  if (features.sentNotesDashboard) items.push("Sent-notes dashboard and revoke unopened");
  if (features.premiumTemplatePacks) items.push("Starter prompt template packs");
  if (features.savedDefaults) items.push("Synchronized note defaults");
  if (features.revealBranding) items.push("Company branding on reveal pages");
  if (features.customPromptTemplates) items.push("Browser-saved custom AI prompt templates");
  return items;
}

type ComparisonCell = string;

function comparisonValue(planId: AccountType, key: string): ComparisonCell {
  const features = PLAN_CATALOG[planId].features;
  switch (key) {
    case "encryptedNotes":
    case "burnAfterReading":
    case "passwordProtection":
      return "Included";
    case "openNotifications":
      return features.openNotifications ? "Included" : "No";
    case "proofOfAccess":
      return features.proofOfAccess ? "Included" : "No";
    case "recipientVerification":
      return features.recipientVerification ? "Included" : "No";
    case "sentNotesDashboard":
      return features.sentNotesDashboard ? "Included" : "No";
    case "revokeUnopened":
      return features.revokeUnopened ? "Included" : "No";
    case "revealBranding":
      return features.revealBranding ? "Included" : "No";
    case "attachments":
      return formatBytesLabel(features.attachmentMaxBytes);
    case "payloadBuffer":
      return formatBytesLabel(features.activePayloadBufferBytes);
    case "expiry":
      return `Up to ${Math.round(features.maxExpirySeconds / DAY)} days`;
    case "readCounts":
      return features.allowedReadCounts.join(", ");
    case "fileWindow":
      return formatFileWindowLabel(features.maxFileAccessWindowSeconds);
    case "hostedAi":
      return `${features.hostedAiMonthly} / month`;
    case "templates":
      if (features.customPromptTemplates) return "Starter packs + custom";
      if (features.premiumTemplatePacks) return "Starter packs";
      return "On-device templates";
    default:
      return "—";
  }
}

const comparisonSections: { title: string; rows: { key: string; label: string }[] }[] = [
  {
    title: "Core",
    rows: [
      { key: "encryptedNotes", label: "Encrypted secure notes" },
      { key: "burnAfterReading", label: "Burn after reading" },
      { key: "passwordProtection", label: "Password protection" },
      { key: "expiry", label: "Note expiry" },
      { key: "readCounts", label: "Permitted opens per note" },
    ],
  },
  {
    title: "Delivery and verification",
    rows: [
      { key: "openNotifications", label: "Open and destroy notifications" },
      { key: "proofOfAccess", label: "Proof of access" },
      { key: "recipientVerification", label: "Recipient verification" },
      { key: "sentNotesDashboard", label: "Sent-notes dashboard" },
      { key: "revokeUnopened", label: "Revoke unopened notes" },
      { key: "revealBranding", label: "Company branding on reveal" },
    ],
  },
  {
    title: "Capacity and AI",
    rows: [
      { key: "attachments", label: "Max attachment size" },
      { key: "payloadBuffer", label: "Active payload buffer" },
      { key: "fileWindow", label: "Post-open download window" },
      { key: "hostedAi", label: "Hosted AI drafts" },
      { key: "templates", label: "Prompt templates" },
    ],
  },
];

const featureCards = [
  {
    icon: Bell,
    title: "Open notifications",
    text: "Know when a note is opened or destroyed — available once you are signed in.",
  },
  {
    icon: MailCheck,
    title: "Recipient verification",
    text: "Starter and Business can restrict reveal to the intended recipient.",
  },
  {
    icon: ShieldCheck,
    title: "Proof of access",
    text: "Coarse open receipts for the sender without storing message content.",
  },
  {
    icon: Building2,
    title: "Business branding",
    text: "Business adds company profile, logo, and accent on reveal pages.",
  },
];

const faqs = [
  {
    q: "Do paid plans change the encryption?",
    a: "No. Every plan encrypts note plaintext in your browser before upload. Starter and Business add delivery controls, higher limits, and Business branding — not a different crypto promise.",
  },
  {
    q: "What is the difference between Starter and Business?",
    a: `Starter (${formatMoney(PLAN_CATALOG.personal_premium.priceMonthlyEur, "eur")}/month) unlocks proof of access, recipient verification, revoke, the sent-notes dashboard, and higher limits. Business (${formatMoney(PLAN_CATALOG.business_premium.priceMonthlyEur, "eur")}/month) adds company branding on reveal pages, custom AI prompt templates, and the largest attachment and buffer limits.`,
  },
  {
    q: "How does annual billing work?",
    a: `Annual plans are charged once per year at ${formatMoney(PLAN_CATALOG.personal_premium.priceYearlyEur, "eur")} for Starter and ${formatMoney(PLAN_CATALOG.business_premium.priceYearlyEur, "eur")} for Business — two months free versus paying monthly.`,
  },
  {
    q: "Can I pay online today?",
    a: "Yes. Choose a plan, sign in or create an account, then complete Stripe Checkout from the subscription page. The final total, including any tax, is shown before you pay.",
  },
  {
    q: "What happens if I downgrade?",
    a: "Existing paid-plan notes keep the conditions under which they were created. Starter and Business controls for new notes lock until the subscription is renewed.",
  },
];

function FeatureValue({ value }: { value: string }) {
  const yes = value === "Included";
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

function PlanCard({
  planId,
  interval,
  href,
}: {
  planId: AccountType;
  interval: BillingInterval;
  href: string;
}) {
  const plan = PLAN_CATALOG[planId];
  const highlighted = planId === HIGHLIGHTED_PLAN;
  const monthlyPrice = planPriceFor(planId, DISPLAY_CURRENCY, "month");
  const yearlyPrice = planPriceFor(planId, DISPLAY_CURRENCY, "year");
  const annualSavings = annualPlanSavingsPercent(planId, DISPLAY_CURRENCY);
  const isFree = planId === "free";
  const displayAmount =
    isFree
      ? 0
      : interval === "month"
        ? monthlyPrice
        : yearlyPrice / 12;
  const priceNote = isFree
    ? "No payment required."
    : interval === "month"
      ? "Billed monthly. Cancel anytime before renewal."
      : `${formatMoney(yearlyPrice, DISPLAY_CURRENCY)} billed annually · save ${annualSavings}%`;

  const buttonClassName = [
    "mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40",
    highlighted
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
  ].join(" ");

  return (
    <article
      className={[
        "relative flex min-w-0 flex-col rounded-xl border bg-white p-5 dark:bg-gray-950",
        highlighted
          ? "border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/10"
          : "border-gray-200 dark:border-gray-800",
      ].join(" ")}
    >
      {highlighted ? (
        <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          Recommended
        </div>
      ) : null}
      <h2 className="pr-28 text-xl font-semibold text-gray-950 dark:text-white">{plan.label}</h2>
      <p className="mt-2 min-h-[3rem] text-sm leading-6 text-gray-600 dark:text-gray-400">
        {plan.tagline}
      </p>
      <div className="mt-5 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {formatMoney(displayAmount, DISPLAY_CURRENCY)}
        </span>
        <span className="pb-1 text-sm text-gray-500 dark:text-gray-400">
          {isFree ? "forever" : "per month"}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{priceNote}</p>
      {planId === "business_premium" ? (
        <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
          One professional account. Team seats and organization administration are not included.
        </p>
      ) : null}
      <Link href={href} className={buttonClassName}>
        {planCta(planId)}
      </Link>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Includes
      </p>
      <ul className="mt-3 space-y-2.5">
        {planHighlights(planId).map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Premium() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("year");
  const lp = (path: string) => localizedPath(path, language);
  const paidHref = user ? lp("/account") : lp("/auth/sign-up");
  const planHref = useMemo(
    (): Record<AccountType, string> => ({
      free: localizedPath("/auth/sign-up", language),
      personal_premium: user
        ? localizedPath("/account", language)
        : localizedPath("/auth/sign-up", language),
      business_premium: user
        ? localizedPath("/account", language)
        : localizedPath("/auth/sign-up", language),
    }),
    [language, user],
  );
  const starterSavings = annualPlanSavingsPercent("personal_premium", DISPLAY_CURRENCY);

  return (
    <MarketingDocShell className="mx-auto max-w-7xl">
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Simple plans for secure notes.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          Free covers encrypted one-time notes. Starter adds proof of access and secure-sharing
          workflow. Business adds branded reveal pages on one professional account.
        </p>
        <div className="mt-7 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          {([
            { id: "month" as const, label: "Pay monthly" },
            { id: "year" as const, label: "Pay yearly" },
          ]).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setBillingInterval(mode.id)}
              className={[
                "rounded-md px-4 py-2 text-sm font-semibold transition",
                billingInterval === mode.id
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white",
              ].join(" ")}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Starter {formatMoney(PLAN_CATALOG.personal_premium.priceMonthlyEur, "eur")}/month · Business{" "}
          {formatMoney(PLAN_CATALOG.business_premium.priceMonthlyEur, "eur")}/month.
          {billingInterval === "year"
            ? ` Annual billing saves about ${starterSavings}%.`
            : " Switch to yearly for two months free."}{" "}
          Checkout confirms currency and tax in Stripe.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
        {PLAN_ORDER.map((planId) => (
          <PlanCard
            key={planId}
            planId={planId}
            interval={billingInterval}
            href={planHref[planId]}
          />
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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Plan comparison
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
              Plans and features
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Limits and capabilities come from the shared plan catalog used by billing and the app.
            </p>
          </div>
          <Link
            href={paidHref}
            className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
          >
            {user ? "Go to account" : "Create account to subscribe"}
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[minmax(220px,1.35fr)_repeat(3,minmax(130px,1fr))] border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
                <div className="px-5 py-4">Feature</div>
                {PLAN_ORDER.map((planId) => (
                  <div
                    key={planId}
                    className={[
                      "px-5 py-4",
                      planId === HIGHLIGHTED_PLAN
                        ? "bg-primary/5 text-primary dark:bg-primary/10"
                        : "",
                    ].join(" ")}
                  >
                    {PLAN_CATALOG[planId].label}
                  </div>
                ))}
              </div>
              {comparisonSections.map((section) => (
                <div key={section.title}>
                  <div className="border-b border-gray-100 bg-white px-5 py-4 text-sm font-semibold text-gray-950 dark:border-gray-900 dark:bg-gray-950 dark:text-white">
                    {section.title}
                  </div>
                  {section.rows.map((row) => (
                    <div
                      key={row.key}
                      className="grid grid-cols-[minmax(220px,1.35fr)_repeat(3,minmax(130px,1fr))] border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 dark:border-gray-900 dark:hover:bg-gray-900/35"
                    >
                      <div className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {row.label}
                      </div>
                      {PLAN_ORDER.map((planId) => (
                        <div
                          key={planId}
                          className={[
                            "px-5 py-4",
                            planId === HIGHLIGHTED_PLAN
                              ? "bg-primary/5 dark:bg-primary/10"
                              : "",
                          ].join(" ")}
                        >
                          <FeatureValue value={comparisonValue(planId, row.key)} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-900/70 dark:bg-amber-950/20">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden />
            <div>
              <h2 className="text-base font-semibold text-amber-950 dark:text-amber-100">
                Paid plans do not change the encryption promise.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900/85 dark:text-amber-100/80">
                Notes are still encrypted in your browser before upload. Starter and Business add
                delivery controls, capacity, and branding — not plaintext access for PrivateNote.
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
