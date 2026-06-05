import React from "react";
import { Link } from "wouter";
import {
  Bell,
  CheckCircle2,
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

const paidPlans: AccountType[] = ["personal_premium", "business_premium"];

const deliveryFeatures = [
  {
    icon: Bell,
    title: "Note-open alerts",
    text: "Get an email when a secure note link is opened. Message content is never included.",
  },
  {
    icon: MailCheck,
    title: "Recipient checks",
    text: "Add recipient-focused verification controls for sensitive deliveries.",
  },
  {
    icon: Clock,
    title: "Longer delivery windows",
    text: "Use 14 or 30 day expirations when a recipient needs more time.",
  },
  {
    icon: ShieldCheck,
    title: "More read-control options",
    text: "Keep read-once for secrets, or allow 2, 3, or 5 views when the workflow needs it.",
  },
];

const included = [
  "Notify me when opened",
  "Notify me when destroyed",
  "Restrict access to a recipient email",
  "Require email verification",
  "Saved note defaults",
  "Sent notes dashboard",
  "More hosted AI drafts",
];

function priceText(plan: AccountType): string {
  const p = PLAN_CATALOG[plan];
  return `$${p.priceMonthlyUsd}/mo`;
}

function yearlyText(plan: AccountType): string {
  const p = PLAN_CATALOG[plan];
  return `$${p.priceYearlyUsd}/yr`;
}

export default function Premium() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const lp = (path: string) => localizedPath(path, language);
  const accountHref = user ? "/account" : "/auth/sign-up";

  return (
    <MarketingDocShell className="mx-auto max-w-6xl">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-300">
            <Crown className="h-3.5 w-3.5" aria-hidden />
            Premium delivery controls
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Upgrade how secure notes are delivered.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
            Premium is for people who need more control after creating a note: alerts, recipient checks,
            longer expirations, saved defaults, and higher hosted AI limits.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={accountHref}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {user ? "View your plan" : "Create account"}
            </Link>
            <Link
              href={lp("/contact")}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Contact to enable Premium
            </Link>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Checkout is not connected yet. Contact us to enable Premium for staging or early access.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/70 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                Premium does not change the encryption promise.
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-900/85 dark:text-amber-100/80">
                Notes are still encrypted in your browser before upload. Premium adds delivery
                controls and capacity; it does not give PrivateNote access to plaintext.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {deliveryFeatures.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <Icon className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-4 text-sm font-semibold text-gray-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        {paidPlans.map((plan) => {
          const p = PLAN_CATALOG[plan];
          const isBusiness = plan === "business_premium";
          return (
            <div
              key={plan}
              className={[
                "rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-950",
                isBusiness
                  ? "border-gray-200 dark:border-gray-800"
                  : "border-primary/30 ring-2 ring-primary/10 dark:border-primary/40",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-950 dark:text-white">{p.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{p.tagline}</p>
                </div>
                {isBusiness ? (
                  <Users className="h-5 w-5 text-gray-400" aria-hidden />
                ) : (
                  <Crown className="h-5 w-5 text-primary" aria-hidden />
                )}
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  {priceText(plan)}
                </span>
                <span className="pb-1 text-sm text-gray-500 dark:text-gray-400">
                  billed monthly
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {yearlyText(plan)} if billed yearly
              </p>

              <ul className="mt-6 space-y-3">
                {included.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <span>{p.features.hostedAiMonthly} hosted AI drafts per month</span>
                </li>
              </ul>

              <Link
                href={lp("/contact")}
                className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Request {p.label}
              </Link>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-lg font-semibold text-gray-950 dark:text-white">What happens next?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["1", "Create or sign in to your account."],
            ["2", "Contact us with the plan you want enabled."],
            ["3", "Use the Premium controls under Customize when creating notes."],
          ].map(([step, text]) => (
            <div key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {step}
              </span>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingDocShell>
  );
}
