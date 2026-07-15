import React from "react";
import type { DevIntegrationStatus } from "@/components/developers/types";

const STATUS_STYLES: Record<DevIntegrationStatus, string> = {
  stable:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  beta: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
};

type DeveloperStatusBadgeProps = {
  status: DevIntegrationStatus;
  label: string;
};

export function DeveloperStatusBadge({ status, label }: DeveloperStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}
