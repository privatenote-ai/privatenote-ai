import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Check, ChevronDown, Languages, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGE_OPTIONS } from '@/utils/translation';
import { localizedPath, switchLanguagePath } from '@/utils/localizedPath';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const lp = (path: string) => localizedPath(path, language);
  const activeLanguage = LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];
  const footerTagline = location.includes("/secure-file-transfer")
    ? (t.footerTaglineFileTransfer ?? t.footerTagline)
    : t.footerTagline;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <footer className="relative overflow-visible bg-primary/95 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/3 h-64 w-64 rounded-full bg-white/7 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-white/7 blur-[120px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/80">
            <Link
              href={lp("/")}
              className="hover:text-white transition-colors"
            >
              {t.writeNote}
            </Link>
            <Link 
              href={lp("/how-it-works")} 
              className="hover:text-white transition-colors"
            >
              {t.howItWorks}
            </Link>
            <Link 
              href={lp("/privacy")} 
              className="hover:text-white transition-colors"
            >
              {t.privacyPolicy}
            </Link>
            <Link 
              href={lp("/terms")} 
              className="hover:text-white transition-colors"
            >
              {t.termsOfUse}
            </Link>
            <Link 
              href={lp("/about")} 
              className="hover:text-white transition-colors"
            >
              {t.about}
            </Link>
            <Link 
              href={lp("/password-generator")} 
              className="hover:text-white transition-colors"
            >
              {t.passwordGenerator}
            </Link>
            <Link 
              href={lp("/secure-file-transfer")} 
              className="hover:text-white transition-colors"
            >
              {t.shareFile}
            </Link>
            <Link 
              href={lp("/blog")} 
              className="hover:text-white transition-colors"
            >
              {t.blog}
            </Link>
            <Link 
              href={lp("/developers")} 
              className="hover:text-white transition-colors"
            >
              {t.developers}
            </Link>
            <Link 
              href={lp("/security-resources")} 
              className="hover:text-white transition-colors"
            >
              {t.security}
            </Link>
            <Link 
              href={lp("/contact")} 
              className="hover:text-white transition-colors"
            >
              {t.contact}
            </Link>
          </div>

          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              id="footer-language-menu-button"
              onClick={(event) => {
                event.stopPropagation();
                setIsLanguageMenuOpen((open) => !open);
              }}
              className="inline-flex min-w-44 items-center justify-between gap-3 rounded-md border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-none backdrop-blur-sm transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 sm:min-w-52 sm:text-sm"
              aria-haspopup="listbox"
              aria-expanded={isLanguageMenuOpen}
              aria-controls="footer-language-menu"
              aria-label={`${t.language}: ${activeLanguage.nativeName}`}
            >
              <span className="inline-flex items-center gap-2">
                <Languages className="h-3.5 w-3.5 text-white/75 sm:h-4 sm:w-4" aria-hidden />
                <span className="text-white/80">{t.language}</span>
                <span>{activeLanguage.nativeName}</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-white/75 transition-transform ${
                  isLanguageMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            {isLanguageMenuOpen && (
              <div
                id="footer-language-menu"
                className="absolute bottom-full left-1/2 z-20 mb-2 max-h-64 w-52 -translate-x-1/2 overflow-y-auto rounded-md border border-white/20 bg-primary shadow-xl ring-1 ring-black/10 sm:w-56"
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
                    className={`flex items-center justify-between px-3 py-2 text-sm transition-colors ${
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
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Shield className="h-3.5 w-3.5 text-white/70" />
            <span>&copy; {currentYear} privateNote.ai — {footerTagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
