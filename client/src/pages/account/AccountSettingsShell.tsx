import { Link, useLocation } from "wouter";
import { User, Shield, History, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/account", label: "Account", icon: User },
  { href: "/account/security", label: "Security", icon: Shield },
  { href: "/account/activity", label: "Activity", icon: History },
  { href: "/account/preferences", label: "Preferences", icon: SlidersHorizontal },
];

function navItemActive(href: string, location: string): boolean {
  if (href === "/account") return location === "/account";
  return location === href || location.startsWith(`${href}/`);
}

export function AccountSettingsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-6 lg:gap-8">
        {/* Sidebar: inset matches navbar content (logo column); section links sit slightly right */}
        <aside className="w-full shrink-0 md:w-44 md:pl-2 lg:pl-3">
          {user?.email && (
            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-900/60">
              <p className="text-sm font-medium leading-snug text-gray-900 break-all dark:text-white">
                {user.email}
              </p>
            </div>
          )}

          <nav
            className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-1 dark:border-gray-800 md:flex-col md:overflow-visible md:border-0 md:pb-0 md:pl-0.5"
            aria-label="Account sections"
          >
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = navItemActive(href, location);
              return (
                <Link key={href} href={href}>
                  <span
                    className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors md:w-full
                      ${
                        active
                          ? "bg-primary/10 text-primary dark:bg-primary/15"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80"
                      }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page content — same max width rail as Home / Navbar (max-w-4xl) */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
