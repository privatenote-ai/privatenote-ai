import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";

type NpmVersionBadgeProps = {
  packageName: string;
  fallbackVersion?: string;
};

export function NpmVersionBadge({ packageName, fallbackVersion = "0.1.0" }: NpmVersionBadgeProps) {
  const [version, setVersion] = useState(fallbackVersion);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { version?: string };
        if (!cancelled && data.version) {
          setVersion(data.version);
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [packageName]);

  return (
    <a
      href={`https://www.npmjs.com/package/${packageName}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-[#cb3837]/25 bg-[#cb3837]/8 px-2.5 py-0.5 text-xs font-semibold text-[#cb3837] transition-colors hover:border-[#cb3837]/40 hover:bg-[#cb3837]/12 dark:border-[#cb3837]/35 dark:bg-[#cb3837]/15 dark:text-[#f87171] dark:hover:bg-[#cb3837]/20"
    >
      <Package className="h-3 w-3 shrink-0" aria-hidden />
      <span className="font-mono">
        {packageName}@{version}
      </span>
    </a>
  );
}
