import React from "react";
import { BlogKeyTakeaways } from "@/components/blog/BlogKeyTakeaways";
import { getBlogTakeaways } from "@/components/blog/blogTakeaways";
import { useLanguage } from "@/context/LanguageContext";

/** Renders shared Key Takeaways for a canonical blog slug (skips if none). */
export function BlogArticleTakeaways({
  slug,
  className,
  variant,
}: {
  slug: string;
  className?: string;
  variant?: "card" | "quiet";
}) {
  const { language, t } = useLanguage();
  const items = getBlogTakeaways(slug, language);
  if (!items.length) return null;

  return (
    <div className={className ?? "mb-10"}>
      <BlogKeyTakeaways heading={t.blogKeyTakeaways} items={items} variant={variant} />
    </div>
  );
}
