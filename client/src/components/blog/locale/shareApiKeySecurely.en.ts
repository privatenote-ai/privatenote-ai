import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyEn: ShareApiKeyArticleCopy = {
  heroAlt: "Hotel keys hanging in a numbered wooden key rack",
  heroCaptionPrefix: "Image by",
  heroArtist: "Hans",
  heroCaptionMiddle: "from",
  heroSource: "Pixabay",
  intro:
    "Every developer eventually needs to send an API key to someone else — for staging access, a contractor, a webhook integration, or a client handoff. The fastest path is usually also the one that leaves the longest trail.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord, or other chat history",
    "Email, SMS, or forwarded inbox threads",
    "Jira, Trello, Notion, Confluence, or GitHub issues",
    "Plain text documents, spreadsheets, and shared cloud folders",
    "Git commits, pull requests, and code comments",
  ],
  leakSources: [
    {
      title: "Email",
      body: "Email creates long-lived copies. A key can survive in inboxes, archives, backups, mobile sync, forwarded threads, and search indexes long after the task is done.",
    },
    {
      title: "Team chat",
      body: "Slack and Teams preserve context — which makes them risky for secrets. One pasted key can become searchable by future workspace members or leak through a compromised device.",
    },
    {
      title: "Project tools",
      body: "Jira, Notion, Confluence, Trello, and GitHub Issues are not credential vaults. Deleted tickets may still exist in exports, backups, audit trails, and AI-assisted search.",
    },
    {
      title: "Git repositories",
      body: "Git history is sticky. Removing a key in a later commit does not erase earlier commits. Public repos are scanned constantly, and exposed cloud credentials can be abused within minutes.",
    },
  ],
  prepSteps: [
    {
      title: "Use the smallest possible scope",
      body: "Avoid primary production keys. Prefer staging keys, read-only permissions, IP restrictions, short-lived tokens, and integration-specific credentials.",
    },
    {
      title: "Plan to rotate or revoke",
      body: "Treat shared API keys as temporary. Revoke them when onboarding, testing, a contractor engagement, or a client handoff is finished.",
    },
    {
      title: "Watch usage patterns",
      body: "Unexpected locations, sudden request spikes, new endpoints, or unusual billing activity are often the first signs that a key has escaped.",
    },
    {
      title: "Deliver through a one-time encrypted link",
      body: "Encrypt the key locally before it enters any communication channel. Send a short-lived link instead of leaving the raw secret in permanent chat or email history.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Scope the key", detail: "Minimum permissions only" },
    { key: "encrypt", label: "Encrypt locally", detail: "Key never leaves your browser" },
    { key: "send", label: "Send the link", detail: "Not the raw secret" },
    { key: "revoke", label: "Revoke when done", detail: "Rotate after handoff" },
  ],
  faqs: [
    {
      question: "Why not just use an environment variable?",
      answer:
        "Environment variables are good for running local software. They do not solve the transport problem when you need to hand that value to a teammate, contractor, client, or integration partner.",
    },
    {
      question: "Should API keys always expire?",
      answer:
        "Whenever the provider supports it, yes. Short-lived credentials reduce the window of abuse after accidental disclosure and make rotation part of the normal workflow.",
    },
    {
      question: "What is the safest workflow?",
      answer:
        "Create a narrowly scoped key, send it through a browser-encrypted one-time link, share any optional password through a separate channel, then rotate or revoke the key when the task is done. For high-risk or long-lived keys, encrypt locally with age or OpenSSL first and upload ciphertext only.",
    },
    {
      question: "Is PrivateNote a secrets manager?",
      answer:
        "No. PrivateNote solves secure human-to-human delivery. For machine-to-machine secret storage, use HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager, or Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Treat API keys like production passwords",
      paragraphs: [
        "An API key is effectively a password for software. Depending on its permissions, a leaked key can expose customer data, consume paid resources, deploy cloud infrastructure, send email through your verified domain, or run up an AI bill.",
        "Unlike human passwords, API keys often stay valid for months, sit inside configuration files, and bypass multi-factor authentication entirely. If a key leaks, an attacker can operate as your application — and malicious traffic can blend into ordinary production usage until costs spike or data is already exposed.",
      ],
    },
    neverPaste: {
      title: "Never paste API keys into permanent systems",
      intro:
        "These channels are convenient because they preserve history. That is exactly why they are the wrong place for secrets.",
      avoidHeading: "Avoid these channels",
    },
    whereLeak: {
      title: "Where API keys actually leak",
      intro:
        "Most leaks are not sophisticated cryptography breaks. They happen when someone copies a secret into a system built to keep records.",
    },
    beforeShare: {
      title: "Before you share",
      intro:
        "Narrow the blast radius first. How you deliver the key matters — but a tightly scoped key limits the damage if something still goes wrong.",
      newKeyTitle: "Creating a new key?",
      newKeyBefore: "Generate high-entropy credentials locally in your browser — the",
      newKeyLink: "API key generator",
      newKeyAfter: "on passwords.lu runs client-side; nothing is uploaded.",
    },
    highRisk: {
      title: "High-risk keys: encrypt locally first",
      p1: "Most API keys are replaceable: staging tokens, short-lived integration secrets, and narrowly scoped credentials you plan to rotate. For those, browser-encrypted one-time delivery is usually enough.",
      p2: "Some keys carry more weight — production admin access, signing keys, root cloud credentials, or anything long-lived that would be painful or impossible to revoke cleanly. Treat those like master secrets: **encrypt locally before any web upload**, then send ciphertext through PrivateNote.",
      calloutHeading: "Local encryption first",
      ageBullet:
        "**age** — simplest defaults for file encryption (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — trusted CLI if you already know the flags",
      separateChannelBullet:
        "Upload the encrypted file with PrivateNote; send the decryption passphrase on a **separate channel** (Signal, phone, in person)",
      outro:
        "The same workflow applies to cryptocurrency seed phrases and other irreplaceable master secrets. See [crypto seed phrases and one-time links](blog:crypto-seed-phrase-one-time-link) for the full age/OpenSSL walkthrough, passphrase tips, and when one-time links are — and are not — the right tool.",
    },
    handoff: {
      title: "A safer handoff workflow",
      intro: "When a human needs the key—not when an app retrieves it at runtime—follow this sequence.",
      diagramCaption: "Safer handoff at a glance",
      diagramFootnote: "Share any note password through a separate channel — never in the same message as the link.",
    },
    privateNote: {
      title: "How PrivateNote fits the handoff",
      p1: "PrivateNote is built for the human-to-human moment: API keys, SSH private keys, database credentials, recovery codes, webhook signing secrets, and temporary passwords that need to reach one person without becoming a permanent record.",
      p2: "The secret is encrypted in your browser before upload. PrivateNote stores ciphertext, not plaintext. The decryption key lives in the URL fragment — the part after the `#` — which browsers do not send to the server when loading the page.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "The server receives the note ID and encrypted payload.",
      bullet2: "The server does not receive the decryption key.",
      bullet3: "Burn-after-reading and expiration limit how long the encrypted note exists.",
      p3: "PrivateNote complements dedicated secret stores — it closes the gap when you need to send a Stripe key to an integration partner, share a temporary OpenAI key with a contractor, or give a teammate one-time access to a staging credential.",
    },
    faq: { title: "Frequently asked questions" },
    bottomLine: {
      title: "The bottom line",
      body: "Most API key leaks do not happen because cryptography failed. They happen because someone copied a secret into a permanent, searchable system out of convenience. Scope keys tightly, share them only when necessary, and avoid leaving a plaintext trail in chat, tickets, email, or Git. For the delivery-pipeline side—.env commits, CI logs, and GitHub history—see [secrets in CI/CD, .env files, and GitHub](blog:secrets-in-cicd-env-github-leaks).",
    },
  },
  ctaTitle: "Share an API key without leaving it in chat",
  ctaBody: "Create a browser-encrypted, burn-after-reading PrivateNote link. No account required for one-time notes.",
  ctaButton: "Create a PrivateNote ->",
};
