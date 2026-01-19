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
        <div>
          <svg
            width="360"
            height="200"
            viewBox="0 0 360 200"
            fill="none"
            className="h-44 w-full max-w-md"
            role="img"
            aria-label="Secure note with encryption illustration"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Document Card */}
            <g id="doc">
              <rect
                x="30"
                y="40"
                width="120"
                height="120"
                rx="12"
                fill="hsl(var(--secondary))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
            </g>

            {/* Text Bars */}
            <g id="bars">
              {/* Title bar */}
              <rect
                x="50"
                y="65"
                width="60"
                height="8"
                rx="4"
                fill="hsl(var(--muted-foreground))"
                fillOpacity="0.7"
              />

              {/* Content bars */}
              <rect
                x="50"
                y="85"
                width="80"
                height="6"
                rx="3"
                fill="hsl(var(--muted))"
              />
              <rect
                x="50"
                y="100"
                width="75"
                height="6"
                rx="3"
                fill="hsl(var(--muted))"
              />
              <rect
                x="50"
                y="115"
                width="70"
                height="6"
                rx="3"
                fill="hsl(var(--muted))"
              />
              <rect
                x="50"
                y="130"
                width="55"
                height="6"
                rx="3"
                fill="hsl(var(--border))"
              />
            </g>

            {/* Transfer Line (curved dashed) */}
            <g id="transfer">
              <path
                d="M 165 100 Q 215 80, 250 100"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.6"
                strokeWidth="2"
                strokeDasharray="6 8"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* Lock Halo */}
            <g id="halo">
              <circle
                cx="290"
                cy="100"
                r="35"
                fill="hsl(var(--primary))"
                opacity="0.12"
              />
            </g>

            {/* Lock */}
            <g id="lock">
              {/* Lock body */}
              <rect
                x="275"
                y="100"
                width="30"
                height="25"
                rx="4"
                fill="hsl(var(--primary))"
              />

              {/* Lock shackle */}
              <path
                d="M 280 100 V 92 Q 280 85, 287 85 H 293 Q 300 85, 300 92 V 100"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Keyhole accent */}
              <circle
                cx="290"
                cy="109"
                r="3"
                fill="hsl(var(--primary-foreground))"
                fillOpacity="0.9"
              />
              <rect
                x="289"
                y="110"
                width="2"
                height="6"
                rx="1"
                fill="hsl(var(--primary-foreground))"
                fillOpacity="0.9"
              />
            </g>

            {/* Spark Dots */}
            <g id="dots">
              <circle
                cx="318"
                cy="80"
                r="2.5"
                fill="hsl(var(--primary))"
                fillOpacity="0.7"
              />
              <circle
                cx="326"
                cy="95"
                r="2"
                fill="hsl(var(--primary))"
                fillOpacity="0.5"
              />
              <circle
                cx="322"
                cy="118"
                r="2.5"
                fill="hsl(var(--primary))"
                fillOpacity="0.8"
              />
            </g>
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
