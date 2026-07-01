import { useCallback, useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

interface Ring {
  id: number;
  born: number;
}

function useGravityRipples() {
  const [rings, setRings] = useState<Ring[]>([]);
  const rafRef = useRef(0);

  const addRing = useCallback(() => {
    setRings((r) => [...r, { id: Date.now() + Math.random(), born: performance.now() }]);
  }, []);

  useEffect(() => {
    function tick(now: number) {
      rafRef.current = requestAnimationFrame(tick);
      setRings((prev) => prev.filter((r) => now - r.born < 2500));
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { rings, addRing };
}

type GravityDropZoneProps = {
  children: React.ReactNode;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  ariaLabel: string;
  dropTitle: string;
  dropTitleDragging: string;
  subtitle: string;
};

const STATIC_RINGS = [240, 200, 160, 120, 84] as const;

export function GravityDropZone({
  children,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  ariaLabel,
  dropTitle,
  dropTitleDragging,
  subtitle,
}: GravityDropZoneProps) {
  const { rings, addRing } = useGravityRipples();

  // Idle ripple every ~5–7s
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    function schedule() {
      timeoutId = setTimeout(
        () => { addRing(); schedule(); },
        5000 + Math.random() * 2000,
      );
    }
    schedule();
    return () => clearTimeout(timeoutId);
  }, [addRing]);

  // Burst on drag-over
  useEffect(() => {
    if (!isDragOver) return;
    addRing();
    const t = setTimeout(addRing, 300);
    return () => clearTimeout(t);
  }, [isDragOver, addRing]);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="relative flex flex-col items-center py-4 select-none"
    >
      {/* Title + subtitle above the rings */}
      <h2 className="text-3xl font-semibold text-primary dark:text-primary/90">
        {isDragOver ? dropTitleDragging : dropTitle}
      </h2>
      <p className="mt-1.5 mb-5 flex items-center gap-1.5 text-sm font-medium text-primary dark:text-primary/80">
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {subtitle}
      </p>

      {/* Open gravity aperture — no card/box */}
      <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>

        {/* Static breathing concentric rings */}
        {STATIC_RINGS.map((size, i) => (
          <div
            key={size}
            aria-hidden
            className="animate-ring-breathe absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: `1px solid hsl(var(--primary) / ${0.08 + i * 0.04})`,
              animationDelay: `${i * 0.45}s`,
            }}
          />
        ))}

        {/* Expanding ripple rings */}
        {rings.map((r) => (
          <div
            key={r.id}
            aria-hidden
            className="animate-gravity-ring pointer-events-none absolute rounded-full"
            style={{
              width: isDragOver ? 320 : 260,
              height: isDragOver ? 320 : 260,
              border: "1px solid hsl(var(--primary) / 0.35)",
              left: "50%",
              top: "50%",
            }}
          />
        ))}

        {/* Glowing centre dot */}
        <div
          className={[
            "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300",
            isDragOver
              ? "bg-primary/30 shadow-[0_0_24px_hsl(var(--primary)/0.5)] ring-2 ring-primary/60"
              : "bg-primary/15 shadow-[0_0_12px_hsl(var(--primary)/0.25)] ring-1 ring-primary/30",
          ].join(" ")}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary/70" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex w-full justify-center gap-4 sm:flex-row">{children}</div>
    </div>
  );
}
