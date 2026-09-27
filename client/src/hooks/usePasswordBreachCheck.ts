import { useState, useEffect, useRef } from "react";
import { checkHIBP } from "@/utils/hibp";

export type PasswordStrength = {
  score: number;
  label: string;
  color: string;
};

export type BreachState = "idle" | "checking" | "safe" | "pwned" | "error";

const strengthLabels = [
  "Very weak",
  "Weak",
  "Fair",
  "Strong",
  "Very strong",
];

const strengthColors = [
  "text-rose-500",
  "text-orange-500",
  "text-yellow-600",
  "text-green-600",
  "text-emerald-600",
];

export const getPasswordStrength = (value: string): PasswordStrength | null => {
  const length = value.length;
  if (!length) return null;

  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  let score = 0;
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  if (length >= 20) score += 1;
  if (variety >= 3) score += 1;
  if (variety === 4) score += 1;

  if (/^(.)\1+$/.test(value)) {
    score = 0;
  }

  if (
    /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|qwer|asdf|zxcv)/i.test(value)
  ) {
    score = Math.max(0, score - 1);
  }

  if (!hasUpper && !hasSymbol) {
    score = Math.min(score, 2);
  }

  score = Math.min(4, score);

  return {
    score,
    label: strengthLabels[score],
    color: strengthColors[score],
  };
};

export function usePasswordBreachCheck(password: string) {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [breachState, setBreachState] = useState<BreachState>("idle");
  const [breachCount, setBreachCount] = useState<number | null>(null);
  const breachTimeoutRef = useRef<number | null>(null);
  const breachAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (breachTimeoutRef.current) {
      window.clearTimeout(breachTimeoutRef.current);
    }
    if (breachAbortRef.current) {
      breachAbortRef.current.abort();
      breachAbortRef.current = null;
    }

    const trimmed = password.trim();
    if (!trimmed) {
      setPasswordStrength(null);
      setBreachState("idle");
      setBreachCount(null);
      return;
    }

    breachTimeoutRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      breachAbortRef.current = controller;
      const strength = getPasswordStrength(trimmed);
      setPasswordStrength(strength);
      setBreachState("checking");
      try {
        const result = await checkHIBP(trimmed, controller.signal, {
          timeoutMs: 8000,
        });
        if (controller.signal.aborted || result.status === "error") {
          if (result.status === "error" && result.reason !== "aborted") {
            setBreachState("error");
            setBreachCount(null);
          }
          return;
        }
        if (result.status === "found") {
          setBreachState("pwned");
          setBreachCount(result.count ?? null);
          return;
        }
        setBreachState("safe");
        setBreachCount(0);
      } catch (error) {
        if (controller.signal.aborted) return;
        setBreachState("error");
        setBreachCount(null);
      }
    }, 600);

    return () => {
      if (breachTimeoutRef.current) {
        window.clearTimeout(breachTimeoutRef.current);
      }
      if (breachAbortRef.current) {
        breachAbortRef.current.abort();
        breachAbortRef.current = null;
      }
    };
  }, [password]);

  return { passwordStrength, breachState, breachCount };
}
