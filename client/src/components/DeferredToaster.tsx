import { Suspense, lazy, useEffect, useState } from "react";
import { scheduleAfterLcp } from "@/utils/scheduleAfterLcp";

const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);

/** Toast UI (Radix + close icon) is not needed for LCP; load after paint. */
export function DeferredToaster() {
  const [ready, setReady] = useState(false);

  useEffect(() => scheduleAfterLcp(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <Toaster />
    </Suspense>
  );
}
