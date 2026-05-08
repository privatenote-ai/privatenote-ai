import React, { useEffect, useMemo, useRef, useState, type UIEvent } from 'react';
import { Link } from 'wouter';
import { Shield, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CreateNote } from '@/components/note/CreateNote';
import { NoteResult } from '@/components/note/NoteResult';
import { SecurityFeatures } from '@/components/features/SecurityFeatures';
import { FAQSection } from '@/components/features/FAQSection';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const noteUrl = '';
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const { t, language } = useLanguage();
  const blogPath = localizedPath('/blog', language);
  const blogPosts = useMemo(
    () => [
      {
        slug: 'workplace-texts-private-note',
        title: t.blogWorkplaceTextsTitle,
        excerpt: t.blogWorkplaceTextsExcerpt,
      },
      {
        slug: 'myth-good-enough-security',
        title: t.blogGoodEnoughTitle,
        excerpt: t.blogGoodEnoughExcerpt,
      },
      {
        slug: 'how-we-generate-passwords',
        title: t.blogPasswordTitle,
        excerpt: t.blogPasswordExcerpt,
      },
      {
        slug: 'privacy-tools',
        title: t.blogPrivacyTitle,
        excerpt: t.blogPrivacyExcerpt,
      },
    ],
    [
      t.blogWorkplaceTextsTitle,
      t.blogWorkplaceTextsExcerpt,
      t.blogGoodEnoughTitle,
      t.blogGoodEnoughExcerpt,
      t.blogPasswordTitle,
      t.blogPasswordExcerpt,
      t.blogPrivacyTitle,
      t.blogPrivacyExcerpt,
    ],
  );
  const [activeBlogSlide, setActiveBlogSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // This function would be called from NoteResult when user wants to create a new note
  const handleCreateNew = () => {
    setShowCreateNote(true);
  };

  const updateBlogCarouselState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setScrollProgress(Number.isFinite(p) ? p : 0);
  };

  useEffect(() => {
    updateBlogCarouselState();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateBlogCarouselState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [blogPosts.length]);

  const onBlogCarouselScroll = (_e: UIEvent<HTMLDivElement>) => {
    updateBlogCarouselState();
  };

  const scrollBlogCards = (dir: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-blog-card]');
    const cardWidth = card ? card.offsetWidth : el.clientWidth * 0.85;
    const delta = dir === 'next' ? cardWidth * 1.05 : -cardWidth * 1.05;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} pb-20`}>
      {!isCreateSuccessView && (
        <section className="relative px-4 pb-0 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Soft radial glow behind the headline — gives depth to the hero */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-12 -z-10 h-72 w-full"
            aria-hidden
          >
            <div className="absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/[0.07]" />
          </div>
          <div className="text-center">
            <h1 className="page-title text-gray-900 dark:text-white">
              <span className="block">{t.homeHeroLine1}</span>
              <span className="block mt-1 text-primary">{t.homeHeroLine2}</span>
            </h1>
            <p className="mt-3 max-w-4xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-5xl">
              {t.homeHeroSubtitle}
            </p>
          </div>
        </section>
      )}

      {/* Create Note or Result - Main Feature */}
      <div className={`${isCreateSuccessView ? "mt-0" : "mt-8"} mb-8 py-4 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          {showCreateNote ? (
            <CreateNote onSuccessStateChange={setIsCreateSuccessView} />
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      {/* Security Features */}
      <SecurityFeatures />

      {/* Why + How wrapper (enables overlap) */}
      <section className="relative">
        {/* Background treatment */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-[0.10]" />
        </div>

        {/* Why PrivateNote */}
        <div className="px-4 pt-14 pb-20 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/60 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
                {t.whyPrivateNote}
              </div>

              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t.shareSensitiveHeading}
              </h2>

              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-xl">
                {t.shareSensitiveBody}
              </p>

              <ul className="mt-7 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {[
                  t.clientSideEncryption,
                  t.readOnceExposure,
                  t.noTrackingAds,
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* How It Stays Private */}
        <div className="px-4 pt-8 pb-20 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-10 sm:mt-16 relative z-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t.simplePrivacyFlow}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t.clearSteps}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/15">
              <Shield className="h-4 w-4" />
              {t.privacyFirst}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: t.write, detail: t.writeStepDetail },
              { title: t.encrypt, detail: t.encryptStepDetail },
              { title: t.share, detail: t.shareStepDetail },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/15">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2">
            {[
              t.noTrackingCookies,
              t.noThirdPartyAnalytics,
              t.keysStayInLink,
              t.minimalMetadata,
            ].map((detail) => (
              <div key={detail} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-2 pb-12 sm:px-6 lg:px-8 max-w-4xl mx-auto" aria-labelledby="latest-blog-heading">
        <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm">
          <div className="text-center mb-6 sm:mb-7">
            <h3 id="latest-blog-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t.blog}
            </h3>
          </div>

          <div className="relative">
            <div className="md:hidden absolute -top-1 right-0 flex items-center gap-2 z-10">
              <button
                type="button"
                aria-label="Previous blog posts"
                onClick={() => scrollBlogCards('prev')}
                disabled={!canPrev}
                className={`p-2 rounded-lg border border-primary/30 text-primary transition ${
                  canPrev ? 'opacity-100 hover:bg-primary/10' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next blog posts"
                onClick={() => scrollBlogCards('next')}
                disabled={!canNext}
                className={`p-2 rounded-lg border border-primary/30 text-primary transition ${
                  canNext ? 'opacity-100 hover:bg-primary/10' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="pointer-events-none md:hidden absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none md:hidden absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />

            <div
              ref={scrollerRef}
              onScroll={onBlogCarouselScroll}
              className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 pt-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  data-blog-card
                  className="snap-start shrink-0 w-[84%] sm:w-[78%] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 p-4"
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`${blogPath}/${post.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    {t.blogReadMore}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {blogPosts.slice(0, 3).map((post) => (
                <article
                  key={post.slug}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 p-5 transition-all duration-200 hover:shadow-md"
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`${blogPath}/${post.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    {t.blogReadMore}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="md:hidden mt-4 flex items-center justify-center gap-2">
              <div className="h-1 w-40 rounded bg-muted overflow-hidden">
                <div
                  className="h-full rounded bg-primary transition-[width] duration-200"
                  style={{ width: `${Math.max(8, Math.min(100, scrollProgress * 100))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href={blogPath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md bg-primary/10 text-primary border border-primary/30"
            >
              {t.blog}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
};

export default Home;
