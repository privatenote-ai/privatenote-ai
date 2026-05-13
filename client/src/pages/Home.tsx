import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Shield, Check, ArrowRight } from 'lucide-react';
import { CreateNote } from '@/components/note/CreateNote';
import { NoteResult } from '@/components/note/NoteResult';
import { SecurityFeatures } from '@/components/features/SecurityFeatures';
import { FAQSection } from '@/components/features/FAQSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
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
        category: t.blogTagWorkplace,
        title: t.blogWorkplaceTextsTitle,
        excerpt: t.blogWorkplaceTextsExcerpt,
        readTime: t.homeBlogReadTime6,
      },
      {
        slug: 'myth-good-enough-security',
        category: t.blogTagSecurity,
        title: t.blogGoodEnoughTitle,
        excerpt: t.blogGoodEnoughExcerpt,
        readTime: t.homeBlogReadTime5,
      },
      {
        slug: 'how-we-generate-passwords',
        category: t.blogTagCryptography,
        title: t.blogPasswordTitle,
        excerpt: t.blogPasswordExcerpt,
        readTime: t.homeBlogReadTime6,
      },
      {
        slug: 'privacy-tools',
        category: t.blogTagPrivacy,
        title: t.blogPrivacyTitle,
        excerpt: t.blogPrivacyExcerpt,
        readTime: t.homeBlogReadTime4,
      },
    ],
    [
      t.blogTagWorkplace,
      t.blogWorkplaceTextsTitle,
      t.blogWorkplaceTextsExcerpt,
      t.blogTagSecurity,
      t.blogGoodEnoughTitle,
      t.blogGoodEnoughExcerpt,
      t.blogTagCryptography,
      t.blogPasswordTitle,
      t.blogPasswordExcerpt,
      t.blogTagPrivacy,
      t.blogPrivacyTitle,
      t.blogPrivacyExcerpt,
      t.homeBlogReadTime4,
      t.homeBlogReadTime5,
      t.homeBlogReadTime6,
    ],
  );

  // This function would be called from NoteResult when user wants to create a new note
  const handleCreateNew = () => {
    setShowCreateNote(true);
  };

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} min-w-0 max-w-full overflow-x-clip pb-20`}>
      {!isCreateSuccessView && (
        <section className="relative isolate mx-auto max-w-4xl overflow-x-clip px-4 pb-0 sm:px-6 lg:px-8">
          {/* Soft radial glow behind the headline — gives depth to the hero */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-12 -z-10 h-72 w-full"
            aria-hidden
          >
            <div className="absolute left-1/2 top-0 h-64 w-[min(700px,120vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/[0.07]" />
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
      <div className={`${isCreateSuccessView ? "mt-0" : "mt-8"} mb-8 min-w-0 px-4 py-4 sm:px-6 lg:px-8`}>
        <div className="mx-auto min-w-0 max-w-4xl">
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
      <section className="relative isolate overflow-x-clip">
        {/* Background treatment */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[520px] w-[min(900px,130vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-[0.10]" />
        </div>

        {/* Why PrivateNote */}
        <div className="px-4 pt-14 pb-20 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10 min-w-0">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
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
        <div className="px-4 pt-8 pb-20 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-10 sm:mt-16 relative z-0 min-w-0">
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

      <section
        className="relative isolate overflow-hidden border-y border-gray-200/70 bg-gray-50/80 px-4 py-14 dark:border-gray-800/80 dark:bg-gray-950/55 sm:px-6 lg:px-8"
        aria-labelledby="latest-blog-heading"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#00000014_1px,transparent_1px),linear-gradient(to_bottom,#00000014_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-[0.12]" />

        <div className="mx-auto max-w-6xl min-w-0">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {t.homeBlogEyebrow}
              </p>
              <h3 id="latest-blog-heading" className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
                {t.blogSubtitle}
              </h3>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
                {t.homeBlogCarouselHint}
              </p>
            </div>

            <Link
              href={blogPath}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-950 transition-colors hover:text-primary dark:text-gray-100 dark:hover:text-primary"
            >
              {t.homeBlogViewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Carousel opts={{ align: "start" }} className="px-0 md:px-10">
            <CarouselContent>
              {blogPosts.map((post) => (
                <CarouselItem key={post.slug} className="basis-[88%] sm:basis-1/2 lg:basis-1/3">
                  <Link
                    href={`${blogPath}/${post.slug}`}
                    className="group flex h-full min-h-[270px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3 text-xs font-medium">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                        {post.category}
                      </span>
                      <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {post.readTime}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold leading-snug text-gray-950 transition-colors group-hover:text-primary dark:text-white">
                      {post.title}
                    </h4>
                    <p className="mt-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-950 dark:text-gray-100">
                      {t.homeBlogReadArticle}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              aria-label={t.homeBlogCarouselPrev}
              className="hidden border-gray-300 bg-white text-gray-950 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 md:inline-flex"
            />
            <CarouselNext
              aria-label={t.homeBlogCarouselNext}
              className="hidden border-gray-300 bg-white text-gray-950 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 md:inline-flex"
            />
          </Carousel>
        </div>
      </section>

      <FAQSection />
    </div>
  );
};

export default Home;
