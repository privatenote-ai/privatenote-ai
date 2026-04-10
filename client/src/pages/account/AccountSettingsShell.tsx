import { Link, useLocation } from "wouter";
import { User, Shield, History, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <nav
          className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:w-52 md:shrink-0 md:overflow-visible md:pb-0 border-b border-gray-200 dark:border-gray-800 md:border-0"
          aria-label="Account sections"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const resolvedActive = navItemActive(href, location);
            return (
              <Link key={href} href={href}>
                <span
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:w-full
                    ${
                      resolvedActive
                        ? "bg-primary/10 text-primary dark:bg-primary/15"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80"
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
