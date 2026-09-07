import { Link, useLocation } from "wouter";
import { User, Shield, History, Palette, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

function navItemActive(href: string, location: string): boolean {
  if (href === "/account") return location === "/account";
  if (href === "/account/activity") {
    return (
      location === "/account/activity" ||
      location.startsWith("/account/activity/") ||
      location === "/account/notifications" ||
      location.startsWith("/account/notifications/")
    );
  }
  return location === href || location.startsWith(`${href}/`);
}

export function AccountSettingsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const nav: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/account", label: tx("account", "Account"), icon: User },
    { href: "/account/security", label: tx("security", "Security"), icon: Shield },
    { href: "/account/activity", label: tx("authNavActivity", "Activity"), icon: History },
    { href: "/account/branding", label: tx("authNavBranding", "Branding"), icon: Palette },
    { href: "/account/preferences", label: tx("authNavPreferences", "Preferences"), icon: SlidersHorizontal },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 lg:gap-10">
        {/* Sidebar: wide enough for long emails; nav stays readable */}
        <aside className="w-full shrink-0 md:min-w-[15rem] md:w-60 lg:min-w-[17rem] lg:w-64">
          {user?.email && (
            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
              <p className="text-xs font-normal text-gray-500 dark:text-gray-400">{t.signedInAs}</p>
              <p className="mt-1 min-w-0 text-sm font-medium leading-snug text-gray-900 break-words [overflow-wrap:anywhere] dark:text-white">
                {user.email}
              </p>
            </div>
          )}

          <nav
            className={
              "flex flex-col gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900/40 " +
              "md:gap-1 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:p-0"
            }
            aria-label={tx("authAccountSectionsAria", "Account sections")}
          >
            {nav.map(({ href, label, icon: Icon }) => {
              const active = navItemActive(href, location);
              return (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span
                    className={
                      `flex min-h-[2.75rem] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:min-h-0 md:gap-2.5 md:py-2 ` +
                      (active
                        ? "bg-white text-primary shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-950 dark:text-white dark:ring-white/[0.06] md:bg-primary/10 md:shadow-none md:ring-0 dark:md:bg-blue-400/10"
                        : "text-gray-700 hover:bg-white/80 dark:text-blue-300 dark:hover:bg-gray-950/70 dark:hover:text-white md:text-gray-600 md:hover:bg-gray-100 dark:md:text-blue-300 md:dark:hover:bg-gray-800/80")
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0 opacity-90 md:h-4 md:w-4" aria-hidden />
                    <span className="min-w-0 flex-1 text-left leading-snug">{label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page content — shares wider shell with sidebar (max-w-5xl) */}
        <div className="min-w-0 flex-1 border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}
