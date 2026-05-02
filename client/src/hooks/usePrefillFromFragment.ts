import { useState, useLayoutEffect } from "react";

/** Maximum characters accepted from a URL fragment prefill. */
const PREFILL_MAX_CHARS = 10_000;

/** Maximum display length for the referrer / brand name. */
const REFERRER_MAX_CHARS = 60;

/** sessionStorage key written by prefill-guard.js. */
const PREFILL_SS_KEY = "__pn_prefill_v1";

/**
 * The URL fragment prefix that signals an external prefill.
 * Full format: https://privatenote.ai/#text=my%20secret&from=passwrds.lu
 */
const PREFILL_HASH_PREFIX = "#text=";

/**
 * Module-level cache of the raw hash string.
 *
 * React StrictMode double-invokes component functions and useState initializers.
 * Without a cache, the first invocation deletes the sessionStorage entry, and
 * the second invocation sees nothing — returning null and losing the prefill.
 *
 * The cache stores the raw hash string from the first read. A setTimeout(0)
 * clears it after the synchronous render cycle so subsequent mounts (e.g. the
 * user navigates away and back to /) start fresh without stale data.
 *
 * `undefined`  = not yet read this page load
 * `""`         = read and found nothing (or already expired after first mount)
 * `"#text=..."` = the raw hash captured by prefill-guard.js
 */
let _prefillHashCache: string | undefined = undefined;

function getAndClearPrefillHash(): string {
  // Cache hit — StrictMode second invocation (or any re-render) returns same value.
  if (_prefillHashCache !== undefined) {
    return _prefillHashCache;
  }

  let hash = "";

  // Primary path: prefill-guard.js already moved the hash here and wiped the URL.
  try {
    const saved = sessionStorage.getItem(PREFILL_SS_KEY);
    if (saved) {
      sessionStorage.removeItem(PREFILL_SS_KEY);
      hash = saved;
    }
  } catch (_) {
    // sessionStorage unavailable — fall through to the direct hash read below.
  }

  // Fallback: guard script didn't run (e.g. dev server that doesn't serve
  // client/public/ files, or sessionStorage was blocked). Read directly.
  if (!hash) {
    hash = window.location.hash || "";
  }

  _prefillHashCache = hash;

  // Clear the cache after the current synchronous tick so that:
  // - StrictMode's second synchronous invocation still gets the cached value.
  // - A later remount (user navigates away and back) starts fresh.
  setTimeout(() => {
    _prefillHashCache = "";
  }, 0);

  return hash;
}

/**
 * Sanitize the `from` attribution string so it is safe to display in the UI
 * and store in analytics. Allows letters, digits, dots, hyphens, underscores,
 * and spaces only — strips everything else.
 */
export function sanitizeReferrer(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9.\-_ ]/g, "").slice(0, REFERRER_MAX_CHARS).trim();
}

export interface PrefillState {
  /** The decoded prefill text, or null if no prefill was detected on page load. */
  prefillText: string | null;
  /**
   * The sanitized attribution string from `&from=` (e.g. "passwrds.lu"), or
   * null if no `from` parameter was present.
   */
  referrer: string | null;
  /** Whether the prefill info banner should be visible. */
  showBanner: boolean;
  /** Dismiss the info banner without clearing the textarea content. */
  dismissBanner: () => void;
  /** Hide the banner (e.g. when the user starts a new note after submitting). */
  resetPrefill: () => void;
}

/**
 * Reads the `#text=<secret>&from=<name>` prefill written by prefill-guard.js
 * into sessionStorage, clears it immediately, and returns structured prefill
 * state.
 *
 * Security properties:
 * - prefill-guard.js (a synchronous <head> script) moves the fragment to
 *   sessionStorage and wipes the URL BEFORE Turnstile or any other third-party
 *   script executes.
 * - sessionStorage is deleted on the very first read here.
 * - The `referrer` value is sanitized to safe display characters only.
 * - We never log the decoded secret value.
 * - The caller must not forward prefillText to analytics or any API until the
 *   user explicitly submits the note creation form.
 */
export function usePrefillFromFragment(): PrefillState {
  const [{ prefillText, referrer }] = useState<{
    prefillText: string | null;
    referrer: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return { prefillText: null, referrer: null };
    }

    const hash = getAndClearPrefillHash();

    if (!hash.startsWith(PREFILL_HASH_PREFIX)) {
      return { prefillText: null, referrer: null };
    }

    const afterPrefix = hash.slice(PREFILL_HASH_PREFIX.length);
    const fromIdx = afterPrefix.indexOf("&from=");
    const encodedSecret = fromIdx === -1 ? afterPrefix : afterPrefix.slice(0, fromIdx);

    // Parse secret
    let prefillText: string | null = null;
    try {
      if (encodedSecret) {
        const decoded = decodeURIComponent(encodedSecret);
        prefillText =
          decoded.length > PREFILL_MAX_CHARS ? decoded.slice(0, PREFILL_MAX_CHARS) : decoded;
      }
    } catch (_) {
      // Malformed URI — do not log.
    }

    // Parse referrer
    let referrer: string | null = null;
    if (fromIdx !== -1) {
      try {
        const encodedFrom = afterPrefix.slice(fromIdx + "&from=".length);
        if (encodedFrom) {
          const sanitized = sanitizeReferrer(decodeURIComponent(encodedFrom));
          referrer = sanitized || null;
        }
      } catch (_) {
        // Malformed URI — ignore.
      }
    }

    return { prefillText, referrer };
  });

  const [showBanner, setShowBanner] = useState<boolean>(() => prefillText !== null);

  // Fallback URL cleanup: if the guard script didn't run and the fragment is
  // still in the address bar, clear it before the first paint.
  useLayoutEffect(() => {
    if (prefillText !== null && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [prefillText]);

  const dismissBanner = () => setShowBanner(false);
  const resetPrefill = () => setShowBanner(false);

  return { prefillText, referrer, showBanner, dismissBanner, resetPrefill };
}
