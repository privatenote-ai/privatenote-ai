import React from "react";
import { Lock, User, Shield } from "lucide-react";
import {
  NOTE_EXPIRY_PRESETS,
  isNoteExpiryPresetId,
  type NoteExpiryPresetId,
} from "@shared/noteExpiry";
import {
  DEFAULT_STRONG_PASSWORD_LENGTH,
  TRANSPORT_SAFE_STRONG_PASSWORD_CHARSET,
} from "@shared/transportSafePassword";
import {
  SIMPLE_PASSWORD_ADJECTIVES,
  SIMPLE_PASSWORD_NOUNS,
} from "./simplePasswordWordlists";
import type { PasswordStrength, BreachState } from "@/hooks/usePasswordBreachCheck";

// Uniform integer in [0, max) — rejection sampling avoids modulo bias.
const secureRandomInt = (max: number): number => {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("secureRandomInt: max must be a positive integer");
  }
  if (max > 0x1_0000_0000) {
    throw new RangeError("secureRandomInt: max exceeds uint32 range");
  }
  const modulus = 0x1_0000_0000;
  const limit = Math.floor(modulus / max) * max;
  const randomBuffer = new Uint32Array(1);
  let x: number;
  do {
    window.crypto.getRandomValues(randomBuffer);
    x = randomBuffer[0];
  } while (x >= limit);
  return x % max;
};

export const generateHumanFriendlyPassword = (): string => {
  const randomAdjective =
    SIMPLE_PASSWORD_ADJECTIVES[secureRandomInt(SIMPLE_PASSWORD_ADJECTIVES.length)];
  const randomNoun = SIMPLE_PASSWORD_NOUNS[secureRandomInt(SIMPLE_PASSWORD_NOUNS.length)];
  let numbers = "";
  for (let i = 0; i < 4; i += 1) {
    numbers += secureRandomInt(10).toString();
  }
  return `${randomAdjective}-${randomNoun}-${numbers}`;
};

export const generateStrongPassword = (): string => {
  const length = DEFAULT_STRONG_PASSWORD_LENGTH;
  const charset = TRANSPORT_SAFE_STRONG_PASSWORD_CHARSET;
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[secureRandomInt(charset.length)];
  }
  return password;
};

export type NoteSettingsPanelProps = {
  showAdvancedOptions: boolean;
  password: string;
  setPassword: (p: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  passwordSource: "simple" | "strong" | "manual" | null;
  setPasswordSource: (s: "simple" | "strong" | "manual" | null) => void;
  passwordStrength: PasswordStrength | null;
  breachState: BreachState;
  breachCount: number | null;
  expiryValue: NoteExpiryPresetId;
  setExpiryValue: (v: NoteExpiryPresetId) => void;
};

export const NoteSettingsPanel: React.FC<NoteSettingsPanelProps> = ({
  showAdvancedOptions,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  passwordSource,
  setPasswordSource,
  passwordStrength,
  breachState,
  breachCount,
  expiryValue,
  setExpiryValue,
}) => {
  return (
    <div
      className={`mb-3 overflow-hidden transition-all duration-300 ease-in-out ${
        showAdvancedOptions ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Password protection */}
        <div className="mt-2 grid grid-cols-3 gap-2 items-start py-2 px-1 mb-3 transition-colors">
          <div className="col-span-1">
            <div className="flex flex-col">
              <label
                htmlFor="note-password"
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 pt-0.5"
              >
                <span className="bg-green-50 dark:bg-green-900/30 p-1 rounded mr-2">
                  <Lock className="w-4 h-4 text-green-500 dark:text-green-400" />
                </span>
                <span className="block">Password</span>
              </label>
              <div className="mt-1 text-[10px] text-gray-400">Powered by passwords.lu</div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="relative">
              <div className="flex">
                <input
                  id="note-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordSource("manual");
                  }}
                  placeholder="Enter a secure password (optional)"
                  className="w-full px-2.5 py-1.5 text-sm rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-2 py-1.5 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(generateHumanFriendlyPassword());
                      setPasswordSource("simple");
                    }}
                    className="px-2 py-1.5 bg-green-50 dark:bg-green-900/30 border border-gray-300 dark:border-gray-600 text-xs text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 flex items-center"
                    title="Generate human-friendly password (easy to remember)"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span>Simple</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(generateStrongPassword());
                      setPasswordSource("strong");
                    }}
                    className="px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 border-t border-r border-b border-gray-300 dark:border-gray-600 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-r-md flex items-center"
                    title="Generate strong password (very secure)"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Strong</span>
                  </button>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-600 dark:text-gray-300">Breach check:</span>{" "}
                If you type a password here, this page may contact{" "}
                <a
                  href="https://haveibeenpwned.com/Passwords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-90"
                >
                  Have I Been Pwned
                </a>{" "}
                from your browser to see whether it appears in known breaches. Only part of a SHA-1
                hash is sent (k-anonymity); your full password is not sent for this lookup.
              </p>
              {password.trim() && (
                <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {passwordStrength && (
                      <span className="whitespace-nowrap">
                        Strength{" "}
                        <span className={`font-medium ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </span>
                    )}
                    <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span className="whitespace-nowrap">
                      {breachState === "checking" && "Checking breaches"}
                      {breachState === "safe" && "Not found in breaches"}
                      {breachState === "pwned" &&
                        `Found in breaches${breachCount ? ` (${breachCount.toLocaleString()})` : ""}`}
                      {breachState === "error" && "Breach check unavailable"}
                    </span>
                  </div>
                  {passwordSource === "simple" && (
                    <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                      Easier to remember than Strong mode (curated word list).
                    </p>
                  )}
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recipients will need a password to decrypt
              </div>
            </div>
          </div>
        </div>

        {/* Expiry and view limit */}
        <div className="mt-3 flex flex-col space-y-2">
          <div className="grid grid-cols-3 gap-2 items-center py-2 px-1 transition-colors">
            <div className="col-span-1">
              <label
                htmlFor="expiry-value"
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span className="bg-blue-50 dark:bg-blue-900/30 p-1 rounded mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Expiration
              </label>
            </div>
            <div className="col-span-2">
              <select
                id="expiry-value"
                value={expiryValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isNoteExpiryPresetId(v)) setExpiryValue(v);
                }}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 backdrop-blur-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "0.75em",
                }}
              >
                {NOTE_EXPIRY_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center py-2 px-1 transition-colors">
            <div className="col-span-1">
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="bg-purple-50 dark:bg-purple-900/30 p-1 rounded mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-500 dark:text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                View Limit
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Notes can only be viewed once for maximum security
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
