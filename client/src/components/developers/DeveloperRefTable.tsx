import React from "react";
import type { DevRefRow } from "@/components/developers/types";

type DeveloperRefTableProps = {
  title: string;
  rows: DevRefRow[];
};

export function DeveloperRefTable({ title, rows }: DeveloperRefTableProps) {
  return (
    <section className="mt-16 lg:mt-20">
      <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/60">
            <tr>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 sm:px-5"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 sm:px-5"
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950/40">
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-primary sm:px-5 sm:text-sm">
                  {row.name}
                </td>
                <td className="px-4 py-3.5 leading-relaxed text-gray-600 dark:text-gray-400 sm:px-5">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
