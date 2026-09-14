import type { SupportedLanguage } from "@shared/supportedLanguages";
import {
  BLOG_TAKEAWAYS_DE,
  BLOG_TAKEAWAYS_ES,
  BLOG_TAKEAWAYS_FR,
  BLOG_TAKEAWAYS_HR,
  BLOG_TAKEAWAYS_IT,
  BLOG_TAKEAWAYS_NL,
  BLOG_TAKEAWAYS_PT,
  BLOG_TAKEAWAYS_SR,
} from "./blogTakeaways.i18n";

/** Concise Key Takeaways per canonical blog slug (English source). */
export const BLOG_TAKEAWAYS_EN: Record<string, string[]> = {
  "privacy-tools": [
    "Pick tools by job (passwords, secrets, messaging)—not by hype.",
    "Prefer defaults that reduce account sprawl and data leftover.",
    "Use one-time encrypted links for secrets that should not persist.",
    "Keep a minimal stack you can actually maintain.",
  ],
  "crypto-seed-phrase-one-time-link": [
    "A seed phrase is full wallet control—treat it like cash, not a password.",
    "One-time links help for short handoffs; they do not replace offline storage.",
    "Never put a seed in email, chat, cloud notes, or screenshots.",
    "Confirm the recipient and destroy leftover copies after transfer.",
  ],
  "why-email-is-worst-for-secrets": [
    "Email creates durable copies across inboxes, backups, and devices.",
    "Forwarding, search, and sync keep secrets discoverable for years.",
    "Use browser-encrypted one-time links for credentials and recovery codes.",
    "Keep the transport channel separate from long-term storage.",
  ],
  "chat-control-1-0-vote-explained": [
    "Chat Control 1.0 debates client-side scanning of private messages.",
    "Mandatory scanning weakens the practical meaning of end-to-end encryption.",
    "Policy text and voting mechanics matter as much as the slogan.",
    "Ephemeral, encrypted handoffs remain useful when chat is the wrong channel.",
  ],
  "chat-control-europe-cryptographers": [
    "European cryptographers warn that forced scanning breaks E2EE at scale.",
    "“Lawful access” designs often become surveillance infrastructure.",
    "Security for everyone depends on not carving backdoors into messengers.",
    "Keep high-risk secrets out of permanent chat histories.",
  ],
  "what-is-end-to-end-encryption": [
    "E2EE means only endpoints hold the keys—not the service in the middle.",
    "Transport encryption (TLS) is necessary but not the same as E2EE.",
    "URL-fragment key models keep decryption material off the server.",
    "Delivery channels and endpoints can still leak even when ciphertext is sound.",
  ],
  "secrets-never-send-in-chat": [
    "Chat apps are built to retain context—not to forget credentials.",
    "Passwords, API keys, seed phrases, and recovery codes do not belong in chat.",
    "Use one-time encrypted links for human-to-human secret handoffs.",
    "Rotate anything that was already pasted into a durable thread.",
  ],
  "send-secret-message-without-account": [
    "You can share a secret without creating an account when crypto runs in the browser.",
    "Prefer short expiry, optional passphrase, and one-time open.",
    "The link is the capability—treat it like the secret itself.",
    "Avoid pasting the plaintext into email or chat alongside the link.",
  ],
  "encrypted-vs-secure-file-sharing": [
    "“Secure” marketing often means TLS in transit—not zero-access storage.",
    "Browser encryption before upload changes what the provider can read.",
    "Know where keys live and who can decrypt after upload.",
    "Match the tool to the threat: casual privacy vs. hostile provider access.",
  ],
  "one-time-secret-links": [
    "A one-time secret link is for temporary handoff, not storage or conversation.",
    "Encryption protects access; expiry and one-time reveal reduce leftover copies.",
    "Security depends on the implementation and how the link is sent—not on the name.",
    "Confirm the recipient, keep expiry short, and rotate credentials after use.",
  ],
  "securing-ai-agents-like-employees": [
    "Agents with tools and memory need access control like employees do.",
    "Prompt injection is only part of the risk—permissions and data flow matter.",
    "Keep secrets out of agent prompts; deliver them through controlled channels.",
    "Log actions and scope credentials tightly for autonomous workflows.",
  ],
  "privatenote-codex": [
    "Wire PrivateNote MCP once so Codex can create encrypted notes safely.",
    "Keep raw secrets out of the agent prompt and chat logs.",
    "Use short-lived notes for handoffs between humans and tools.",
    "Treat MCP output links as sensitive—same as the secret itself.",
  ],
  "privatenote-for-developers": [
    "Share secrets from the IDE, CLI, or browser without pasting into Slack.",
    "Client-side encryption keeps plaintext off PrivateNote servers.",
    "Prefer one-time links for contractor and teammate handoffs.",
    "Rotate keys after sharing and store runtime secrets in a vault.",
  ],
  "myth-good-enough-security": [
    "“Good enough” habits fail against opportunistic scanning and reuse.",
    "Architecture beats one-off caution: ephemeral by default where possible.",
    "Permanent channels create permanent evidence and leak surfaces.",
    "Upgrade the workflow, not only the password length.",
  ],
  "how-we-generate-passwords": [
    "Use cryptographic randomness—not human-chosen patterns.",
    "Unbiased character selection avoids accidental weak spots.",
    "Longer random passwords beat clever substitutions.",
    "Generate, store in a manager, and never reuse across sites.",
  ],
  "workplace-texts-private-note": [
    "Workplace messages often become discoverable records.",
    "Sensitive one-off details deserve ephemeral channels.",
    "Separate durable work product from secret handoffs.",
    "Use encrypted one-time notes when chat retention is the risk.",
  ],
  "introduction-to-private-ai": [
    "Private AI means keeping prompts and context under your control.",
    "Local and in-browser models reduce cloud training exposure.",
    "Still verify what leaves the device when tools call external APIs.",
    "Combine private drafting with encrypted sharing for sensitive text.",
  ],
  "how-to-make-a-private-note": [
    "Encrypt in the browser before anything is uploaded.",
    "Set expiry and view limits that match the handoff.",
    "Share the link carefully—possession is access.",
    "Do not paste the same secret into a permanent channel afterward.",
  ],
  "social-media-bans-children-evidence": [
    "Age bans are blunt; evidence on harms and efficacy is mixed.",
    "Privacy and safety trade-offs differ by platform design.",
    "Focus on real risks: data collection, messaging, and permanence.",
    "Teach safer channels for sensitive personal information.",
  ],
  "how-to-share-a-password-securely": [
    "Never send passwords in email, SMS, or team chat.",
    "Use a browser-encrypted one-time link for the handoff.",
    "Prefer temporary passwords and force a reset after access.",
    "Confirm recipient identity on a separate channel when stakes are high.",
  ],
  "secrets-in-cicd-env-github-leaks": [
    "Never commit `.env` files or cloud keys to Git.",
    "Assume leaked history is public until rotated and purged carefully.",
    "Use the platform secret store for CI/CD—not chat pastebins.",
    "Scan early and rotate immediately when a leak is found.",
  ],
  "send-sensitive-documents-securely": [
    "Email attachments create long-lived copies on both sides.",
    "Encrypt before upload when the provider should not read the file.",
    "Use short-lived links and verify the recipient.",
    "Remove leftover copies from chat and drive shares after delivery.",
  ],
  "how-to-share-ssh-keys-securely": [
    "Private SSH keys never belong in chat, email, or tickets.",
    "Prefer short-lived access or certificates over shipping long-lived keys.",
    "If you must hand off a key, use an encrypted one-time link.",
    "Rotate or revoke after the task ends.",
  ],
  "android-iphone-rcs-end-to-end-encryption": [
    "RCS E2EE coverage depends on apps, platforms, and group settings.",
    "Cross-platform messaging may silently fall back from E2EE.",
    "Verify encryption indicators before sending sensitive content.",
    "For secrets, prefer purpose-built one-time encrypted links over SMS/RCS.",
  ],
  "google-drive-vs-one-time-encrypted-links": [
    "Google Drive is built for collaboration and long-term access.",
    "Temporary confidential files benefit from shorter retention by design.",
    "One-time encrypted links minimise leftover copies and open permissions.",
    "Match the sharing method to how long the information actually needs to exist.",
  ],
  "common-secret-handling-mistakes": [
    "Most secret leaks result from everyday workflows rather than broken encryption.",
    "Reducing long-term retention is often more important than changing communication tools.",
    "Temporary sharing is usually safer than permanent storage.",
    "Good secret handling means limiting both who can access information and how long it remains available.",
  ],
  "mythos-ai-cryptanalysis-hawk": [
    "Mythos helped produce a key-recovery attack that led the HAWK team to request withdrawal.",
    "Green: HAWK matters; the AES result is a small lab increment—not a panic headline.",
    "The AES attack still needs about 2^89 operations and 2^105 chosen-plaintext encryptions.",
    "AI synthesized known cryptanalysis tools; verifying plausible-looking results is the bottleneck.",
  ],
  "how-to-share-photos-securely": [
    "Reduce visible details, embedded metadata, and long-lived service access.",
    "PrivateNote re-encodes supported images locally before encryption; it cannot anonymise visible pixels.",
    "A read-once note can still allow attachment downloads during its configured post-open window.",
    "Treat the complete link as a bearer secret and send any passphrase separately.",
  ],
  "how-to-send-encrypted-voice-message": [
    "Record in the browser; PrivateNote encrypts audio like a file attachment before upload.",
    "Prefer voice for short spoken context—not for secrets that must be typed exactly.",
    "Pair the link with short open limits and optional verification.",
    "Recipients can still save audio after decrypt; expiration is not remote deletion.",
  ],
  "recipient-verification-code-before-reveal": [
    "A note-specific six-digit code gates reveal before decrypt.",
    "Share the code on a different channel from the link.",
    "Verification is separate from optional passphrase wrapping.",
    "Starter and Business can enable it per note or as an account default.",
  ],
  "click-to-reveal-private-notes": [
    "Reveal is intentional: decrypt waits for a confirmed click.",
    "That pause reduces accidental reveals; it is not a calendar unlock timer.",
    "Combine with lifetime, open limits, and verification for safer handoffs.",
    "Accidental opens on one-time notes still burn access—warn recipients.",
  ],
  "know-when-secret-link-opened": [
    "Email and live alerts report status only—never note contents.",
    "Use opened as a cue to rotate credentials or close the loop.",
    "Keep the site open for in-tab toasts; email works asynchronously.",
    "Proof of access adds a privacy-safe event timeline on eligible plans.",
  ],
  "revoke-unopened-note-proof-of-access": [
    "Revoke destroys unopened links; it cannot erase a post-reveal copy.",
    "Proof of access is a status receipt—not a reading transcript.",
    "Use revoke for wrong recipients; use proof for delivery questions.",
    "After reveal, assume the recipient may retain the plaintext and rotate exposed credentials.",
  ],
  "delayed-reveal-scheduled-secret-links": [
    "Scheduled reveal sets the earliest time a one-time note can be opened.",
    "Share the link early for handovers; recipients wait until the scheduled UTC time.",
    "The open time must be before the note expires or create is rejected.",
    "Encryption, burn-after-read, and passwords still apply once the note becomes openable.",
  ],
  "how-to-send-nudes-safely": [
    "What identifies you in the photo is usually a bigger risk than nudity itself.",
    "Consent is required and not transferable. Do not involve anyone under 18.",
    "Encrypt the link and make it expire. Screenshots and a determined recipient remain possible.",
    "If a photo is used for extortion, keep evidence, do not pay, and use StopNCII.org.",
  ],
  "secure-client-delivery-for-lawyers": [
    "Protecting privileged communications means thinking about who can later retrieve a written record—not only how it was encrypted during delivery.",
    "Clients need not install Signal or WhatsApp; they open a branded link in a browser.",
    "Burn-after-read and expiry avoid a permanent copy remaining by default in a messenger history.",
    "Business adds firm branding, view-only files, and professional delivery controls.",
  ],
};

export type BlogTakeawaysLocaleMap = Partial<
  Record<SupportedLanguage, Partial<Record<string, string[]>>>
>;

/** Localized overlays; missing locales/slugs fall back to English. */
export const BLOG_TAKEAWAYS_I18N: BlogTakeawaysLocaleMap = {
  de: BLOG_TAKEAWAYS_DE,
  fr: BLOG_TAKEAWAYS_FR,
  es: BLOG_TAKEAWAYS_ES,
  it: BLOG_TAKEAWAYS_IT,
  nl: BLOG_TAKEAWAYS_NL,
  pt: BLOG_TAKEAWAYS_PT,
  sr: BLOG_TAKEAWAYS_SR,
  hr: BLOG_TAKEAWAYS_HR,
};

export function getBlogTakeaways(slug: string, language: SupportedLanguage): string[] {
  const localized = BLOG_TAKEAWAYS_I18N[language]?.[slug];
  if (localized?.length) return localized;
  return BLOG_TAKEAWAYS_EN[slug] ?? [];
}
