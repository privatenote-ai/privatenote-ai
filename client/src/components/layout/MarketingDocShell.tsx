import React from "react";

type MarketingDocShellProps = {
  sidebar?: React.ReactNode;
  mobileNav?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function MarketingDocShell({
  sidebar,
  mobileNav,
  className = "",
  children,
}: MarketingDocShellProps) {
  return (
    <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 pt-24 pb-36 sm:px-6 sm:pb-40 lg:px-8 lg:pb-44">
      <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-0 -z-10 h-72 w-72 bg-blue-500/8 blur-[100px]" />

      {sidebar ? (
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">{sidebar}</div>
          </aside>
          <div className={`min-w-0 ${className}`.trim()}>
            {mobileNav}
            {children}
          </div>
        </div>
      ) : (
        <div className={`min-w-0 ${className}`.trim()}>{children}</div>
      )}
    </div>
  );
}

export default MarketingDocShell;
