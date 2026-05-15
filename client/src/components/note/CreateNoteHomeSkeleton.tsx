/** Placeholder matching default write-mode CreateNote height to avoid CLS on homepage load. */
export function CreateNoteHomeSkeleton() {
  return (
    <section
      aria-hidden
      className="mx-auto w-full min-w-0 max-w-full min-h-[500px] rounded-2xl border border-gray-200 bg-white/90 dark:border-gray-700 dark:bg-gray-900/90"
    >
      <div className="p-4 pt-5">
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
          <div className="h-12 flex-1 border-b-2 border-primary/40 bg-primary/5" />
          <div className="h-12 flex-1" />
        </div>
        <div className="mb-2 h-4 w-32 rounded bg-gray-200/80 dark:bg-gray-700/80" />
        <div className="mb-4 h-[156px] w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50" />
        <div className="space-y-3">
          <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
          <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="h-11 w-full rounded-lg bg-gray-100 dark:bg-gray-800 sm:w-44" />
          <div className="h-11 w-full rounded-lg bg-primary/20 sm:w-44" />
        </div>
      </div>
    </section>
  );
}
