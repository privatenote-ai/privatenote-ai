import { useCallback, useEffect, useMemo, useState } from "react";
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
import { billingCurrencyFromBrowser } from "@shared/billingRegion";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { useAuth } from "@/context/AuthContext";
import { useAccountEntitlements } from "@/context/AccountEntitlementsContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import { localizedPath } from "@/utils/localizedPath";

const PLAN_ORDER: AccountType[] = ["free", "personal_premium", "business_premium"];
const HIGHLIGHTED_PLAN: AccountType = "personal_premium";

type PaidPlanId = Exclude<AccountType, "free">;

type BillingStatus = {
  accountType: AccountType;
  canChangeSubscription: boolean;
  configuredAccountType: AccountType;
  billingCurrency?: BillingCurrency;
};

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

function planAmountFor(
  planId: AccountType,
  currency: BillingCurrency,
  interval: BillingInterval,
): number {
  if (planId === "free") return 0;
  return planPriceFor(planId, currency, interval);
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

function planCta(
  planId: AccountType,
  options?: {
    isCurrent?: boolean;
    currentPlan?: AccountType | null;
    signedIn?: boolean;
  },
): string {
  if (options?.isCurrent) return "Current plan";
  if (planId === "free") {
    return options?.signedIn ? "Included" : "Start free";
  }

  const current = options?.currentPlan ?? null;
  if (planId === "personal_premium") {
    if (options?.signedIn && (!current || current === "free")) return "Upgrade to Starter";
    if (current === "business_premium") return "Switch to Starter";
    return "Choose Starter";
  }

  if (options?.signedIn && (current === "free" || current === "personal_premium" || !current)) {
    return "Upgrade to Business";
  }
  return "Choose Business";
}

function currentPlanAcknowledgement(plan: AccountType): string {
  if (plan === "free") {
    return "You're on Free. Starter and Business are available when you need higher limits.";
  }
  if (plan === "personal_premium") {
    return "You're on Starter. Upgrade to Business for branding and larger files.";
  }
  return "You're on Business — thanks for supporting PrivateNote.";
}

function billingErrorCode(error: unknown): string | null {
  if (!(error instanceof ApiRequestError)) return null;
  try {
    const parsed = JSON.parse(error.bodyText) as { error?: unknown };
    return typeof parsed.error === "string" ? parsed.error : null;
  } catch {
    return null;
  }
}

/** Short outcome bullets for cards; capacity details live in the comparison table. */
function planHighlights(planId: AccountType): string[] {
  if (planId === "free") {
    return [
      "Unlimited basic encrypted notes · fair use",
      "Burn after reading and password protection",
      "Open notes without creating an account",
      "Open notifications when signed in",
      "On-device AI templates · a few hosted drafts",
    ];
  }
  if (planId === "personal_premium") {
    return [
      "Everything in Free",
      "Proof of access and recipient verification",
      "Sent-notes dashboard and revoke unopened",
      "Larger attachments and longer expiry",
      "Starter prompt template packs",
      "Synchronized note defaults",
    ];
  }
  return [
    "Everything in Starter",
    "Company branding on reveal pages",
    "Custom AI prompt templates",
    "Largest attachments and payload capacity",
    "Highest hosted AI draft allowance",
    "One professional account — no team seats",
  ];
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
    case "recipientLinkDelivery":
      return features.recipientLinkDelivery ? "Included" : "No";
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
      { key: "recipientLinkDelivery", label: "Email link to recipient" },
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

function buildFaqs(currency: BillingCurrency) {
  const starterMonthly = formatMoney(
    planPriceFor("personal_premium", currency, "month"),
    currency,
  );
  const businessMonthly = formatMoney(
    planPriceFor("business_premium", currency, "month"),
    currency,
  );
  const starterYearly = formatMoney(
    planPriceFor("personal_premium", currency, "year"),
    currency,
  );
  const businessYearly = formatMoney(
    planPriceFor("business_premium", currency, "year"),
    currency,
  );
  return [
    {
      q: "Do paid plans change the encryption?",
      a: "No. Every plan encrypts note plaintext in your browser before upload. Starter and Business add delivery controls, higher limits, and Business branding — not a different crypto promise.",
    },
    {
      q: "What is the difference between Starter and Business?",
      a: `Starter (${starterMonthly}/month) unlocks proof of access, recipient verification, revoke, the sent-notes dashboard, and higher limits. Business (${businessMonthly}/month) adds company branding on reveal pages, custom AI prompt templates, and the largest attachment and buffer limits — still one professional account, not team seats.`,
    },
    {
      q: "How does annual billing work?",
      a: `Annual plans are charged once per year at ${starterYearly} for Starter and ${businessYearly} for Business — two months free versus paying monthly. Stripe charges USD or EUR based on your region at checkout.`,
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
}

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
  currency,
  href,
  onCheckout,
  checkoutBusy,
  isCurrent,
  currentPlan,
  signedIn,
}: {
  planId: AccountType;
  interval: BillingInterval;
  currency: BillingCurrency;
  href: string;
  onCheckout?: (plan: PaidPlanId) => void;
  checkoutBusy?: boolean;
  isCurrent?: boolean;
  currentPlan?: AccountType | null;
  signedIn?: boolean;
}) {
  const plan = PLAN_CATALOG[planId];
  const highlighted = planId === HIGHLIGHTED_PLAN && !isCurrent;
  const annualSavings = annualPlanSavingsPercent(planId, currency);
  const isFree = planId === "free";
  const displayAmount = planAmountFor(planId, currency, interval);
  const priceNote = isFree
    ? "No payment required."
    : interval === "month"
      ? "Billed monthly. Cancel anytime before renewal."
      : `Billed annually · about ${annualSavings}% less than monthly. Cancel anytime before renewal.`;
  const ctaLabel = planCta(planId, { isCurrent, currentPlan, signedIn });
  const primaryCta =
    !isCurrent && (highlighted || ctaLabel === "Upgrade to Business");

  const buttonClassName = [
    "mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-[15px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
    isCurrent
      ? "border border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
      : primaryCta
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
  ].join(" ");

  return (
    <article
      className={[
        "relative flex min-w-0 flex-col rounded-2xl border bg-white p-6 sm:p-7 dark:bg-gray-950",
        isCurrent
          ? "border-emerald-300 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/15 dark:border-emerald-800"
          : highlighted
            ? "border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/10"
            : "border-gray-200 dark:border-gray-800",
      ].join(" ")}
    >
      {isCurrent ? (
        <div className="absolute right-4 top-4 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
          Current plan
        </div>
      ) : highlighted ? (
        <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          Most popular
        </div>
      ) : null}
      <h2 className="pr-28 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
        {plan.label}
      </h2>
      <p className="mt-3 min-h-[3.25rem] text-base leading-7 text-gray-600 dark:text-gray-400">
        {plan.tagline}
      </p>
      <div className="mt-6">
        {isFree ? (
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              {formatMoney(0, currency)}
            </span>
            <span className="pb-1.5 text-sm text-gray-500 dark:text-gray-400">forever</span>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
                {formatMoney(displayAmount, currency)}
              </span>
              <span className="pb-1.5 text-sm text-gray-500 dark:text-gray-400">
                {interval === "month" ? "per month" : "per year"}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">{priceNote}</p>
      {!isFree ? (
        <p className="mt-1 text-xs leading-5 text-gray-400 dark:text-gray-500">
          Shown in {currency.toUpperCase()} for your region. Final charge currency is confirmed
          at Stripe Checkout.
        </p>
      ) : null}
      {isCurrent || (signedIn && planId === "free" && currentPlan && currentPlan !== "free") ? (
        <button type="button" className={buttonClassName} disabled>
          {ctaLabel}
        </button>
      ) : onCheckout && planId !== "free" ? (
        <button
          type="button"
          className={buttonClassName}
          disabled={checkoutBusy}
          onClick={() => onCheckout(planId)}
        >
          {checkoutBusy ? "Opening checkout…" : ctaLabel}
        </button>
      ) : (
        <Link href={href} className={buttonClassName}>
          {ctaLabel}
        </Link>
      )}
      <p className="mt-7 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Includes
      </p>
      <ul className="mt-4 space-y-3.5">
        {planHighlights(planId).map((feature) => (
          <li
            key={feature}
            className="flex gap-3 text-[15px] leading-6 text-gray-700 dark:text-gray-300"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {planId === "business_premium" ? (
        <p className="mt-6 rounded-lg border border-blue-100 bg-blue-50/70 px-3.5 py-2.5 text-sm leading-6 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
          Branded delivery for solo professionals and consultants. Team seats and organization
          administration are not included.
        </p>
      ) : null}
    </article>
  );
}

export default function Premium() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { entitlements } = useAccountEntitlements();
  const { toast } = useToast();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("year");
  const [checkoutBusyPlan, setCheckoutBusyPlan] = useState<PaidPlanId | null>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const lp = (path: string) => localizedPath(path, language);

  const displayCurrency = useMemo(
    () =>
      billingStatus?.billingCurrency === "usd" || billingStatus?.billingCurrency === "eur"
        ? billingStatus.billingCurrency
        : billingCurrencyFromBrowser(language),
    [billingStatus?.billingCurrency, language],
  );
  const starterSavings = annualPlanSavingsPercent("personal_premium", displayCurrency);
  const faqs = useMemo(() => buildFaqs(displayCurrency), [displayCurrency]);
  const currentPlan: AccountType | null = user
    ? billingStatus?.accountType ?? entitlements.accountType
    : null;

  useEffect(() => {
    if (!user) {
      setBillingStatus(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const status = await apiRequest<BillingStatus>("/api/auth/billing/status", "GET");
        if (!cancelled) setBillingStatus(status);
      } catch {
        // Fall back to entitlements snapshot when billing status is unavailable.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, entitlements.refreshedAt]);

  const openPortal = useCallback(async () => {
    try {
      const portal = await apiRequest<{ url: string }>("/api/auth/billing/portal", "POST", {
        flow: "subscription_update",
      });
      window.location.assign(portal.url);
    } catch {
      toast({
        title: "Could not open billing",
        description: "Open Account to manage your subscription.",
        variant: "destructive",
      });
      setCheckoutBusyPlan(null);
    }
  }, [toast]);

  const startCheckout = useCallback(
    async (plan: PaidPlanId, interval: BillingInterval = billingInterval) => {
      if (currentPlan === plan) return;
      setCheckoutBusyPlan(plan);
      try {
        const checkout = await apiRequest<{ url: string; mode?: string }>(
          "/api/auth/billing/checkout",
          "POST",
          { plan, interval },
        );
        window.location.assign(checkout.url);
      } catch (error) {
        const code = billingErrorCode(error);
        if (
          code === "subscription_already_exists" ||
          (error instanceof ApiRequestError && error.status === 409)
        ) {
          await openPortal();
          return;
        }
        toast({
          title: "Could not start checkout",
          description: "Please try again, or open Account to manage an existing subscription.",
          variant: "destructive",
        });
        setCheckoutBusyPlan(null);
      }
    },
    [billingInterval, currentPlan, openPortal, toast],
  );

  const planHref = useMemo(
    (): Record<AccountType, string> => {
      const returnBase = localizedPath("/premium", language);
      const signUp = localizedPath("/auth/sign-up", language);
      const withCheckout = (plan: PaidPlanId) => {
        const returnTo = `${returnBase}?checkout=${plan}&interval=${billingInterval}`;
        return `${signUp}?returnTo=${encodeURIComponent(returnTo)}`;
      };
      return {
        free: signUp,
        personal_premium: withCheckout("personal_premium"),
        business_premium: withCheckout("business_premium"),
      };
    },
    [language, billingInterval],
  );

  // After sign-up/sign-in, resume checkout from ?checkout=&interval=
  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("checkout");
    const intervalParam = params.get("interval");
    if (plan !== "personal_premium" && plan !== "business_premium") return;
    const interval: BillingInterval =
      intervalParam === "month" || intervalParam === "year" ? intervalParam : "year";
    params.delete("checkout");
    params.delete("interval");
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
    void startCheckout(plan, interval);
  }, [user, startCheckout]);

  const starterPrice = formatMoney(
    planPriceFor(
      "personal_premium",
      displayCurrency,
      billingInterval === "year" ? "year" : "month",
    ),
    displayCurrency,
  );
  const businessPrice = formatMoney(
    planPriceFor(
      "business_premium",
      displayCurrency,
      billingInterval === "year" ? "year" : "month",
    ),
    displayCurrency,
  );
  const intervalLabel = billingInterval === "year" ? "/year" : "/month";

  return (
    <MarketingDocShell className="mx-auto max-w-7xl">
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Simple plans for secure notes.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          Free for sending secrets without an account. Starter when you need to know who opened
          it. Business when the reveal should carry your brand.
        </p>
        {currentPlan ? (
          <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-sm font-medium text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
            {currentPlanAcknowledgement(currentPlan)}
          </p>
        ) : null}
        <div className="mt-7 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <button
            type="button"
            onClick={() => setBillingInterval("month")}
            className={[
              "rounded-md px-4 py-2 text-sm font-semibold transition",
              billingInterval === "month"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white",
            ].join(" ")}
          >
            Pay monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval("year")}
            className={[
              "rounded-md px-4 py-2 text-sm font-semibold transition",
              billingInterval === "year"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white",
            ].join(" ")}
          >
            Pay yearly
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Starter {starterPrice}
          {intervalLabel} · Business {businessPrice}
          {intervalLabel}.
          {billingInterval === "year"
            ? ` Save about ${starterSavings}% versus monthly.`
            : ` Yearly saves about ${starterSavings}%.`}{" "}
          Prices shown in {displayCurrency.toUpperCase()}; checkout confirms the charge currency.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3 lg:gap-7">
        {PLAN_ORDER.map((planId) => (
          <PlanCard
            key={planId}
            planId={planId}
            interval={billingInterval}
            currency={displayCurrency}
            href={planHref[planId]}
            onCheckout={
              user && planId !== "free" && currentPlan !== planId
                ? (plan) => void startCheckout(plan)
                : undefined
            }
            checkoutBusy={planId !== "free" && checkoutBusyPlan === planId}
            isCurrent={Boolean(user) && currentPlan === planId}
            currentPlan={currentPlan}
            signedIn={Boolean(user)}
          />
        ))}
      </section>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
        Client-side encryption on every plan · Self-serve Stripe checkout · Cancel anytime before
        renewal
      </p>

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
            href={user ? lp("/account") : lp("/auth/sign-up")}
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
