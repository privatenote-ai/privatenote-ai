/** Minimal “more below” hint before Key Features lazy-loads (title crest only). */
export function HomeKeyFeaturesPeek({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8" aria-hidden>
      <div className="h-9 overflow-hidden">
        <p className="text-center text-3xl font-bold leading-9 text-gray-900/50 dark:text-white/45">
          {title}
        </p>
      </div>
      <div className="h-5 sm:h-6" />
    </div>
  );
}
