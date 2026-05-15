/** Placeholder while Key Features loads inside the below-fold band. */
export function HomeKeyFeaturesSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto h-8 w-40 rounded-md bg-gray-200/80 dark:bg-gray-700/50" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-xl border border-gray-200/60 bg-white/80 dark:border-gray-700/60 dark:bg-gray-900/50"
          />
        ))}
      </div>
    </div>
  );
}
