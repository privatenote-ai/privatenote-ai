import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogKeyTakeawaysProps = {
  heading: string;
  items: string[];
  variant?: "card" | "quiet";
};

export function BlogKeyTakeaways({ heading, items, variant = "card" }: BlogKeyTakeawaysProps) {
  if (!items.length) return null;

  const headingId = "blog-key-takeaways-heading";

  return (
    <section
      className={cn(
        variant === "card"
          ? "rounded-2xl border border-primary/25 bg-primary/[0.06] px-5 py-5 dark:border-primary/30 dark:bg-primary/10 sm:px-6 sm:py-6"
          : "border-l-2 border-primary/40 py-1 pl-5 sm:pl-6",
      )}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        data-blog-toc-ignore="true"
        className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary sm:text-base"
      >
        {heading}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-base leading-relaxed text-gray-800 dark:text-gray-200 sm:text-[1.0625rem]">
            <Check
              className="mt-1 h-4 w-4 shrink-0 text-primary sm:mt-0.5 sm:h-[1.125rem] sm:w-[1.125rem]"
              aria-hidden
              strokeWidth={2.5}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
