import React from "react";
import { cn } from "@/lib/utils";

export type BlogTocEntry = {
  id: string;
  label: string;
};

type BlogOnThisPageProps = {
  heading: string;
  entries: BlogTocEntry[];
  activeId: string;
  /** Desktop sticky sidebar vs mobile disclosure. */
  variant: "desktop" | "mobile";
  className?: string;
};

function TocLinks({
  entries,
  activeId,
}: {
  entries: BlogTocEntry[];
  activeId: string;
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {entries.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm leading-snug transition-colors",
                isActive
                  ? "bg-primary/10 font-semibold text-primary dark:bg-primary/15"
                  : "font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white",
              )}
              aria-current={isActive ? "location" : undefined}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function BlogOnThisPage({
  heading,
  entries,
  activeId,
  variant,
  className,
}: BlogOnThisPageProps) {
  if (!entries.length) return null;

  if (variant === "mobile") {
    return (
      <details
        className={cn(
          "group rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:hidden",
          className,
        )}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            {heading}
            <span
              className="text-gray-400 transition-transform group-open:rotate-180 dark:text-gray-500"
              aria-hidden
            >
              ▾
            </span>
          </span>
        </summary>
        <nav className="border-t border-gray-200 px-2 py-3 dark:border-gray-800" aria-label={heading}>
          <TocLinks entries={entries} activeId={activeId} />
        </nav>
      </details>
    );
  }

  return (
    <nav className={cn("hidden lg:block", className)} aria-label={heading}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {heading}
      </p>
      <TocLinks entries={entries} activeId={activeId} />
    </nav>
  );
}
