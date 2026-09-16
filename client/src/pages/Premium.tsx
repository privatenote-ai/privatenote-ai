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
import { useBillingPortal } from "@/hooks/useBillingPortal";
import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import { localizedPath } from "@/utils/localizedPath";
import {
  canCancelSubscription,
  canManageBilling,
} from "@/utils/billingPortalAccess";
import { BillingFaqSection } from "@/components/billing/BillingFaqSection";
import { BILLING_FAQ_ANCHOR } from "@shared/billingFaq";
import type { Translations } from "@/utils/translations/types";

const PLAN_ORDER: AccountType[] = ["free", "personal_premium", "business_premium"];
const HIGHLIGHTED_PLAN: AccountType = "personal_premium";

type PaidPlanId = Exclude<AccountType, "free">;

type BillingStatus = {
  accountType: AccountType;
  canChangeSubscription: boolean;
  configuredAccountType: AccountType;
  billingCurrency?: BillingCurrency;
  billingCustomerLinked?: boolean;
  billingSubscriptionLinked?: boolean;
  subscriptionState?: string;
  cancelAtPeriodEnd?: boolean;
};

const KB = 1024;
const MB = 1024 * KB;
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

function formatBytesLabel(bytes: number, t: Translations): string {
  if (bytes >= GB) return `${Math.round(bytes / GB)} ${t.pricingGb}`;
  if (bytes >= MB) return `${Math.round(bytes / MB)} ${t.pricingMb}`;
  return `${Math.round(bytes / KB)} ${t.pricingKb ?? "KB"}`;
}

function formatFileWindowLabel(seconds: number, t: Translations): string {
  const minutes = Math.round(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.round(minutes / 60);
    return `${hours} ${hours === 1 ? t.pricingHour : t.pricingHours}`;
  }
  return `${minutes} ${minutes === 1 ? t.pricingMinute : t.pricingMinutes}`;
}

function planStory(planId: AccountType, t: Translations): string {
  if (planId === "free") return t.pricingStoryFree;
  if (planId === "personal_premium") return t.pricingStoryStarter;
  return t.pricingStoryBusiness;
}

function planTagline(planId: AccountType, t: Translations): string {
  if (planId === "free") return t.pricingTaglineFree;
  if (planId === "personal_premium") return t.pricingTaglineStarter;
  return t.pricingTaglineBusiness;
}

function isDowngradeCta(planId: AccountType, currentPlan?: AccountType | null): boolean {
  return currentPlan === "business_premium" && planId === "personal_premium";
}

function planCta(
  planId: AccountType,
  t: Translations,
  options?: {
    isCurrent?: boolean;
    currentPlan?: AccountType | null;
    signedIn?: boolean;
  },
): string {
  if (options?.isCurrent) return t.pricingCtaCurrent;
  if (planId === "free") {
    return options?.signedIn ? t.pricingCtaIncluded : t.pricingCtaStartFree;
  }

  const current = options?.currentPlan ?? null;
  if (planId === "personal_premium") {
    if (options?.signedIn && (!current || current === "free")) return t.pricingCtaUpgradeStarter;
    if (current === "business_premium") return t.pricingCtaDowngradeStarter;
    return t.pricingCtaChooseStarter;
  }

  if (options?.signedIn && (current === "free" || current === "personal_premium" || !current)) {
    return t.pricingCtaUpgradeBusiness;
  }
  return t.pricingCtaChooseBusiness;
}

function currentPlanAcknowledgement(plan: AccountType, t: Translations): string {
  if (plan === "free") return t.pricingAckFree;
  if (plan === "personal_premium") return t.pricingAckStarter;
  return t.pricingAckBusiness;
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
function planHighlights(planId: AccountType, t: Translations): string[] {
  const items =
    planId === "free"
      ? [
          t.pricingFreeH1,
          t.pricingFreeH2,
          t.pricingFreeH3,
          t.pricingFreeH4,
          t.pricingFreeH5,
          t.pricingFreeH6,
          t.pricingFreeH7,
        ]
      : planId === "personal_premium"
        ? [
            t.pricingStarterH1,
            t.pricingStarterH2,
            t.pricingStarterH3,
            t.pricingStarterH4,
            t.pricingStarterH5,
            t.pricingStarterH6,
            t.pricingStarterH7,
            t.pricingStarterH8,
            t.pricingStarterH9,
          ]
        : [
            t.pricingBusinessH1,
            t.pricingBusinessH2,
            t.pricingBusinessH3,
            t.pricingBusinessH4,
            t.pricingBusinessH5,
            t.pricingBusinessH6,
            t.pricingBusinessH7,
            t.pricingBusinessH8,
            t.pricingBusinessH9,
          ];
  return items.filter((feature) => Boolean(feature));
}

/** `note` carries a condition that would otherwise make a bare "Included" misleading. */
type ComparisonCell = { value: string; note?: string; kind?: "yes" | "no" | "text" };

const cell = (value: string, note?: string): ComparisonCell => ({ value, note, kind: "text" });
const flag = (on: boolean, included: string, note?: string): ComparisonCell =>
  on ? { value: included, note, kind: "yes" } : { value: "", kind: "no" };

function comparisonValue(planId: AccountType, key: string, t: Translations): ComparisonCell {
  const features = PLAN_CATALOG[planId].features;
  const freeAccountNote = planId === "free" ? t.pricingWithFreeAccount : undefined;
  switch (key) {
    case "encryptedNotes":
    case "burnAfterReading":
    case "passwordProtection":
      return flag(true, t.pricingIncluded);
    case "openNotifications":
      return flag(features.openNotifications, t.pricingIncluded, freeAccountNote);
    case "proofOfAccess":
      return flag(features.proofOfAccess, t.pricingIncluded);
    case "recipientVerification":
      return flag(features.recipientVerification, t.pricingIncluded);
    case "recipientLinkDelivery":
      return flag(features.recipientLinkDelivery, t.pricingIncluded);
    case "delayedReveal":
      return flag(features.delayedReveal, t.pricingIncluded);
    case "receiptAcknowledgment":
      return flag(features.receiptAcknowledgment, t.pricingIncluded);
    case "sentNotesDashboard":
      return flag(features.sentNotesDashboard, t.pricingIncluded);
    case "revokeUnopened":
      return flag(features.revokeUnopened, t.pricingIncluded);
    case "revealBranding":
      return flag(features.revealBranding, t.pricingIncluded);
    case "revealBodyFont":
      return flag(features.revealBodyFont, t.pricingIncluded);
    case "attachmentViewOnly":
      return flag(features.attachmentViewOnly, t.pricingIncluded);
    case "noteTextSize":
      return cell(formatBytesLabel(features.maxNotePlaintextUtf8Bytes, t));
    case "attachments":
      return cell(formatBytesLabel(features.attachmentMaxBytes, t));
    case "attachmentCount":
      return cell(`${features.attachmentsMaxCount} files`);
    case "attachmentTransfer":
      return cell(formatBytesLabel(features.attachmentTransferMaxBytes, t));
    case "fileTransfers":
      if (features.maxAttachmentTransfersPerMonth == null) {
        return cell(t.pricingFileTransfersUnlimited);
      }
      return cell(
        t.pricingFileTransfersNPerMonth.replace("{n}", String(features.maxAttachmentTransfersPerMonth)),
        planId === "personal_premium" ? t.pricingStarterTransfersNote : freeAccountNote,
      );
    case "payloadBuffer":
      return cell(
        formatBytesLabel(features.activePayloadBufferBytes, t),
        t.pricingEncryptedAttachments,
      );
    case "expiry":
      return cell(t.pricingUpToDays.replace("{n}", String(Math.round(features.maxExpirySeconds / DAY))));
    case "readCounts":
      return cell(features.allowedReadCounts.join(", "));
    case "fileWindow":
      return cell(formatFileWindowLabel(features.maxFileAccessWindowSeconds, t));
    case "hostedAi":
      return cell(t.pricingNPerMonth.replace("{n}", String(features.hostedAiMonthly)), freeAccountNote);
    case "templates":
      if (features.customPromptTemplates) {
        return cell(t.pricingAllPlusCustom, t.pricingSavedInBrowser);
      }
      if (features.premiumTemplatePacks) return cell(t.pricingAllTemplates);
      return cell(t.pricingStandardTemplates);
    default:
      return cell("—");
  }
}

function comparisonSections(t: Translations): {
  title: string;
  description: string;
  rows: { key: string; label: string }[];
}[] {
  return [
    {
      title: t.pricingSectionCore,
      description: t.pricingSectionCoreDesc,
      rows: [
        { key: "encryptedNotes", label: t.pricingRowEncryptedNotes },
        { key: "burnAfterReading", label: t.pricingRowBurnAfterReading },
        { key: "passwordProtection", label: t.pricingRowPasswordProtection },
        { key: "expiry", label: t.pricingRowExpiry },
        { key: "readCounts", label: t.pricingRowReadCounts },
      ],
    },
    {
      title: t.pricingSectionDelivery,
      description: t.pricingSectionDeliveryDesc,
      rows: [
        { key: "openNotifications", label: t.pricingRowOpenNotifications },
        { key: "proofOfAccess", label: t.pricingRowProofOfAccess },
        { key: "recipientVerification", label: t.pricingRowRecipientVerification },
        { key: "recipientLinkDelivery", label: t.pricingRowRecipientLinkDelivery },
        { key: "delayedReveal", label: t.pricingRowDelayedReveal },
        { key: "receiptAcknowledgment", label: t.pricingRowReceiptAcknowledgment },
        { key: "sentNotesDashboard", label: t.pricingRowSentNotesDashboard },
        { key: "revokeUnopened", label: t.pricingRowRevokeUnopened },
        { key: "revealBodyFont", label: t.pricingRowRevealBodyFont },
        { key: "attachmentViewOnly", label: t.pricingRowAttachmentViewOnly },
        { key: "revealBranding", label: t.pricingRowRevealBranding },
      ],
    },
    {
      title: t.pricingSectionCapacity,
      description: t.pricingSectionCapacityDesc,
      rows: [
        { key: "noteTextSize", label: t.pricingRowNoteText ?? "Max note text" },
        { key: "attachments", label: t.pricingRowAttachments },
        { key: "attachmentCount", label: t.pricingRowAttachmentCount ?? "Files per transfer" },
        { key: "attachmentTransfer", label: t.pricingRowAttachmentTransfer ?? "Max transfer size" },
        { key: "fileTransfers", label: t.pricingRowFileTransfers },
        { key: "payloadBuffer", label: t.pricingRowPayloadBuffer },
        { key: "fileWindow", label: t.pricingRowFileWindow },
        { key: "hostedAi", label: t.pricingRowHostedAi },
        { key: "templates", label: t.pricingRowTemplates },
      ],
    },
  ];
}

function featureCards(t: Translations) {
  return [
    {
      icon: Bell,
      title: t.pricingCardNotifyTitle,
      text: t.pricingCardNotifyText,
    },
    {
      icon: MailCheck,
      title: t.pricingCardVerifyTitle,
      text: t.pricingCardVerifyText,
    },
    {
      icon: ShieldCheck,
      title: t.pricingCardProofTitle,
      text: t.pricingCardProofText,
    },
    {
      icon: Building2,
      title: t.pricingCardBrandTitle,
      text: t.pricingCardBrandText,
    },
  ];
}

function buildFaqs(currency: BillingCurrency, t: Translations) {
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
    { q: t.pricingFaqEncryptionQ, a: t.pricingFaqEncryptionA },
    {
      q: t.pricingFaqDifferenceQ,
      a: t.pricingFaqDifferenceA
        .replace("{starterMonthly}", starterMonthly)
        .replace("{businessMonthly}", businessMonthly),
    },
    {
      q: t.pricingFaqAnnualQ,
      a: t.pricingFaqAnnualA
        .replace("{starterYearly}", starterYearly)
        .replace("{businessYearly}", businessYearly),
    },
    { q: t.pricingFaqPayOnlineQ, a: t.pricingFaqPayOnlineA },
    { q: t.pricingFaqDowngradeQ, a: t.pricingFaqDowngradeA },
  ];
}

function ComparisonSectionTable({
  section,
  t,
}: {
  section: ReturnType<typeof comparisonSections>[number];
  t: Translations;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-3 py-3 sm:px-5 dark:border-gray-800">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          {section.title}
        </p>
        <p className="mt-0.5 text-xs font-normal leading-5 text-gray-500 dark:text-gray-500">
          {section.description}
        </p>
      </div>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[640px] border-collapse text-left sm:min-w-[720px]">
          <caption className="sr-only">
            {section.title}: {t.pricingCompareCaption}
          </caption>
          <colgroup>
            <col className="w-[24%] sm:w-[28%] lg:w-[32%]" />
            <col className="w-[25%] sm:w-[24%] lg:w-[23%]" />
            <col className="w-[25%] sm:w-[24%] lg:w-[23%]" />
            <col className="w-[26%] sm:w-[24%] lg:w-[22%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-400">
              <th
                scope="col"
                className="sticky left-0 z-[1] bg-gray-50 px-3 py-3 sm:px-5 sm:py-3.5 dark:bg-gray-900/70"
              >
                {t.pricingFeatureColumn}
              </th>
              {PLAN_ORDER.map((planId) => (
                <th
                  key={planId}
                  scope="col"
                  className={[
                    "px-4 py-3.5 text-center",
                    planId === HIGHLIGHTED_PLAN ? "bg-primary/10 text-primary dark:bg-primary/15" : "",
                  ].join(" ")}
                >
                  {PLAN_CATALOG[planId].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <tr
                key={row.key}
                className={[
                  "border-b border-gray-100 last:border-b-0 dark:border-gray-900",
                  rowIndex % 2 === 1 ? "bg-gray-50/40 dark:bg-gray-900/20" : "bg-white dark:bg-gray-950",
                ].join(" ")}
              >
                <th
                  scope="row"
                  className={[
                    "sticky left-0 z-[1] px-3 py-3 text-[13px] font-medium leading-snug text-gray-900 sm:px-5 sm:py-3.5 sm:text-sm sm:leading-5 dark:text-gray-100",
                    rowIndex % 2 === 1 ? "bg-gray-50/95 dark:bg-gray-900/80" : "bg-white dark:bg-gray-950",
                  ].join(" ")}
                >
                  {row.label}
                </th>
                {PLAN_ORDER.map((planId) => (
                  <td
                    key={planId}
                    className={[
                      "px-2 py-3 align-middle sm:px-4 sm:py-3.5",
                      planId === HIGHLIGHTED_PLAN ? "bg-primary/5 dark:bg-primary/10" : "",
                    ].join(" ")}
                  >
                    <FeatureValue cell={comparisonValue(planId, row.key, t)} t={t} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeatureValue({ cell, t }: { cell: ComparisonCell; t: Translations }) {
  const yes = cell.kind === "yes";
  const no = cell.kind === "no";
  return (
    <span
      className={[
        "flex min-h-6 flex-col items-center text-center text-sm",
        no ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300",
      ].join(" ")}
    >
      {yes ? (
        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
          <Check className="h-4 w-4" aria-hidden />
          <span className="sr-only">{t.pricingIncluded}</span>
        </span>
      ) : no ? (
        <span className="text-base leading-none text-gray-300 dark:text-gray-700" aria-label={t.pricingNotIncluded}>
          —
        </span>
      ) : (
        <span className="font-medium text-gray-900 dark:text-gray-100">{cell.value}</span>
      )}
      {cell.note ? (
        <span className="mt-0.5 max-w-[14rem] text-[11px] leading-4 text-gray-500 dark:text-gray-500">
          {cell.note}
        </span>
      ) : null}
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
  t,
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
  t: Translations;
}) {
  const plan = PLAN_CATALOG[planId];
  const downgrade = isDowngradeCta(planId, currentPlan);
  const highlighted = planId === HIGHLIGHTED_PLAN && !isCurrent && !downgrade;
  const annualSavings = annualPlanSavingsPercent(planId, currency);
  const isFree = planId === "free";
  const displayAmount = planAmountFor(planId, currency, interval);
  const priceNote = isFree
    ? t.pricingNoPayment
    : interval === "month"
      ? t.pricingBilledMonthly
      : t.pricingBilledAnnually.replace("{pct}", String(annualSavings));
  const ctaLabel = planCta(planId, t, { isCurrent, currentPlan, signedIn });
  const primaryCta =
    !isCurrent && !downgrade && (highlighted || ctaLabel === t.pricingCtaUpgradeBusiness);

  const buttonClassName = [
    "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[15px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
    isCurrent
      ? "border border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
      : primaryCta
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
  ].join(" ");
  const ctaContent = isCurrent ? (
    <>
      <Check className="h-4 w-4" aria-hidden />
      {ctaLabel}
    </>
  ) : checkoutBusy ? (
    t.pricingOpeningCheckout
  ) : (
    ctaLabel
  );

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
          {t.pricingCurrentPlanBadge}
        </div>
      ) : highlighted ? (
        <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          {t.pricingMostPopular}
        </div>
      ) : null}
      <h2 className="pr-28 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
        {plan.label}
      </h2>
      <p className="mt-1 text-sm font-medium text-primary">{planStory(planId, t)}</p>
      <p className="mt-3 min-h-[5.25rem] text-base leading-7 text-gray-600 dark:text-gray-400">
        {planTagline(planId, t)}
      </p>
      <div className="mt-6">
        {isFree ? (
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              {formatMoney(0, currency)}
            </span>
            <span className="pb-1.5 text-sm text-gray-500 dark:text-gray-400">{t.pricingForever}</span>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
                {formatMoney(displayAmount, currency)}
              </span>
              <span className="pb-1.5 text-sm text-gray-500 dark:text-gray-400">
                {interval === "month" ? t.pricingPerMonth : t.pricingPerYear}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">{priceNote}</p>
      {!isFree ? (
        <p className="mt-1 text-xs leading-5 text-gray-400 dark:text-gray-500">
          {t.pricingRegionCharge.replace("{currency}", currency.toUpperCase())}
        </p>
      ) : null}
      {isCurrent || (signedIn && planId === "free" && currentPlan && currentPlan !== "free") ? (
        <button type="button" className={buttonClassName} disabled>
          {ctaContent}
        </button>
      ) : onCheckout && planId !== "free" ? (
        <button
          type="button"
          className={buttonClassName}
          disabled={checkoutBusy}
          onClick={() => onCheckout(planId)}
        >
          {ctaContent}
        </button>
      ) : (
        <Link href={href} className={buttonClassName}>
          {ctaContent}
        </Link>
      )}
      <p className="mt-7 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {t.pricingIncludes}
      </p>
      <ul className="mt-4 space-y-3.5">
        {planHighlights(planId, t).map((feature) => (
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
          {t.pricingBusinessNote}
        </p>
      ) : null}
    </article>
  );
}

export default function Premium() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { entitlements } = useAccountEntitlements();
  const { toast } = useToast();
  const { billingPortalFlow, openBillingPortal } = useBillingPortal();
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
  const faqs = useMemo(() => buildFaqs(displayCurrency, t), [displayCurrency, t]);
  const currentPlan: AccountType | null = user
    ? billingStatus?.accountType ?? entitlements.accountType
    : null;
  const showBillingActions = Boolean(user) && canManageBilling({
    stripeCustomerLinked:
      billingStatus?.billingCustomerLinked === true || entitlements.billingCustomerLinked,
    accountType: currentPlan,
  });
  const showCancelSubscription = canCancelSubscription({
    canManage: showBillingActions,
    subscriptionState: billingStatus?.subscriptionState ?? entitlements.subscriptionState,
    subscriptionLinked: billingStatus?.billingSubscriptionLinked,
    cancelAtPeriodEnd: billingStatus?.cancelAtPeriodEnd,
  });

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
    await openBillingPortal("manage");
    setCheckoutBusyPlan(null);
  }, [openBillingPortal]);

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
          title: t.pricingToastCheckoutTitle,
          description: t.pricingToastCheckoutDesc,
          variant: "destructive",
        });
        setCheckoutBusyPlan(null);
      }
    },
    [billingInterval, currentPlan, openPortal, t, toast],
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
  const intervalLabel =
    billingInterval === "year" ? t.pricingIntervalYear : t.pricingIntervalMonth;
  const saveHint =
    billingInterval === "year"
      ? t.pricingYearlySave.replace("{pct}", String(starterSavings))
      : t.pricingMonthlySaveHint.replace("{pct}", String(starterSavings));

  return (
    <MarketingDocShell className="mx-auto max-w-7xl">
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          {t.pricingHeroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          {t.pricingHeroSubtitle}
        </p>
        {currentPlan ? (
          <div className="mx-auto mt-4 max-w-2xl space-y-3">
            <p className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-sm font-medium text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
              {currentPlanAcknowledgement(currentPlan, t)}
            </p>
            {showBillingActions ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={billingPortalFlow !== null}
                  onClick={() => void openBillingPortal("manage")}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
                >
                  {billingPortalFlow === "manage"
                    ? t.authBillingOpening || "Opening..."
                    : t.authManageBilling || "Manage billing"}
                </button>
                {showCancelSubscription ? (
                  <button
                    type="button"
                    disabled={billingPortalFlow !== null}
                    onClick={() => void openBillingPortal("cancel")}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-700 disabled:opacity-60 dark:text-gray-300 dark:hover:text-red-300"
                  >
                    {billingPortalFlow === "cancel"
                      ? t.authBillingOpening || "Opening..."
                      : t.authCancelSubscription || "Cancel subscription"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
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
            {t.pricingPayMonthly}
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
            {t.pricingPayYearly}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {t.pricingPriceSummary
            .replace("{starter}", starterPrice)
            .replace("{business}", businessPrice)
            .replace("{interval}", intervalLabel)
            .replace("{interval}", intervalLabel)}
          {saveHint}
          {t.pricingCurrencyNote?.trim()
            ? ` ${t.pricingCurrencyNote.replace("{currency}", displayCurrency.toUpperCase())}`
            : ""}
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
            t={t}
          />
        ))}
      </section>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
        {t.pricingFooterLine}{" "}
        <a href={`#${BILLING_FAQ_ANCHOR}`} className="underline-offset-2 hover:underline">
          {t.pricingCancelAnytime}
        </a>
      </p>

      <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featureCards(t).map(({ icon: Icon, title, text }) => (
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
              {t.pricingCompareKicker}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
              {t.pricingCompareTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              {t.pricingCompareSubtitle}
            </p>
          </div>
          <Link
            href={user ? lp("/account") : lp("/auth/sign-up")}
            className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
          >
            {user ? t.pricingGoToAccount : t.pricingCreateAccountToSubscribe}
          </Link>
        </div>

        <div className="grid gap-6">
          {comparisonSections(t).map((section) => (
            <ComparisonSectionTable key={section.title} section={section} t={t} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-900/70 dark:bg-amber-950/20">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden />
            <div>
              <h2 className="text-base font-semibold text-amber-950 dark:text-amber-100">
                {t.pricingEncryptionTitle}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900/85 dark:text-amber-100/80">
                {t.pricingEncryptionBody}
              </p>
            </div>
          </div>
          <Link
            href={lp("/how-it-works")}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
          >
            {t.pricingHowEncryptionWorks}
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {t.pricingQaTitle}
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

      <div className="mt-16">
        <BillingFaqSection
          schemaId="premium-billing-faq"
          title={t.pricingBillingFaqTitle}
          intro={t.pricingBillingFaqIntro}
        />
      </div>
    </MarketingDocShell>
  );
}
