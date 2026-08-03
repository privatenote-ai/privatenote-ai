import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PASSWORDS_LU_PARTNER_URLS } from "@/config/passwordsLuPartner";
import type { Translations } from "@/utils/translations/types";

const partnerLinkClass = "font-medium text-primary transition-colors hover:text-primary/80";

type PasswordsLuPartnerLinksProps = {
  t: Translations;
  className?: string;
  align?: "left" | "center" | "right";
};

export function PasswordsLuPartnerFooter({ t, className, align = "right" }: PasswordsLuPartnerLinksProps) {
  const alignClass =
    align === "center" ? "justify-center text-center" : align === "left" ? "justify-start text-left" : "justify-end text-right";

  return (
    <p className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${alignClass} ${className ?? ""}`}>
      <span>{t.poweredBy}</span>
      <span className="inline-flex items-center gap-0.5">
        <span
          className="h-4 w-4 shrink-0 bg-[url('/favicon_passwords.svg')] bg-contain bg-center bg-no-repeat"
          aria-hidden="true"
        />
        <a href={PASSWORDS_LU_PARTNER_URLS.site} target="_blank" rel="noopener noreferrer" className={partnerLinkClass}>
          passwords.lu
        </a>
      </span>
    </p>
  );
}

/** Passphrase + PIN generators — sits below the main tool card. */
export function PasswordsLuMoreGenerators({ t, className }: { t: Translations; className?: string }) {
  return (
    <div className={className ?? "text-center"}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <span>{t.pgSeoPartnerHeading}</span>
        <span className="mx-2 text-gray-300 dark:text-gray-600" aria-hidden>
          ·
        </span>
        <a
          href={PASSWORDS_LU_PARTNER_URLS.passphraseGenerator}
          target="_blank"
          rel="noopener noreferrer"
          className={partnerLinkClass}
        >
          {t.pgPartnerPassphrase}
        </a>
        <span className="mx-2 text-gray-300 dark:text-gray-600" aria-hidden>
          ·
        </span>
        <a href={PASSWORDS_LU_PARTNER_URLS.pinGenerator} target="_blank" rel="noopener noreferrer" className={partnerLinkClass}>
          {t.pgPartnerPin}
        </a>
      </p>
    </div>
  );
}

type PasswordGeneratorPrivateNoteLinksProps = {
  t: Translations;
  howItWorksPath: string;
  passwordBlogPath: string;
};

/** Internal PrivateNote links in the SEO section only. */
export function PasswordGeneratorPrivateNoteLinks({
  t,
  howItWorksPath,
  passwordBlogPath,
}: PasswordGeneratorPrivateNoteLinksProps) {
  const links = [
    { href: howItWorksPath, label: t.howItWorks },
    { href: passwordBlogPath, label: t.learnHowWeGeneratePasswords },
  ];

  return (
    <div className="mt-7">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {t.pgSeoPrivateNoteLabel}
      </p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-primary/40 hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-primary/50 dark:hover:text-primary"
          >
            {link.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  );
}
