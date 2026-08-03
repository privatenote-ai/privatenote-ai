import React, { useEffect, useState } from "react";

export type DocMobileNavEntry = {
  href: string;
  label: string;
  id?: string;
};

type DocMobileNavProps = {
  title: string;
  entries: DocMobileNavEntry[];
  children?: React.ReactNode;
};

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");
  const idKey = sectionIds.join("|");

  useEffect(() => {
    if (!sectionIds.length) return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visible = observerEntries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.7] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idKey, sectionIds]);

  return active;
}

export function DocMobileNav({ title, entries, children }: DocMobileNavProps) {
  const sectionIds = entries.map((entry) => entry.id ?? entry.href.replace(/^#/, "")).filter(Boolean);
  const activeSection = useActiveSection(sectionIds);

  return (
    <nav className="mb-10 lg:hidden" aria-label={title}>
      <div className="sticky top-16 z-20 border-b border-gray-200/80 bg-background/95 py-2.5 backdrop-blur-md dark:border-gray-800/80">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {title}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {entries.map(({ href, label, id }) => {
            const sectionId = id ?? href.replace(/^#/, "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={href}
                href={href}
                className={
                  `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ` +
                  (isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300")
                }
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </nav>
  );
}
