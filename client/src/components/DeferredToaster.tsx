import { Suspense, lazy, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);

/** Toast UI (Radix + close icon) is only needed after a toast is actually queued. */
export function DeferredToaster() {
  const { toasts } = useToast();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (toasts.length > 0) setReady(true);
  }, [toasts.length]);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <Toaster />
    </Suspense>
  );
}
