import React from "react";

type MarketingDocShellProps = {
  /** Full-width chrome above the sidebar/content grid (e.g. back link). */
  top?: React.ReactNode;
  sidebar?: React.ReactNode;
  mobileNav?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function MarketingDocShell({
  top,
  sidebar,
  mobileNav,
  className = "",
  children,
}: MarketingDocShellProps) {
  return (
    // Avoid overflow-x-clip on this ancestor — it breaks position:sticky for the sidebar.
    <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-36 sm:px-6 sm:pb-40 lg:px-8 lg:pb-44">
      <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-0 -z-10 h-72 w-72 bg-blue-500/8 blur-[100px]" />

      {top}

      {sidebar ? (
        // Default grid stretch (not items-start): aside must be as tall as the article
        // or sticky has no containing-block height and scrolls away with the page.
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain pr-1">
              {sidebar}
            </div>
          </aside>
          <div className={`min-w-0 overflow-x-clip ${className}`.trim()}>
            {mobileNav}
            {children}
          </div>
        </div>
      ) : (
        <div className={`min-w-0 overflow-x-clip ${className}`.trim()}>{children}</div>
      )}
    </div>
  );
}

export default MarketingDocShell;
