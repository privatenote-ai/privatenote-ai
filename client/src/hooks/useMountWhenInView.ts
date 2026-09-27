import { useEffect, useRef, useState, type RefObject } from "react";

type UseMountWhenInViewOptions = {
  rootMargin?: string;
  threshold?: number;
};

/**
 * Returns true once the target element intersects the viewport (with optional root margin).
 * Use to defer layout-measuring widgets (carousels, accordions) until users scroll near them.
 */
export function useMountWhenInView(
  options: UseMountWhenInViewOptions = {},
): [ref: RefObject<HTMLDivElement>, mounted: boolean] {
  const { rootMargin = "320px", threshold = 0 } = options;
  const ref = useRef<HTMLDivElement>(null!);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootMargin, threshold]);

  return [ref, mounted];
}
