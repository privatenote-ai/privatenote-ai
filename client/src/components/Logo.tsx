import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/** PrivateNote mark: primary tile, cream envelope with blue-outlined flap. */
export function Logo({ className = '', size = 32 }: LogoProps) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#EDE6D8" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="14" className="fill-primary" />

      {/* Envelope / letter — nudged up so bbox is centred on the tile (32,32) */}
      <g transform="translate(0 -4.5)">
        <path
          d="M14 23 L32 39 L50 23 V50 H14Z"
          fill={`url(#${uid}-paper)`}
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="0.85"
        />
        <path
          d="M14 23 L32 39 L50 23Z"
          fill={`url(#${uid}-paper)`}
          fillOpacity={0.97}
        />
        <path
          d="M14 23 L32 39 L50 23"
          fill="none"
          className="stroke-primary"
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
