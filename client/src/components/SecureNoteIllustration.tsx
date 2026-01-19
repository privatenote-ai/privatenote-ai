// SecureNoteIllustration.tsx
// Drop-in SVG illustration with subtle, "security calm" animation.
// Tailwind required. No external deps.
//
// Usage:
//   <SecureNoteIllustration />
//   <SecureNoteIllustration caption="Your words stay on your device. Encryption happens before anything leaves it." />

import React from "react";

type SecureNoteIllustrationProps = {
  caption?: string;
  className?: string;
};

export function SecureNoteIllustration({
  caption = "Your words stay on your device. Encryption happens before anything leaves it.",
  className = "",
}: SecureNoteIllustrationProps) {
  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex flex-col items-center text-center">
        {/* Local keyframes (scoped, no global CSS needed) */}
        <style>{`
          @keyframes floatSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes lockPulse { 0%,100% { opacity: .35; } 50% { opacity: .65; } }
          @keyframes shimmer { 0% { stroke-dashoffset: 120; } 100% { stroke-dashoffset: 0; } }
        `}</style>

        <div className="motion-reduce:transform-none motion-reduce:animate-none">
          <svg
            viewBox="0 0 360 200"
            className="h-44 w-full max-w-md text-gray-700 dark:text-gray-200 animate-[floatSlow_6s_ease-in-out_infinite] motion-reduce:animate-none"
            aria-hidden="true"
            focusable="false"
          >
            {/* Card */}
            <rect
              x="12"
              y="18"
              width="220"
              height="150"
              rx="18"
              fill="currentColor"
              fillOpacity="0.04"
            />
            <rect
              x="28"
              y="36"
              width="188"
              height="20"
              rx="10"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <rect
              x="28"
              y="68"
              width="156"
              height="16"
              rx="8"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <rect
              x="28"
              y="96"
              width="168"
              height="16"
              rx="8"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <rect
              x="28"
              y="124"
              width="120"
              height="16"
              rx="8"
              fill="currentColor"
              fillOpacity="0.08"
            />

            {/* Lock halo (pulse) */}
            <circle
              cx="270"
              cy="92"
              r="40"
              fill="currentColor"
              fillOpacity="0.06"
              className="animate-[lockPulse_3.5s_ease-in-out_infinite] motion-reduce:animate-none"
            />

            {/* Shackle */}
            <path
              d="M252 96v-12c0-8.3 6.7-15 15-15s15 6.7 15 15v12"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Lock body (pulse) */}
            <rect
              x="248"
              y="96"
              width="38"
              height="32"
              rx="8"
              fill="currentColor"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="3"
              className="animate-[lockPulse_3.5s_ease-in-out_infinite] motion-reduce:animate-none"
            />
            <circle cx="267" cy="112" r="3.5" fill="currentColor" fillOpacity="0.45" />

            {/* Encryption flow (dashed shimmer) */}
            <path
              d="M200 154c18 8 38 12 60 12 36 0 68-11 96-32"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6 10"
              className="animate-[shimmer_4s_linear_infinite] motion-reduce:animate-none"
              style={{ strokeDashoffset: 120 }}
            />
          </svg>
        </div>

        {caption ? (
          <p className="mt-3 max-w-sm text-xs text-gray-500 dark:text-gray-400">
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  );
}
