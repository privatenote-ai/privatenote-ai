import { Brain } from "lucide-react";

const NEURON_DOTS: { className: string; delayMs: number }[] = [
  { className: "left-[14%] top-[20%]", delayMs: 0 },
  { className: "right-[12%] top-[24%]", delayMs: 280 },
  { className: "left-[22%] bottom-[26%]", delayMs: 560 },
  { className: "right-[20%] bottom-[22%]", delayMs: 840 },
  { className: "left-1/2 top-[8%] -translate-x-1/2", delayMs: 420 },
  { className: "left-1/2 bottom-[12%] -translate-x-1/2", delayMs: 700 },
];

type ThinkingBrainIconProps = {
  /** Overall width/height of the graphic (square). */
  sizeClassName?: string;
  className?: string;
  /** `onPrimary`: light strokes/dots for `bg-primary` buttons. */
  tone?: "default" | "onPrimary";
};

/**
 * Brain glyph with staggered “neuron” dots that pulse on/off for a thinking state.
 */
export function ThinkingBrainIcon({
  sizeClassName = "h-14 w-14",
  className = "",
  tone = "default",
}: ThinkingBrainIconProps) {
  const dotClass =
    tone === "onPrimary"
      ? "bg-primary-foreground shadow-[0_0_5px_hsl(var(--primary-foreground)/0.55)]"
      : "bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.65)]";
  const brainClass = tone === "onPrimary" ? "text-primary-foreground" : "text-primary";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${sizeClassName} ${className}`}
      aria-hidden
    >
      {NEURON_DOTS.map(({ className: pos, delayMs }, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute h-1.5 w-1.5 rounded-full animate-neuron-pulse ${dotClass} ${pos}`}
          style={{ animationDelay: `${delayMs}ms` }}
        />
      ))}
      <Brain
        className={`relative z-[1] h-[58%] w-[58%] animate-brain-think opacity-95 ${brainClass}`}
        strokeWidth={1.35}
      />
    </div>
  );
}
