import React from "react";

type DeveloperIntegrationScreenshotProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function DeveloperIntegrationScreenshot({
  src,
  alt,
  caption,
}: DeveloperIntegrationScreenshotProps) {
  return (
    <figure className="mb-14 lg:mb-16">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="mx-auto block h-auto w-full max-w-md"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-md text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
