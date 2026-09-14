import React from "react";
import type { PrivnoteAlternativeCopy } from "./copy.types";

type EncryptionFlowProps = {
  copy: PrivnoteAlternativeCopy;
};

export function EncryptionFlow({ copy }: EncryptionFlowProps) {
  const steps = [
    copy.securityFlowWrite,
    copy.securityFlowEncrypt,
    copy.securityFlowCiphertext,
    copy.securityFlowShare,
    copy.securityFlowDecrypt,
  ];

  return (
    <ol className="mt-10 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
      {steps.map((label, index) => (
        <li key={label} className="flex flex-1 flex-col md:flex-row md:items-stretch">
          <div className="flex min-h-[5.5rem] w-full flex-col items-center justify-center rounded-xl border border-gray-200/80 bg-white px-3 py-4 text-center shadow-sm dark:border-gray-700/80 dark:bg-gray-900">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-2 text-sm font-semibold leading-snug text-gray-900 dark:text-white">{label}</span>
          </div>
          {index < steps.length - 1 ? (
            <div className="flex items-center justify-center py-1 md:px-1.5" aria-hidden>
              <span className="block h-5 w-px bg-gray-300 dark:bg-gray-600 md:h-px md:w-5" />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
