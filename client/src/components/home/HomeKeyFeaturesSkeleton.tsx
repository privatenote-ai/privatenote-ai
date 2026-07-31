/** Placeholder while Key Features loads — spacing aligned with SecurityFeatures + Home.tsx overrides. */
export function HomeKeyFeaturesSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto max-w-4xl px-4 pt-8 pb-14 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 lg:pt-12 lg:pb-20"
    >
      <div className="mb-10 text-center sm:mb-14 lg:mb-16">
        <div className="mx-auto h-9 w-48 rounded-md bg-gray-200/80 dark:bg-gray-700/50" />
        <div className="mx-auto mt-2 h-4 max-w-md rounded-md bg-gray-200/60 dark:bg-gray-700/40" />
      </div>
      <div className="hidden gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-7 xl:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[204px] rounded-xl border border-gray-200/60 bg-white/80 dark:border-gray-700/60 dark:bg-gray-900/50"
          />
        ))}
      </div>
      <div className="space-y-5 sm:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[112px] rounded-lg border border-gray-200/60 bg-white/80 dark:border-gray-700/60 dark:bg-gray-900/50"
          />
        ))}
      </div>
      <div className="mx-auto mt-14 h-3 max-w-xs rounded-md bg-gray-200/50 dark:bg-gray-700/35 sm:mt-16" />
    </div>
  );
}
