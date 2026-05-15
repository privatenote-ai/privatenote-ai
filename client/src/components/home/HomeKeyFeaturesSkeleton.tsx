/** Placeholder while Key Features loads — spacing aligned with SecurityFeatures + Home.tsx overrides. */
export function HomeKeyFeaturesSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto max-w-4xl px-4 pt-5 pb-10 sm:px-6 sm:pt-6 sm:pb-12 lg:px-8"
    >
      <div className="mb-8 text-center sm:mb-12">
        <div className="mx-auto h-9 w-44 rounded-md bg-gray-200/80 dark:bg-gray-700/50" />
        <div className="mx-auto mt-2 h-4 max-w-md rounded-md bg-gray-200/60 dark:bg-gray-700/40" />
      </div>
      <div className="hidden gap-5 sm:grid sm:grid-cols-2 md:grid-cols-3 xl:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[9.25rem] rounded-xl border border-gray-200/60 bg-white/80 dark:border-gray-700/60 dark:bg-gray-900/50"
          />
        ))}
      </div>
      <div className="space-y-4 sm:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[5.5rem] rounded-lg border border-gray-200/60 bg-white/80 dark:border-gray-700/60 dark:bg-gray-900/50"
          />
        ))}
      </div>
      <div className="mx-auto mt-10 h-3 max-w-xs rounded-md bg-gray-200/50 dark:bg-gray-700/35" />
    </div>
  );
}
