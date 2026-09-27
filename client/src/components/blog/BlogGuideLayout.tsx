import React from "react";
import MarketingDocShell from "@/components/layout/MarketingDocShell";
import { BlogPostBreadcrumbs } from "@/components/blog/BlogPostChrome";
import { BlogOnThisPage, type BlogTocEntry } from "@/components/blog/BlogOnThisPage";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useLanguage } from "@/context/LanguageContext";
import { getBlogCategory } from "@shared/blogCategories";
import { blogCategoryLabel } from "@/utils/blogCategoryLabel";
import { blogCategoryPath } from "@/utils/localizedPath";

type BlogGuideLayoutProps = {
  /** Canonical blog slug — used to resolve primary category for breadcrumbs. */
  slug: string;
  tocHeading: string;
  toc: BlogTocEntry[];
  children: React.ReactNode;
};

/**
 * Guide chrome: breadcrumbs + TOC in the left column; article in the right.
 * Pills/title share the same top edge as the breadcrumbs row.
 */
export function BlogGuideLayout({ slug, tocHeading, toc, children }: BlogGuideLayoutProps) {
  const { t, language } = useLanguage();
  const sectionIds = toc.map((entry) => entry.id);
  const activeId = useActiveSection(sectionIds);

  const category = getBlogCategory(slug);
  const breadcrumbSection = category ? blogCategoryLabel(category, t) : t.blogCategorySecrets;
  const breadcrumbSectionHref = category
    ? blogCategoryPath(category, language)
    : blogCategoryPath("secrets", language);

  return (
    <MarketingDocShell
      className="mb-8"
      // Mobile: left column is hidden — show breadcrumbs above the article.
      mobileNav={
        <div className="mb-4 sm:mb-5 lg:hidden">
          <BlogPostBreadcrumbs section={breadcrumbSection} sectionHref={breadcrumbSectionHref} />
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
      <BlogGuideActiveContext.Provider value={{ tocHeading, toc, activeId }}>
        {children}
      </BlogGuideActiveContext.Provider>
    </MarketingDocShell>
  );
}

type BlogGuideActiveContextValue = {
  tocHeading: string;
  toc: BlogTocEntry[];
  activeId: string;
};

const BlogGuideActiveContext = React.createContext<BlogGuideActiveContextValue | null>(null);

/** Mobile “On this page” disclosure — render after Key Takeaways inside the guide post. */
export function BlogGuideMobileToc({ className }: { className?: string }) {
  const ctx = React.useContext(BlogGuideActiveContext);
  if (!ctx) return null;
  return (
    <BlogOnThisPage
      heading={ctx.tocHeading}
      entries={ctx.toc}
      activeId={ctx.activeId}
      variant="mobile"
      className={className}
    />
  );
}
