import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { NoteResult } from '@/components/note/NoteResult';
import { CreateNoteHomeSkeleton } from '@/components/note/CreateNoteHomeSkeleton';
import { HomeBelowFoldSkeleton } from '@/components/home/HomeBelowFoldSkeleton';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';
import { useMountWhenInView } from '@/hooks/useMountWhenInView';
import { scheduleAfterLcp } from '@/utils/scheduleAfterLcp';

const CreateNote = lazy(() =>
  import('@/components/note/CreateNote').then((m) => ({ default: m.CreateNote })),
);
const HomeBelowFold = lazy(() => import('@/pages/HomeBelowFold'));

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const noteUrl = '';
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const [createNoteReady, setCreateNoteReady] = useState(false);
  const [belowFoldRef, belowFoldMounted] = useMountWhenInView({ rootMargin: '320px' });
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

  useEffect(() => {
    if (createNoteReady) return;

    const activate = () => setCreateNoteReady(true);
    const cancelLcp = scheduleAfterLcp(activate);

    const interactionOpts = { capture: true, passive: true, once: true } as const;
    window.addEventListener('pointerdown', activate, interactionOpts);
    window.addEventListener('keydown', activate, interactionOpts);

    return () => {
      cancelLcp();
    };
  }, [createNoteReady]);

  const handleCreateNew = () => {
    setShowCreateNote(true);
    setCreateNoteReady(true);
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
            <h1 className="page-title text-gray-900 dark:text-white" data-lcp-element>
              <span className="block">{t.homeHeroLine1}</span>
              <span className="block mt-1 text-primary">{t.homeHeroLine2}</span>
            </h1>
            <p className="mt-3 max-w-4xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-5xl">
              {t.homeHeroSubtitle}
            </p>
          </div>
        </section>
      )}

      <div className={`${isCreateSuccessView ? "mt-0" : "mt-8"} mb-8 min-w-0 px-4 py-4 sm:px-6 lg:px-8`}>
        <div className="mx-auto min-w-0 max-w-4xl">
          {showCreateNote ? (
            createNoteReady ? (
              <Suspense fallback={<CreateNoteHomeSkeleton />}>
                <CreateNote onSuccessStateChange={setIsCreateSuccessView} />
              </Suspense>
            ) : (
              <CreateNoteHomeSkeleton />
            )
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      <div ref={belowFoldRef} className="min-h-[1px]">
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