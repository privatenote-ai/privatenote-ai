import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type MatrixCellTone = "best" | "caution" | "neutral" | "mono";

type MatrixRow = {
  labelKey: string;
  cells: { valueKey: string; tone: MatrixCellTone }[];
};

const COLUMN_KEYS = [
  "devMatrixColumnEditor",
  "devMatrixColumnBrowser",
  "devMatrixColumnTerminal",
  "devMatrixColumnAgent",
] as const;

const MATRIX_ROWS: MatrixRow[] = [
  {
    labelKey: "devMatrixRowSecretContext",
    cells: [
      { valueKey: "devMatrixCellSecretEditor", tone: "best" },
      { valueKey: "devMatrixCellSecretBrowser", tone: "best" },
      { valueKey: "devMatrixCellSecretTerminal", tone: "best" },
      { valueKey: "devMatrixCellSecretAgent", tone: "caution" },
    ],
  },
  {
    labelKey: "devMatrixRowPipedCi",
    cells: [
      { valueKey: "devMatrixCellPipedEditor", tone: "neutral" },
      { valueKey: "devMatrixCellPipedBrowser", tone: "neutral" },
      { valueKey: "devMatrixCellPipedTerminal", tone: "best" },
      { valueKey: "devMatrixCellPipedAgent", tone: "neutral" },
    ],
  },
  {
    labelKey: "devMatrixRowNoInstall",
    cells: [
      { valueKey: "devMatrixCellNoInstallEditor", tone: "neutral" },
      { valueKey: "devMatrixCellNoInstallBrowser", tone: "best" },
      { valueKey: "devMatrixCellNoInstallTerminal", tone: "mono" },
      { valueKey: "devMatrixCellNoInstallAgent", tone: "mono" },
    ],
  },
  {
    labelKey: "devMatrixRowSelectedText",
    cells: [
      { valueKey: "devMatrixCellSecretEditor", tone: "best" },
      { valueKey: "devMatrixCellSecretBrowser", tone: "best" },
      { valueKey: "devMatrixCellPipedEditor", tone: "neutral" },
      { valueKey: "devMatrixCellPipedAgent", tone: "neutral" },
    ],
  },
  {
    labelKey: "devMatrixRowSelfHostedApi",
    cells: [
      { valueKey: "devMatrixCellSelfHostedEditor", tone: "best" },
      { valueKey: "devMatrixCellSelfHostedBrowser", tone: "neutral" },
      { valueKey: "devMatrixCellSelfHostedTerminal", tone: "best" },
      { valueKey: "devMatrixCellSelfHostedAgent", tone: "best" },
    ],
  },
];

const cellToneClass: Record<MatrixCellTone, string> = {
  best: "font-semibold text-primary",
  caution: "font-semibold text-amber-600 dark:text-amber-400",
  neutral: "text-gray-400 dark:text-gray-500",
  mono: "font-mono text-sm text-gray-700 dark:text-gray-300",
};

export function DeveloperComparisonMatrix() {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="min-w-[36rem] w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900/60">
          <tr>
            <th
              scope="col"
              className="w-[34%] px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300 sm:px-5"
            >
              {t.devMatrixConstraintColumn}
            </th>
            {COLUMN_KEYS.map((key) => (
              <th
                key={key}
                scope="col"
                className="whitespace-nowrap px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300 sm:px-5"
              >
                {t[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950/40">
          {MATRIX_ROWS.map((row) => (
            <tr key={row.labelKey}>
              <th
                scope="row"
                className="px-4 py-4 font-medium leading-snug text-gray-950 dark:text-white sm:px-5"
              >
                {t[row.labelKey]}
              </th>
              {row.cells.map((cell) => (
                <td key={cell.valueKey} className="whitespace-nowrap px-4 py-4 sm:px-5">
                  <span className={cellToneClass[cell.tone]}>{t[cell.valueKey]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-y-2 border-t border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-5">
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t.devMatrixMcpCaveat}</p>
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t.devMatrixSelfHostedCaveat}</p>
      </div>
    </div>
  );
}
