import React from "react";

export type PasswordManagerBrand =
  | "apple"
  | "google"
  | "keepass"
  | "bitwarden"
  | "lastpass"
  | "passwords-lu";

type BrandMarkProps = {
  brand: PasswordManagerBrand;
  className?: string;
  /** Square tile behind the mark (manager cards). */
  tile?: boolean;
};

const TILE_CLASS: Record<PasswordManagerBrand, string> = {
  apple: "bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]",
  google: "bg-white text-gray-900 ring-1 ring-gray-200/80 dark:bg-gray-900 dark:text-white dark:ring-gray-700",
  keepass: "bg-[#6CA338] text-white",
  bitwarden: "bg-[#175DDC] text-white",
  lastpass: "bg-[#D32D27] text-white",
  "passwords-lu": "bg-[#6366f1]/10 ring-1 ring-[#6366f1]/25",
};

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function KeePassMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <rect x="3" y="10" width="14" height="11" rx="2" fill="currentColor" opacity="0.25" />
      <path
        d="M8 10V7.5a4 4 0 1 1 8 0V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="15.5" r="1.5" fill="currentColor" />
      <path d="M10 17v2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BitwardenMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.5 3.6v7.2L12 18.8l-6.5-3.6V7.8L12 4.2z" opacity="0.35" />
      <path d="M12 6.5a3.5 3.5 0 0 0-3.5 3.5V13h7V10A3.5 3.5 0 0 0 12 6.5z" />
    </svg>
  );
}

function LastPassMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="12" cy="12" r="8" opacity="0.25" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function PasswordsLuMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/partners/password-dots-logo.svg"
      alt=""
      aria-hidden
      className={className}
    />
  );
}

function Mark({ brand, className }: { brand: PasswordManagerBrand; className?: string }) {
  switch (brand) {
    case "apple":
      return <AppleMark className={className} />;
    case "google":
      return <GoogleMark className={className} />;
    case "keepass":
      return <KeePassMark className={className} />;
    case "bitwarden":
      return <BitwardenMark className={className} />;
    case "lastpass":
      return <LastPassMark className={className} />;
    case "passwords-lu":
      return <PasswordsLuMark className={className} />;
  }
}

export function PasswordManagerBrandMark({ brand, className = "h-6 w-6", tile = false }: BrandMarkProps) {
  if (!tile) {
    return <Mark brand={brand} className={className} />;
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl p-2.5 ${TILE_CLASS[brand]} ${className}`}
    >
      <Mark brand={brand} className="h-7 w-7" />
    </span>
  );
}

const TIER_ACCENT: Record<string, string> = {
  platform: "from-[#A2AAAD]/20 via-[#4285F4]/10 to-white dark:from-[#A2AAAD]/15 dark:via-[#4285F4]/10 dark:to-gray-950 border-[#A2AAAD]/40",
  local: "from-[#6CA338]/15 to-white dark:from-[#6CA338]/10 dark:to-gray-950 border-[#6CA338]/35",
  cloud: "from-[#175DDC]/15 to-white dark:from-[#175DDC]/10 dark:to-gray-950 border-[#175DDC]/35",
};

export function ManagerTierHeader({
  step,
  title,
  subtitle,
  tierId,
}: {
  step: string;
  title: string;
  subtitle: string;
  tierId: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br px-5 py-6 sm:px-7 sm:py-7 ${TIER_ACCENT[tierId] ?? "border-gray-200/70"}`}
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <span
          className="select-none text-5xl font-bold tabular-nums leading-none tracking-tight text-gray-900/15 dark:text-white/15 sm:text-6xl"
          aria-hidden
        >
          {step}
        </span>
        <div className="min-w-0 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Tier {step}
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
