import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import MarketingDocShell from "@/components/layout/MarketingDocShell";
import { BlogPostBreadcrumbs } from "@/components/blog/BlogPostChrome";
import { BlogOnThisPage, type BlogTocEntry } from "@/components/blog/BlogOnThisPage";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useLanguage } from "@/context/LanguageContext";
import { getBlogCategory } from "@shared/blogCategories";
import { blogCategoryLabel } from "@/utils/blogCategoryLabel";
import { blogCategoryPath } from "@/utils/localizedPath";

function slugifyHeading(text: string, used: Set<string>): string {
  const base =
    text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "section";
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function collectToc(root: HTMLElement): BlogTocEntry[] {
  const used = new Set<string>();
  const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>("article h2")).filter(
    (heading) => heading.getAttribute("data-blog-toc-ignore") !== "true",
  );
  return headings.map((heading) => {
    const label = (heading.textContent || "").replace(/\s+/g, " ").trim();
    const existing = heading.id.trim();
    const id = existing || slugifyHeading(label, used);
    if (existing) used.add(existing);
    if (!heading.id) heading.id = id;
    const section = heading.closest("section");
    if (section && !section.id) section.id = id;
    heading.classList.add("scroll-mt-28");
    if (section) section.classList.add("scroll-mt-28");
    return { id, label: label || id };
  });
}

type BlogGuideArticleProps = {
  slug: string;
  children: React.ReactNode;
  showMobileToc?: boolean;
};

/**
 * Applies Guide chrome (category breadcrumbs + sticky TOC) to any blog post.
 * TOC entries are derived from `article h2` headings.
 */
export function BlogGuideArticle({ slug, children, showMobileToc = true }: BlogGuideArticleProps) {
  const { t, language } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<BlogTocEntry[]>([]);
  const sectionIds = useMemo(() => toc.map((entry) => entry.id), [toc]);
  const activeId = useActiveSection(sectionIds);

  const category = getBlogCategory(slug);
  const breadcrumbSection = category ? blogCategoryLabel(category, t) : t.blogCategorySecrets;
  const breadcrumbSectionHref = category
    ? blogCategoryPath(category, language)
    : blogCategoryPath("secrets", language);
  const tocHeading = t.securityTocTitle;

  useLayoutEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    setToc(collectToc(root));
  }, [children, language]);

  return (
    <MarketingDocShell
      className="mb-8"
      mobileNav={
        <div className="mb-4 space-y-4 sm:mb-5 lg:hidden">
          <BlogPostBreadcrumbs section={breadcrumbSection} sectionHref={breadcrumbSectionHref} />
          {showMobileToc && toc.length > 0 ? (
            <BlogOnThisPage
              heading={tocHeading}
              entries={toc}
              activeId={activeId}
              variant="mobile"
            />
          ) : null}
        </div>
      }
      sidebar={
        <div>
          <div className="mb-6">
            <BlogPostBreadcrumbs section={breadcrumbSection} sectionHref={breadcrumbSectionHref} />
          </div>
          <BlogOnThisPage
            heading={tocHeading}
            entries={toc}
            activeId={activeId}
            variant="desktop"
          />
        </div>
      }
    >
      <div ref={contentRef} className="blog-guide-article min-w-0">
        {children}
      </div>
    </MarketingDocShell>
  );
}
