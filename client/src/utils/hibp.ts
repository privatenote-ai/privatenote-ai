export type HibpEntry = {
  suffix: string;
  count: number;
  isPadding: boolean;
  matches: boolean;
};

type HibpFoundResult = {
  status: "found";
  count?: number;
  entries: HibpEntry[];
};

type HibpNotFoundResult = {
  status: "not_found";
  entries: HibpEntry[];
};

type HibpErrorResult = {
  status: "error";
  reason: string;
  code?: number;
};

export type HibpResult = HibpFoundResult | HibpNotFoundResult | HibpErrorResult;

export async function checkHIBP(
  password: string,
  signal?: AbortSignal,
  opts?: { timeoutMs?: number },
): Promise<HibpResult> {
  try {
    // compute uppercase hex SHA-1
    const sha1Hex = await sha1UpperHex(password);
    const prefix = sha1Hex.slice(0, 5); // sending case-insensitive prefix is fine
    const suffix = sha1Hex.slice(5); // already UPPERCASE

    // timeout handling
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      opts?.timeoutMs ?? 8000,
    );
    const compositeSignal = mergeSignals(signal, controller.signal);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: "GET",
      signal: compositeSignal,
      // No credentials; HIBP supports CORS with Access-Control-Allow-Origin: *
      headers: {
        Accept: "text/plain",
        "Add-Padding": "true",
      },
    });

    clearTimeout(timeout);

    // HTTP-level handling
    if (res.status === 429) {
      return { status: "error", reason: "rate_limited", code: 429 };
    }
    if (!res.ok) {
      return { status: "error", reason: `HTTP ${res.status}`, code: res.status };
    }

    const text = await res.text();
    if (!text) {
      return { status: "not_found", entries: [] };
    }

    const entries: HibpEntry[] = [];
    let matchedCount: number | undefined;

    // robust parsing (handles \r\n)
    for (const line of text.split(/\r?\n/)) {
      if (!line) continue;
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const rawSuffix = line.slice(0, idx).trim().toUpperCase();
      const countStr = line.slice(idx + 1).trim();
      const parsedCount = Number(countStr);
      const count = Number.isFinite(parsedCount) ? parsedCount : 0;
      const isPadding = count === 0;
      const matches = rawSuffix === suffix && !isPadding;

      if (matches) {
        matchedCount = count;
      }

      entries.push({
        suffix: rawSuffix,
        count,
        isPadding,
        matches,
      });
    }

    if (matchedCount !== undefined) {
      return { status: "found", count: matchedCount, entries };
    }

    return { status: "not_found", entries };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { status: "error", reason: "aborted" };
    }
    // network/CORS/fetch failure bubbles here
    return {
      status: "error",
      reason: (err as Error).message ?? "fetch_failed",
    };
  }
}

/* helpers used above */

function mergeSignals(a?: AbortSignal, b?: AbortSignal): AbortSignal | undefined {
  if (!a) return b;
  if (!b) return a;
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (a.aborted || b.aborted) controller.abort();
  else {
    a.addEventListener("abort", onAbort, { once: true });
    b.addEventListener("abort", onAbort, { once: true });
  }
  return controller.signal;
}

const encoder = new TextEncoder();
async function sha1UpperHex(message: string): Promise<string> {
  const buf = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  const bytes = new Uint8Array(hash);
  let s = "";
  for (let i = 0; i < bytes.length; ++i) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s.toUpperCase();
}
