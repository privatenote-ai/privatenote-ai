/**
 * Append missing i18n keys (prefill, AI composer dialogs, auth pages, security toasts)
 * from en.ts into other locale files via Google Translate.
 *
 * Usage: node scripts/append-auth-i18n-batch.mjs [de|fr|es|it|nl|pt|sr|hr|all]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "client/src/utils/translations");

const START_KEY = process.env.START_KEY ?? "prefillPartnerBodyPrefix";
const ONLY_KEYS = process.env.ONLY_KEYS?.split(",").filter(Boolean) ?? null;

const TARGETS = {
  de: { googleCode: "de", label: "German" },
  fr: { googleCode: "fr", label: "French" },
  es: { googleCode: "es", label: "Spanish" },
  it: { googleCode: "it", label: "Italian" },
  nl: { googleCode: "nl", label: "Dutch" },
  pt: { googleCode: "pt", label: "Portuguese" },
  sr: { googleCode: "sr", label: "Serbian (Latin)" },
  hr: { googleCode: "hr", label: "Croatian" },
};

const BATCH_SIZE = 25;
const DELAY_MS = 400;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function protectString(input) {
  const tokens = [];
  let out = input;
  const patterns = [
    /\{[a-zA-Z0-9_]+\}/g,
    /\*\*[^*]+\*\*/g,
    /PrivateNote\.ai/g,
    /PrivateNote/g,
    /Cloud Assist/g,
    /Cloudflare Workers AI/g,
    /Cloudflare/g,
    /Google Gemma 4 26B/g,
    /Gemma 4 26B/g,
    /WebAuthn/g,
    /TOTP/g,
    /Wi-Fi/g,
    /3G/g,
    /QR/g,
    /AES-256-GCM/g,
  ];
  for (const re of patterns) {
    out = out.replace(re, (match) => {
      const id = `__PN_${tokens.length}__`;
      tokens.push(match);
      return id;
    });
  }
  return { protected: out, tokens };
}

function restoreString(input, tokens) {
  let out = input;
  tokens.forEach((token, i) => {
    out = out.replaceAll(`__PN_${i}__`, token);
  });
  return out;
}

const CYR_TO_LAT = {
  А: "A", а: "a", Б: "B", б: "b", В: "V", в: "v", Г: "G", г: "g", Д: "D", д: "d",
  Ђ: "Đ", ђ: "đ", Е: "E", е: "e", Ж: "Ž", ж: "ž", З: "Z", з: "z", И: "I", и: "i",
  Ј: "J", ј: "j", К: "K", к: "k", Л: "L", л: "l", Љ: "Lj", љ: "lj", М: "M", м: "m",
  Н: "N", н: "n", Њ: "Nj", њ: "nj", О: "O", о: "o", П: "P", п: "p", Р: "R", р: "r",
  С: "S", с: "s", Т: "T", т: "t", Ћ: "Ć", ћ: "ć", У: "U", у: "u", Ф: "F", ф: "f",
  Х: "H", х: "h", Ц: "C", ц: "c", Ч: "Č", ч: "č", Џ: "Dž", џ: "dž", Ш: "Š", ш: "š",
};

function toLatinSerbian(text) {
  if (!/[А-яЂ-џ]/.test(text)) return text;
  return [...text].map((ch) => CYR_TO_LAT[ch] ?? ch).join("");
}

async function googleTranslate(text, targetLang) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", targetLang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Translate HTTP ${res.status}`);
  const data = await res.json();
  return (data[0] ?? []).map((part) => part[0]).join("");
}

async function translateValue(value, targetLang, localeKey) {
  if (!value?.trim()) return value;
  const { protected: protectedText, tokens } = protectString(value);
  let translated = await googleTranslate(protectedText, targetLang);
  translated = restoreString(translated, tokens);
  if (localeKey === "sr") translated = toLatinSerbian(translated);
  return translated;
}

async function loadEn() {
  const snippet = `import { en } from ${JSON.stringify(path.join(OUT_DIR, "en.ts"))}; console.log(JSON.stringify(en));`;
  const out = spawnSync("npx", ["tsx", "-e", snippet], { encoding: "utf8", cwd: ROOT });
  if (out.status !== 0) throw new Error(out.stderr || "Failed to load en.ts");
  return JSON.parse(out.stdout.trim());
}

function getNewKeys(en) {
  if (ONLY_KEYS?.length) return ONLY_KEYS.filter((key) => en[key] != null);
  const keys = Object.keys(en);
  const start = keys.indexOf(START_KEY);
  if (start === -1) throw new Error(`Start key ${START_KEY} not found in en.ts`);
  return keys.slice(start);
}

function localeHasKey(content, key) {
  return new RegExp(`^\\s*${key}:\\s`, "m").test(content);
}

async function patchLocale(localeKey, newKeys, en) {
  const filePath = path.join(OUT_DIR, `${localeKey}.ts`);
  let content = await fs.readFile(filePath, "utf8");
  const missing = newKeys.filter((key) => !localeHasKey(content, key));
  if (missing.length === 0) {
    console.log(`✓ ${localeKey}: already complete (${newKeys.length} keys)`);
    return;
  }

  console.log(`\n🌐 ${localeKey}: translating ${missing.length} missing keys…`);
  const cfg = TARGETS[localeKey];
  const translated = {};

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (key) => {
        try {
          translated[key] = await translateValue(en[key], cfg.googleCode, localeKey);
        } catch (err) {
          console.warn(`  ⚠ ${key}: ${err.message}`);
          translated[key] = en[key];
        }
      }),
    );
    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, missing.length)}/${missing.length}\r`);
    await sleep(DELAY_MS);
  }

  const lines = missing.map((key) => `  ${key}: ${JSON.stringify(translated[key])},`);
  content = content.replace(/\n};\s*$/, `\n${lines.join("\n")}\n};\n`);
  await fs.writeFile(filePath, content, "utf8");
  console.log(`\n✓ ${localeKey}: appended ${missing.length} keys`);
}

const arg = process.argv[2] ?? "all";
const locales = arg === "all" ? Object.keys(TARGETS) : [arg];
for (const locale of locales) {
  if (!TARGETS[locale]) {
    console.error(`Unknown locale: ${locale}`);
    process.exit(1);
  }
}

const en = await loadEn();
const newKeys = getNewKeys(en);
console.log(`Batch: ${newKeys.length} keys from ${START_KEY}`);

for (const locale of locales) {
  await patchLocale(locale, newKeys, en);
}
