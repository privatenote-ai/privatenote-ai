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

function Initials({ email }: { email: string | null }) {
  if (!email) return <>U</>;
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const chars = parts.length ? parts.map((p) => p[0]) : [local[0]];
  return <>{chars.filter(Boolean).slice(0, 2).join("").toUpperCase()}</>;
}

export function AccountSettingsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Sidebar */}
        <aside className="md:w-52 md:shrink-0">
          {/* User identity panel */}
          {user?.email && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 px-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white select-none">
                <Initials email={user.email} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-900 dark:text-white leading-snug">
                  {user.email}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Free
                </p>
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav
            className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0 border-b border-gray-200 dark:border-gray-800 md:border-0"
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

        {/* Page content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
