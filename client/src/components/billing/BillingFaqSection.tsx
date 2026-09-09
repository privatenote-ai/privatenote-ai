import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import {
  BILLING_FAQ_ANCHOR,
  billingFaqItems,
  buildBillingFaqSchema,
} from "@shared/billingFaq";
import { setStructuredDataScript } from "@/utils/documentMeta";
import { localizedPath } from "@/utils/localizedPath";
import { useLanguage } from "@/context/LanguageContext";

function isMailto(href: string): boolean {
  return href.startsWith("mailto:");
}

function isHttp(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function BillingFaqSection({
  schemaId,
  title,
  intro,
}: {
  schemaId: string;
  title?: string;
  intro?: string;
}) {
  const { language } = useLanguage();
  const items = useMemo(() => billingFaqItems(), []);

  useEffect(() => {
    setStructuredDataScript(schemaId, buildBillingFaqSchema());
    return () => setStructuredDataScript(schemaId, null);
  }, [schemaId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const applyHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      const targetId =
        raw === BILLING_FAQ_ANCHOR
          ? "faq-cancel-vs-withdraw"
          : items.some((item) => item.id === raw)
            ? `faq-${raw}`
            : raw.startsWith("faq-")
              ? raw
              : null;
      if (!targetId) return;
      const el = document.getElementById(targetId);
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [items]);

  return (
    <section id={BILLING_FAQ_ANCHOR} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
        {title ?? "Billing FAQ"}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">{intro}</p>
      ) : null}
      <div className="mt-5 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950">
        {items.map((item) => (
          <details
            key={item.id}
            id={`faq-${item.id}`}
            className="group scroll-mt-28 px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-950 dark:text-white">
              {item.question}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="mt-3 max-w-3xl space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {item.answer.split("\n\n").map((paragraph, index) => (
                <p key={`${item.id}-${index}`}>{paragraph}</p>
              ))}
              {item.links.length > 0 ? (
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {item.links.map((link) =>
                    isMailto(link.href) || isHttp(link.href) ? (
                      <a
                        key={link.href}
                        href={link.href}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={localizedPath(link.href, language)}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
