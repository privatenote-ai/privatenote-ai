import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksEn: OneTimeSecretLinksArticleCopy = {
  intro: [
    "A **one-time secret link** is a URL used to deliver sensitive information without leaving the plaintext permanently in email or chat history. The recipient opens the link, reveals the secret in the browser, and the encrypted copy on the server then becomes unavailable according to the link’s access and expiry rules.",
    "It is useful for passwords, API keys, recovery codes, temporary credentials, and private messages that need to reach someone once and do not need a permanent conversation history.",
    "The issue isn’t always interception. It’s **retention**. Encryption protects information against unauthorized access. Ephemerality reduces how long unnecessary copies remain available. A one-time secret link is built for a third job: **temporary handoff**.",
  ],
  earlyCta: {
    body: "Need to send one now?",
    linkLabel: "Create an encrypted one-time link with PrivateNote",
  },
  sections: [
    {
      title: "What is a one-time secret link?",
      paragraphs: [
        "Services use several names for the same idea: one-time link, secret link, one-time note, burn-after-reading link, self-destructing note, or expiring secret link. The label varies. The security properties do not automatically follow from the name.",
        "A product called a “one-time secret” does not, by itself, mean encryption happens in the browser, that the provider cannot decrypt the payload, that the key is withheld from the server, that deletion happens immediately after a read, or that metadata disappears. Those are design choices. When you evaluate a tool, inspect the properties—not the marketing term.",
        "A useful checklist is: where is the plaintext encrypted? Does the server ever receive the decryption key? What happens after the intended retrieval? How long does an unused link remain available? What does a chat preview fetch if someone pastes the URL?",
      ],
    },
    {
      title: "How does a one-time secret link work?",
      paragraphs: [
        "In a client-side design like PrivateNote’s, the secret is encrypted in the sender’s browser before upload. The server stores ciphertext. The recipient’s browser decrypts it locally. Note text uses AES-256-GCM via the Web Crypto API.",
      ],
      beforeFlowSteps: "**In practice, the full flow looks like this:**",
      flowSteps: [
        {
          title: "Browser-generated key and encryption",
          step: "Step 1: Your browser",
          body: "You write the secret locally. The browser generates cryptographic material and encrypts the plaintext before any network request leaves the device.",
        },
        {
          title: "Ciphertext upload",
          step: "Step 2: The server",
          body: "Only the encrypted payload is uploaded. The server stores ciphertext it cannot read, because it does not receive the plaintext or the fragment key.",
        },
        {
          title: "Key stays in the link",
          step: "Step 3: The URL",
          body: "The decryption key is placed in the URL fragment—the part after #. The public path identifies the note; the fragment stays in the browser under normal URL handling.",
        },
        {
          title: "Reveal, decrypt, then apply access rules",
          step: "Step 4: The recipient",
          body: "Opening the page is not enough. The recipient clicks to reveal, which fetches ciphertext. The browser decrypts locally. After a successful reveal, PrivateNote applies the view limit—one view by default—and deletes the ciphertext when that limit is reached. Unused links also expire on a timer.",
        },
      ],
      afterFlowSteps: [
        "Not every product sold as a one-time secret link follows this pattern. Some encrypt on the server after receiving your text, or generate the key there, which means the service could read the secret. Others delete on a schedule but keep recoverable copies. Ask whether the full design is implemented—not only whether the link expires.",
        "For PrivateNote’s encryption architecture, including password wrapping with Argon2id, see [How It Works](app:how-it-works).",
      ],
    },
    {
      title: "Why the URL fragment matters",
      paragraphs: [
        "This detail is easy to miss, and it is the foundation of this architecture.",
        "In a normal HTTPS navigation, the browser sends the path and query to the server. The [URL fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—everything after #—stays in the browser and is not included in that request. A well-designed system can therefore store ciphertext at a note identifier such as `/note/abc123` while keeping decryption material in `#…`, out of ordinary server logs for that page load.",
        "Putting a key after # does not, by itself, make an application secure. The surrounding cryptography still has to be sound: a strong random key, authenticated encryption, and a server that never needs the plaintext. The fragment is how those pieces stay separated—not a shortcut around them.",
      ],
    },
    {
      title: "One-time link vs. expiring link vs. disappearing message",
      paragraphs: [
        "These ideas are often mixed together. They are different controls, and a single product can combine them.",
      ],
      bullets: [
        {
          label: "One-time link",
          body: "Availability depends primarily on access. After the intended retrieval—on PrivateNote, a successful reveal that reaches the view limit—the encrypted payload is gone from the server.",
        },
        {
          label: "Expiring link",
          body: "Availability depends primarily on time. The link remains retrievable until the clock runs out, whether or not anyone opened it.",
        },
        {
          label: "Disappearing message",
          body: "Part of an ongoing conversation. Retention follows the messenger’s policy, which may still leave backups, quoted replies, or device copies.",
        },
      ],
      callout:
        "**PrivateNote combines both access and time.** New notes default to one successful reveal, and they also expire if unused—one day by default, with shorter or longer presets depending on the plan. That is temporary handoff: retrieve it, or wait, and the server-side copy goes away.",
    },
    {
      title: "Are one-time secret links secure?",
      paragraphs: [
        "They can be. Security depends on the implementation and on how the link is used—not on the phrase “one-time.”",
        "A serious design should consider client-side encryption, strong random keys, what the server can see, expiry, access semantics, optional password protection, optional recipient verification, metadata, link leakage, endpoint compromise, and recipient behavior.",
        "PrivateNote encrypts in the browser, stores ciphertext, keeps the key in the URL fragment, defaults to a single reveal, and expires unused notes. You can add a password or, on paid plans, recipient verification when the sensitivity warrants it. Recipients do not need an account.",
        "A one-time link does **not** protect against a compromised sender or recipient device, a recipient who copies the secret after viewing it, screenshots or photos of the screen, or sending the complete URL—including the fragment—to the wrong person. Treat the full link as the capability.",
      ],
    },
    {
      title: "When should you use a one-time link?",
      paragraphs: [
        "Use one when a secret has a short job: arrive, be used, and stop living in the channel you used to send it.",
      ],
      subsections: [
        {
          title: "Passwords",
          paragraphs: [
            "A one-time link is a good fit for handing a temporary or newly created password to one recipient without leaving the plaintext in mail or chat history. For the password-specific workflow, see [how to share a password securely](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "API keys and tokens",
          paragraphs: [
            "Developers and contractors often need a key once. Sending it through a link keeps the raw credential out of Slack threads, tickets, and Git comments. See [how to share an API key securely](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Recovery codes",
          paragraphs: [
            "Useful when a backup or 2FA recovery code genuinely needs to move to another authorized person—and should not remain searchable in the thread that carried it.",
          ],
        },
        {
          title: "Private messages",
          paragraphs: [
            "Information that needs to be communicated once, without becoming a permanent conversation. Recipients can open the note without creating an account. See [send a secret message without an account](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Sensitive files",
          paragraphs: [
            "Files need extra care: size, download, preview, and a separate access window after the note is opened. On PrivateNote, sending a file requires a sender account; recipients still do not. Attached files remain fetchable for a limited window after reveal—one hour by default—not indefinitely. Use [secure file transfer](app:secure-file-transfer) when the payload is a document rather than a short secret.",
          ],
        },
      ],
    },
    {
      title: "When shouldn’t you use one?",
      paragraphs: [
        "A one-time link is the wrong tool when the job is storage, collaboration, or a record you are required to keep.",
      ],
      poorFits: [
        "Long-term password storage: use a password manager vault.",
        "Ongoing conversation: use a messenger both parties already trust, such as Signal.",
        "Organizational records that must be retained for audit or legal hold.",
        "Secrets that do not need to be transmitted at all—generate them in place, or don’t share them.",
        "Cryptocurrency seed phrases and other unrecoverable master secrets: a link can still leak if the full URL is copied. Read [crypto seed phrases and one-time links](blog:crypto-seed-phrase-one-time-link) before using this pattern there.",
      ],
    },
    {
      title: "One-time links vs email, messaging and password managers",
      paragraphs: [
        "The useful comparison is purpose and persistence—not a ranking of which channel is “secure.”",
      ],
      comparisonTable: {
        headers: ["Method", "Primary purpose", "E2EE", "Typical persistence", "Suitable for temporary secret handoff?"],
        rows: [
          [
            "Email",
            "Persistent correspondence",
            "Transport encryption is common; end-to-end is not generally the default",
            "Usually retained in multiple mailboxes, backups, and search",
            "Poor fit for plaintext secrets",
          ],
          [
            "Slack / Teams",
            "Workplace conversation and search",
            "Encrypted in transit and at rest on the platform; not end-to-end by default",
            "Searchable, exportable workspace history",
            "Poor fit for plaintext secrets; acceptable for sending a link",
          ],
          [
            "SMS / iMessage",
            "Personal messaging",
            "Varies widely by carrier and platform",
            "Often backed up or cloud-synced",
            "Poor fit for plaintext secrets",
          ],
          [
            "WhatsApp",
            "Private conversation",
            "End-to-end for chats; backups may not be",
            "Device and optional cloud backup copies",
            "Better than email for conversation; still a poor place to park a password",
          ],
          [
            "Signal",
            "Private conversation",
            "End-to-end",
            "Disappearing messages are configurable",
            "A reasonable alternative when both parties already use it",
          ],
          [
            "Password manager",
            "Credential storage and sharing",
            "Yes, by design",
            "Built for long-term retention",
            "Excellent for teams and standing access; often heavier than an ad-hoc handoff",
          ],
          [
            "PrivateNote",
            "Temporary encrypted handoff",
            "Client-side encryption; key in the URL fragment",
            "View limit plus time expiry; ciphertext deleted when those conditions are met",
            "Designed for this use case",
          ],
        ],
      },
    },
    {
      title: "The link-preview problem",
      paragraphs: [
        "Many chat apps fetch an incoming URL to build a preview—title, description, thumbnail. If merely requesting the page counted as a read, that crawler would burn a one-time link before the recipient opened it.",
        "PrivateNote does not treat a page load as a read. The public note URL returns a click-to-reveal gate. Metadata for that page can be fetched without returning plaintext. Ciphertext is retrieved only after a deliberate Reveal action. A Slack, Teams, or iMessage preview therefore does not receive the secret, and it does not consume the view limit.",
        "That is a client and API design choice, not a list of blocked crawler user-agents. It still matters how you send the link: anyone who has the full URL, including the fragment, and who clicks Reveal, can read the note. For the recipient-facing warning, see [why notes wait for click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "How to create a one-time secret link",
      paragraphs: ["Keep the steps short. The tool does the encryption; you choose the access rules."],
      numberedSteps: [
        { title: "Open PrivateNote", body: "Use the editor on the site—no account is required for a text note." },
        { title: "Enter what you need to share", body: "A password, message, API key, or, with an account, a file." },
        {
          title: "Choose expiry and access",
          body: "Prefer the shortest practical lifetime. Default is one view and a one-day unused expiry. Add a password or recipient verification when the sensitivity warrants it.",
        },
        { title: "Create the encrypted link", body: "The browser encrypts first, then uploads ciphertext." },
        { title: "Send the link to the intended recipient", body: "Do not paste the plaintext alongside it." },
      ],
      closingNote: "When you are ready, [create a one-time secret link](app:one-time-link).",
    },
    {
      title: "Before sending a secret",
      paragraphs: ["A careful handoff is mostly operational. The cryptography cannot fix a wrong recipient."],
      checklist: [
        "Confirm the recipient before you send the full URL.",
        "Use the shortest practical expiry.",
        "Add a password or recipient verification when the sensitivity warrants it.",
        "Send any extra authentication factor through a separate channel.",
        "Rotate temporary credentials after they have been used.",
        "Do not transmit secrets that do not need to move.",
        "Remember that the recipient can copy, screenshot, or photograph what they see.",
      ],
    },
    {
      title: "Frequently asked questions",
      paragraphs: [],
      faqs: [
        {
          question: "What is a one-time secret link?",
          answer:
            "A URL that delivers a secret for retrieval, then makes the server-side encrypted copy unavailable according to access and expiry rules—so the plaintext does not have to live in email or chat history.",
        },
        {
          question: "How does a one-time link work?",
          answer:
            "The sender’s browser encrypts the content, the server stores ciphertext, and the decryption key stays in the URL fragment. The recipient reveals the note in their browser, which decrypts it locally.",
        },
        {
          question: "Are one-time secret links secure?",
          answer:
            "They can be, when encryption is client-side, keys are strong, and access plus expiry are real. They do not protect compromised devices or a recipient who copies the secret after viewing it.",
        },
        {
          question: "What happens after a one-time link is opened?",
          answer:
            "On PrivateNote, a successful reveal counts as a view. With the default one-view limit, the server then deletes the ciphertext. The content can remain visible in the already-open browser. Unused links also expire on a timer.",
        },
        {
          question: "Can I send a password with a one-time link?",
          answer:
            "Yes. Put the password in the note, not in the chat message that carries the link. See [how to share a password securely](blog:how-to-share-a-password-securely) for split-channel tips.",
        },
        {
          question: "Can I send a file with a one-time link?",
          answer:
            "Yes, through PrivateNote’s [secure file transfer](app:secure-file-transfer). Sending requires a free account; opening does not. After reveal, attachments follow a separate access window—one hour by default.",
        },
        {
          question: "Is a one-time link safer than email?",
          answer:
            "Safer for the secret itself, because email keeps plaintext. The link can still travel over email; the difference is that the mailbox holds a URL, not the credential.",
        },
        {
          question: "Can someone screenshot a one-time secret?",
          answer:
            "Yes. Once content is on a screen, it can be copied, photographed, or captured. A one-time link limits the original server copy; it is not DRM.",
        },
        {
          question: "What’s the difference between a one-time link and an expiring link?",
          answer:
            "One-time is about access: unavailable after the intended retrieval. Expiring is about time: unavailable after a deadline even if never opened. PrivateNote uses both.",
        },
        {
          question: "Does the recipient need an account?",
          answer:
            "No. Anyone with the full link can open an unprotected note. A password or recipient verification applies only if the sender enabled it.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Channel Type",
    encrypted: "Encrypted?",
    persistent: "Persistent?",
    verdict: "Good for One-Time Secrets?",
  },
  goodFitsLabel: "Good fits",
  poorFitsLabel: "Poor fits",
  closingTitle: "Where PrivateNote fits",
  closingBody:
    "PrivateNote is a handoff tool. It is not a long-term password vault, a team wiki, or a compliance archive. Encrypt in the browser, share a temporary link, and let the server-side copy expire when the job is done.",
  encryptLu: "",
  tagline: "Match the lifetime of the secret to the lifetime of the medium that carries it.",
  relatedReading: "Related reading",
  ctaTitle: "Create a one-time secret link",
  ctaBody: "Encrypt a message, password, or file in your browser and share it through a temporary link.",
  ctaButton: "Create a secure link",
};
