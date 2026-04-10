import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "privatenote-theme";
export type ThemePreference = "light" | "dark" | "system";

function readStored(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyThemePreference(pref: ThemePreference): void {
  const root = document.documentElement;
  const dark =
    pref === "dark" || (pref === "system" && prefersDark());
  root.classList.toggle("dark", dark);
}

function subscribeThemeStore(cb: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  const onLocalTheme = () => cb();
  mq.addEventListener("change", cb);
  window.addEventListener("storage", onStorage);
  window.addEventListener("privatenote-theme", onLocalTheme);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("privatenote-theme", onLocalTheme);
  };
}

export function getThemePreference(): ThemePreference {
  return readStored();
}

export function setThemePreference(pref: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
  applyThemePreference(pref);
  window.dispatchEvent(new Event("privatenote-theme"));
}

/** Call once under App to apply saved theme and react to system / storage. */
export function ThemePreferenceRoot(): null {
  const pref = useSyncExternalStore(
    subscribeThemeStore,
    readStored,
    () => "system" as ThemePreference,
  );

  useEffect(() => {
    applyThemePreference(pref);
  }, [pref]);

  return null;
}

export function useThemePreferenceControls() {
  const pref = useSyncExternalStore(
    subscribeThemeStore,
    readStored,
    () => "system" as ThemePreference,
  );

  const set = useCallback((next: ThemePreference) => {
    setThemePreference(next);
  }, []);

  return { preference: pref, setPreference: set };
}
