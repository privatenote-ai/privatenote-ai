import React from "react";
import { ArrowRight } from "lucide-react";

export type HowAiFlowStep = {
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "cloud";
};

export function HowAiFlowSteps({
  steps,
  cycleDurationS,
  className = "",
}: {
  steps: HowAiFlowStep[];
  cycleDurationS: number;
  className?: string;
}) {
  const stepCount = steps.length;
  const flowStyle = {
    "--how-ai-cycle": `${cycleDurationS}s`,
    "--how-ai-steps": stepCount,
  } as React.CSSProperties;

  return (
    <div
      className={`how-ai-flow-stage ${className}`.trim()}
      style={flowStyle}
      aria-hidden
    >
      <div className="how-ai-flow">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            {i > 0 ? (
              <div
                className="how-ai-flow-arrow"
                style={{
                  animationDuration: `${cycleDurationS}s`,
                  animationDelay: `${(i / stepCount) * cycleDurationS}s`,
                }}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              </div>
            ) : null}
            <div
              className={`how-ai-step how-ai-step--${step.variant}`}
              style={{
                animationDuration: `${cycleDurationS}s`,
                animationDelay: `${(i / stepCount) * cycleDurationS}s`,
              }}
            >
              <span
                className="how-ai-step__icon"
                style={{
                  animationDuration: `${cycleDurationS}s`,
                  animationDelay: `${(i / stepCount) * cycleDurationS}s`,
                }}
              >
                {step.icon}
              </span>
              <span className="how-ai-step__label">{step.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function HowAiFlowStepGuide({
  title,
  steps,
  variant,
  animateMarkers = false,
  cycleDurationS = 18,
  className = "",
}: {
  title: string;
  steps: { label: string; detail: string }[];
  variant: "private" | "cloud";
  animateMarkers?: boolean;
  cycleDurationS?: number;
  className?: string;
}) {
  const isPrivate = variant === "private";
  const stepCount = steps.length;

  return (
    <div
      className={`how-ai-flow-guide ${className} ${
        isPrivate ? "border-primary/15" : "border-red-200/60 dark:border-red-900/50"
      }`.trim()}
      style={{ "--how-ai-cycle": `${cycleDurationS}s` } as React.CSSProperties}
    >
      <p
        className={`mb-6 text-center text-xs font-semibold uppercase tracking-[0.14em] ${
          isPrivate ? "text-primary" : "text-red-700 dark:text-red-200"
        }`}
      >
        {title}
      </p>
      <ol
        className={`how-ai-flow-path how-ai-flow-path--${stepCount} mx-auto max-w-xl ${
          isPrivate ? "how-ai-flow-path--private" : "how-ai-flow-path--cloud"
        } ${animateMarkers ? "how-ai-flow-path--animated" : ""}`.trim()}
      >
        {steps.map((step, i) => (
          <li key={step.label} className="how-ai-flow-path__step">
            <div
              className={`how-ai-flow-path__marker${animateMarkers ? " how-ai-flow-path__marker--animated" : ""}`}
              style={
                animateMarkers
                  ? {
                      animationDuration: `${cycleDurationS}s`,
                      animationDelay: `${(i / stepCount) * cycleDurationS}s`,
                    }
                  : undefined
              }
              aria-hidden
            >
              {i + 1}
            </div>
            <div className="how-ai-flow-path__content min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{step.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowAiPrivacyTicker({
  segments,
  variant,
  className = "",
  fullBleed = true,
}: {
  segments: [string, string];
  variant: "private" | "cloud";
  className?: string;
  fullBleed?: boolean;
}) {
  const noteTone =
    variant === "private"
      ? "how-ai-privacy-note--private text-primary dark:text-primary-foreground"
      : "how-ai-privacy-note--cloud text-red-700 dark:text-red-200";

  const loopSegments = [...segments, ...segments] as const;

  return (
    <div
      className={`how-ai-privacy-note ${noteTone} w-full self-stretch text-lg font-semibold leading-tight sm:text-xl md:text-2xl ${
        fullBleed ? "how-ai-privacy-note--full-bleed max-w-none" : "max-w-3xl"
      } ${className}`.trim()}
    >
      <p className="sr-only">{segments.join(" ")}</p>
      <div className="how-ai-privacy-ticker" aria-hidden>
        <div className="how-ai-privacy-ticker__track">
          {loopSegments.map((segment, index) => (
            <React.Fragment key={`${segment}-${index}`}>
              {index > 0 ? (
                <span className="how-ai-privacy-ticker__sep" aria-hidden>
                  ·
                </span>
              ) : null}
              <span className="how-ai-privacy-ticker__text">{segment}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
