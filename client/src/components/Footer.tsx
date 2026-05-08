import React from 'react';
import { Link, useLocation } from 'wouter';
import { Languages, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGE_OPTIONS } from '@/utils/translation';
import { localizedPath, switchLanguagePath } from '@/utils/localizedPath';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const lp = (path: string) => localizedPath(path, language);
  
  return (
    <footer className="relative overflow-hidden bg-primary/95 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/3 h-64 w-64 rounded-full bg-white/7 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-white/7 blur-[120px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/80">
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
              href={lp("/blog")} 
              className="hover:text-white transition-colors"
            >
              {t.blog}
            </Link>
            <Link 
              href={lp("/contact")} 
              className="hover:text-white transition-colors"
            >
              {t.contact}
            </Link>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white/85 backdrop-blur-sm">
            <Languages className="h-3.5 w-3.5 text-white/75" aria-hidden />
            <span>{t.language}</span>
            <span className="flex flex-wrap items-center justify-center gap-1">
              {LANGUAGE_OPTIONS.map((option) => (
                <Link
                  key={option.code}
                  href={switchLanguagePath(location, option.code)}
                  hrefLang={option.code}
                  lang={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={`rounded px-2 py-1 font-semibold transition-colors ${
                    language === option.code
                      ? "bg-white text-primary"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-current={language === option.code ? "page" : undefined}
                >
                  {option.nativeName}
                </Link>
              ))}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Shield className="h-3.5 w-3.5 text-white/70" />
            <span>&copy; {currentYear} privateNote.ai — {t.footerTagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
