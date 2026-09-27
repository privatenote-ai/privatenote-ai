import adjectivesText from "./wordlists/simple-password-adjectives.txt?raw";
import nounsText from "./wordlists/simple-password-nouns.txt?raw";

function parseWordlistFile(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

export const SIMPLE_PASSWORD_ADJECTIVES = parseWordlistFile(adjectivesText);
export const SIMPLE_PASSWORD_NOUNS = parseWordlistFile(nounsText);
