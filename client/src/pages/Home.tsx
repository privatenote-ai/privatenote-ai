import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { NoteResult } from '@/components/note/NoteResult';
import { HomeBelowFoldSkeleton } from '@/components/home/HomeBelowFoldSkeleton';
import { HomeKeyFeaturesSkeleton } from '@/components/home/HomeKeyFeaturesSkeleton';
import { useMountWhenInView } from '@/hooks/useMountWhenInView';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const CreateNote = lazy(() =>
  import('@/components/note/CreateNote').then((m) => ({ default: m.CreateNote })),
);
const SecurityFeatures = lazy(() =>
  import('@/components/features/SecurityFeatures').then((m) => ({ default: m.SecurityFeatures })),
);
const HomeBelowFold = lazy(() => import('@/pages/HomeBelowFold'));

/** Reserve editor layout without a skeleton flash while the CreateNote chunk loads. */
function CreateNoteMountPlaceholder() {
  return <div className="min-h-[28rem] w-full" aria-hidden />;
}

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const noteUrl = '';
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const [mountCreateNote, setMountCreateNote] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    const mount = () => {
      if (!cancelled) setMountCreateNote(true);
    };
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(mount, { timeout: 800 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(mount);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);
  /** Tight margins so lazy chunks are not requested during initial navigation on typical viewports. */
  const [keyFeaturesRef, keyFeaturesMounted] = useMountWhenInView({ rootMargin: '0px' });
  const [belowFoldRef, belowFoldMounted] = useMountWhenInView({ rootMargin: '80px' });
  const blogPath = localizedPath('/blog', language);
  const blogPosts = useMemo(
    () => [
      {
        slug: 'one-time-secret-links',
        category: t.blogTagSecurity,
        title: t.blogOneTimeLinksTitle,
        excerpt: t.blogOneTimeLinksExcerpt,
        readTime: t.homeBlogReadTime7,
      },
      {
        slug: 'securing-ai-agents-like-employees',
        category: t.blogTagAi,
        title: t.blogAgentSecurityTitle,
        excerpt: t.blogAgentSecurityExcerpt,
        readTime: t.homeBlogReadTime6,
      },
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
        readTime: t.homeBlogReadTime7,
      },
    ],
    [
      t.blogTagAi,
      t.blogAgentSecurityTitle,
      t.blogAgentSecurityExcerpt,
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
      t.homeBlogReadTime7,
      t.blogOneTimeLinksTitle,
      t.blogOneTimeLinksExcerpt,
      t.blogTagSecurity,
    ],
  );

  const handleCreateNew = () => {
    setShowCreateNote(true);
  };

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-16 sm:pt-24"} min-w-0 max-w-full overflow-x-clip pb-28 sm:pb-32`}>
      {!isCreateSuccessView && (
        <section className="relative isolate mx-auto max-w-4xl overflow-x-clip px-4 pb-1 sm:pb-4 sm:px-6 lg:px-8">
          <div
            className="pointer-events-none absolute inset-x-0 -top-12 -z-10 h-72 w-full"
            aria-hidden
          >
            <div className="absolute left-1/2 top-0 h-64 w-[min(700px,120vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/[0.07]" />
          </div>
          <div className="text-center">
            <h1 className="page-title text-gray-900 dark:text-white">
              <span className="block">{t.homeHeroLine1}</span>
              <span className="block mt-0.5 sm:mt-1 text-primary">{t.homeHeroLine2}</span>
            </h1>
            <p className="mt-2 max-w-4xl mx-auto text-lg text-gray-500 dark:text-gray-400 sm:mt-4 sm:text-xl md:mt-6 md:text-[1.375rem] md:max-w-5xl">
              {t.homeHeroSubtitle}
            </p>
          </div>
        </section>
      )}

      <div
        className={`${isCreateSuccessView ? 'mt-0' : 'mt-6 sm:mt-10 md:mt-12'} min-w-0 px-4 pt-1 pb-16 sm:px-6 sm:py-4 sm:pb-20 md:pb-24 lg:px-8`}
      >
        <div className="mx-auto min-w-0 max-w-4xl">
          {showCreateNote ? (
            mountCreateNote ? (
              <Suspense fallback={<CreateNoteMountPlaceholder />}>
                <CreateNote onSuccessStateChange={setIsCreateSuccessView} />
              </Suspense>
            ) : (
              <CreateNoteMountPlaceholder />
            )
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      <div
        ref={keyFeaturesRef}
        role="region"
        aria-label={t.keyFeatures}
        className="relative isolate mt-16 overflow-x-clip sm:mt-20 lg:mt-28"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-background via-background/95 to-gray-50/70 sm:h-36 dark:via-background/92 dark:to-gray-950/50"
        />
        <div className="relative z-10 border-b border-gray-200/45 bg-gradient-to-b from-gray-50/25 via-gray-50/70 to-gray-50/90 dark:border-gray-800/45 dark:from-gray-950/15 dark:via-gray-950/45 dark:to-gray-950/65">
          {keyFeaturesMounted ? (
            <Suspense fallback={<HomeKeyFeaturesSkeleton />}>
              <SecurityFeatures className="pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20" />
            </Suspense>
          ) : (
            <HomeKeyFeaturesSkeleton />
          )}
        </div>
      </div>

      <div ref={belowFoldRef}>
        {belowFoldMounted ? (
          <Suspense fallback={<HomeBelowFoldSkeleton />}>
            <HomeBelowFold t={t} blogPath={blogPath} blogPosts={blogPosts} />
          </Suspense>
        ) : (
          <HomeBelowFoldSkeleton />
        )}
      </div>
    </div>
  );
};

export default Home;
