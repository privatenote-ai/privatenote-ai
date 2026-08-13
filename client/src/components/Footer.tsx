import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, ChevronDown, Languages } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_OPTIONS } from "@/utils/translation";
import { localizedPath, switchLanguagePath } from "@/utils/localizedPath";
import { PREMIUM_NAV_LINK_PUBLIC } from "@shared/premiumPagePublic";

type FooterLink = {
  href: string;
  label: string;
};

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const lp = (path: string) => localizedPath(path, language);
  const activeLanguage =
    LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];
  const footerTagline = location.includes("/secure-file-transfer")
    ? (t.footerTaglineFileTransfer ?? t.footerTagline)
    : t.footerTagline;

  const productLinks: FooterLink[] = [
    { href: lp("/"), label: t.writeNote },
    { href: lp("/secure-file-transfer"), label: t.shareFile },
    { href: lp("/password-generator"), label: t.passwordGenerator },
    { href: lp("/how-it-works"), label: t.howItWorks },
    ...(PREMIUM_NAV_LINK_PUBLIC
      ? [{ href: lp("/premium"), label: "Pricing" }]
      : []),
  ];

  const resourceLinks: FooterLink[] = [
    { href: lp("/security-resources"), label: t.security },
    { href: lp("/blog"), label: t.blog },
    { href: lp("/developers"), label: t.developers },
  ];

  const companyLinks: FooterLink[] = [
    { href: lp("/about"), label: t.about },
    { href: lp("/contact"), label: t.contact },
    { href: lp("/privacy"), label: t.privacyPolicy },
    { href: lp("/terms"), label: t.termsOfUse },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <footer className="relative overflow-visible bg-primary/95 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/3 h-64 w-64 rounded-full bg-white/7 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-white/7 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link
              href={lp("/")}
              className="inline-flex items-center gap-2.5 whitespace-nowrap text-white transition-opacity hover:opacity-90"
              aria-label="PrivateNote.ai home"
            >
              <Logo size={30} className="shrink-0" />
              <span className="text-xl font-bold tracking-tight">
                privateNote
                <span className="ml-0.5 align-super text-xs font-semibold">.ai</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {footerTagline}
            </p>
            <p className="mt-3 text-xs text-white/45">
              &copy; {currentYear} privateNote.ai. {t.allRightsReserved ?? "All rights reserved."}
            </p>
          </div>

          {/* Link columns */}
          <nav className="col-span-2 md:col-span-6" aria-label="Footer">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              <FooterColumn title={t.footerProduct ?? "Product"} links={productLinks} />
              <FooterColumn title={t.resources} links={resourceLinks} />
              <FooterColumn title={t.footerCompany ?? "Company"} links={companyLinks} />
            </div>
          </nav>

          {/* Language */}
          <div className="col-span-2 md:col-span-2 md:justify-self-end">
            <div className="relative w-full md:w-auto" ref={languageMenuRef}>
              <button
                type="button"
                id="footer-language-menu-button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsLanguageMenuOpen((open) => !open);
                }}
                className="inline-flex w-full items-center justify-between gap-3 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/35 md:w-auto md:min-w-[10rem]"
                aria-haspopup="listbox"
                aria-expanded={isLanguageMenuOpen}
                aria-controls="footer-language-menu"
                aria-label={`${t.language}: ${activeLanguage.nativeName}`}
              >
                <span className="inline-flex items-center gap-2">
                  <Languages className="h-4 w-4 text-white/70" aria-hidden />
                  <span>{activeLanguage.nativeName}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-white/70 transition-transform ${
                    isLanguageMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              {isLanguageMenuOpen ? (
                <div
                  id="footer-language-menu"
                  className="absolute bottom-full right-0 z-20 mb-2 max-h-64 w-full min-w-[11.5rem] overflow-y-auto rounded-xl border border-white/20 bg-primary py-1 shadow-xl ring-1 ring-black/10"
                  role="listbox"
                  aria-labelledby="footer-language-menu-button"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <Link
                      key={option.code}
                      href={switchLanguagePath(location, option.code)}
                      hrefLang={option.code}
                      lang={option.code}
                      onClick={() => {
                        setLanguage(option.code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-3.5 py-2 text-sm transition-colors ${
                        language === option.code
                          ? "bg-white text-primary"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                      role="option"
                      aria-selected={language === option.code}
                    >
                      <span>{option.nativeName}</span>
                      {language === option.code ? <Check className="h-4 w-4" aria-hidden /> : null}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 mx-auto max-w-6xl overflow-hidden px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8"
        aria-hidden="true"
      >
        <p className="select-none whitespace-nowrap text-left font-sans text-[clamp(3.5rem,16vw,14rem)] font-bold leading-[0.82] tracking-[-0.05em] text-white">
          PrivateNote
        </p>
      </div>
    </footer>
  );
};
