/** Reserves space for lazy-loaded homepage sections so the footer does not pop in later. */
export function HomeBelowFoldSkeleton() {
  return (
    <div aria-hidden className="space-y-16 pb-8">
      <div className="mx-auto h-[420px] max-w-4xl rounded-2xl bg-gray-100/70 dark:bg-gray-800/40" />
      <div className="mx-auto h-80 max-w-6xl rounded-2xl bg-gray-100/70 dark:bg-gray-800/40" />
      <div className="mx-auto h-[520px] max-w-4xl rounded-2xl bg-gray-100/70 dark:bg-gray-800/40" />
    </div>
  );
}
