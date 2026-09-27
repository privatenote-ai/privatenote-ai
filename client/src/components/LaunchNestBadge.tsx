import React from "react";

/** Always-mounted so the badge is in page HTML, not the lazy homepage FAQ. */
export function LaunchNestBadge() {
  return (
    <div className="flex justify-center bg-background px-4 py-8 sm:py-10">
      <a
        href="https://launchnest.io/p/privatenote"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="PrivateNote on LaunchNest"
        className="inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      >
        <img
          src="https://launchnest.io/badge/privatenote.svg?variant=featured&theme=light"
          alt="PrivateNote on LaunchNest"
          width={220}
          height={56}
          className="h-14 w-[220px] dark:hidden"
          loading="lazy"
          decoding="async"
        />
        <img
          src="https://launchnest.io/badge/privatenote.svg?variant=featured&theme=dark"
          alt="PrivateNote on LaunchNest"
          width={220}
          height={56}
          className="hidden h-14 w-[220px] dark:block"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  );
}
