/** Minimal “more below” hint before Key Features lazy-loads (title crest only). */
export function HomeKeyFeaturesPeek({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" aria-hidden>
      <div className="h-8 overflow-hidden sm:h-9">
        <p className="translate-y-0.5 text-center text-[1.625rem] font-bold leading-none tracking-tight text-gray-900/50 dark:text-white/45 sm:text-3xl">
          {title}
        </p>
      </div>
      <div className="h-5 sm:h-6" />
    </div>
  );
}
