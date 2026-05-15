import React, { Suspense, lazy, useMemo, useState } from 'react';
import { NoteResult } from '@/components/note/NoteResult';
import { CreateNoteHomeSkeleton } from '@/components/note/CreateNoteHomeSkeleton';
import { HomeBelowFoldSkeleton } from '@/components/home/HomeBelowFoldSkeleton';
import { HomeKeyFeaturesSkeleton } from '@/components/home/HomeKeyFeaturesSkeleton';
import { HomeKeyFeaturesPeek } from '@/components/home/HomeKeyFeaturesPeek';
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

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const noteUrl = '';
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const { t, language } = useLanguage();
  const [keyFeaturesRef, keyFeaturesMounted] = useMountWhenInView({ rootMargin: '240px' });
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

  const handleCreateNew = () => {
    setShowCreateNote(true);
  };

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} min-w-0 max-w-full overflow-x-clip pb-20`}>
      {!isCreateSuccessView && (
        <section className="relative isolate mx-auto max-w-4xl overflow-x-clip px-4 pb-0 sm:px-6 lg:px-8">
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

      <div
        className={`${isCreateSuccessView ? 'mt-0' : 'mt-8'} min-w-0 px-4 py-4 pb-10 sm:px-6 sm:pb-14 lg:px-8`}
      >
        <div className="mx-auto min-w-0 max-w-4xl">
          {showCreateNote ? (
            <Suspense fallback={<CreateNoteHomeSkeleton />}>
              <CreateNote onSuccessStateChange={setIsCreateSuccessView} />
            </Suspense>
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      <section
        ref={keyFeaturesRef}
        className="relative isolate mt-4 overflow-x-clip sm:mt-6"
        aria-labelledby="key-features-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-background via-background/95 to-gray-50/70 sm:h-36 dark:via-background/92 dark:to-gray-950/50"
        />
        <div className="relative z-10 border-b border-gray-200/45 bg-gradient-to-b from-gray-50/25 via-gray-50/70 to-gray-50/90 dark:border-gray-800/45 dark:from-gray-950/15 dark:via-gray-950/45 dark:to-gray-950/65">
          {keyFeaturesMounted ? (
            <Suspense fallback={<HomeKeyFeaturesSkeleton />}>
              <SecurityFeatures className="pt-5 pb-10 sm:pt-6 sm:pb-12" />
            </Suspense>
          ) : (
            <HomeKeyFeaturesPeek title={t.keyFeatures} />
          )}
        </div>
      </section>

      <Suspense fallback={<HomeBelowFoldSkeleton />}>
        <HomeBelowFold t={t} blogPath={blogPath} blogPosts={blogPosts} />
      </Suspense>
    </div>
  );
};

export default Home;
