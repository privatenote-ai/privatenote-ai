import type { PrivnoteAlternativeCopy } from "./copy.types";

/**
 * Competitor claims (not shown on the page).
 *
 * Feature | Privnote | PrivateNote | Source / confidence
 * Self-destructing notes | Yes (read-once default; optional 1h/24h/7d/30d; unread deleted after 30 days) | Yes | privnote.com homepage + FAQ. High.
 * No recipient account | Yes | Yes | privnote.com/info/about. High.
 * Password protection | Yes (manual password) | Yes | privnote.com homepage options. High.
 * Encrypted file attachments | Not offered on the current public product | Yes | Official composer is text-only; FAQ/about do not describe files. High.
 * Multiple files / photos / audio / video | Not offered | Yes | Same official product surface. High.
 * Open/access notifications | Yes (email when a note is read/destroyed) | Yes, with a free account | privnote.com/info/faq. High.
 * Recipient verification | Not described | Starter and Business | Official FAQ does not mention a second-factor code. Conservative: not offered.
 * Scheduled reveal | Not described | Starter and Business | Privnote expiry is note lifetime, not a scheduled first-open time. Conservative: not offered.
 * Business branding | Not described | Business | Conservative: not offered.
 * Developer tools (CLI, MCP, extensions) | Not described | Yes | Conservative: not offered.
 * Secure Requests | — | Not production-ready | Omitted from the page.
 * AI writing assistance | Not described | Available | Omitted from the comparison table (not the search intent).
 */
export const privnoteAlternativeEn: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Privnote alternative",
  eyebrow: "Privnote alternative",
  heroTitleLine1: "A Private Privnote Alternative",
  heroTitleLine2: "for Notes, Passwords & Files",
  heroBody:
    "PrivateNote keeps the simplicity of a disappearing note and adds encrypted file sharing, password protection, recipient controls, and tools for handing off sensitive information.",
  primaryCta: "Create a private note",
  secondaryCta: "See how it works",
  trustLine: "No account required for notes · Client-side encryption · Read-once sharing",

  introHeading: "If you already know Privnote",
  introBody:
    "If you are looking for a Privnote alternative, PrivateNote follows the same idea: create a private link, share it, and have the content expire or disappear after it is opened. Encryption happens in your browser before anything is uploaded. Recipients open the link and decrypt locally. They do not need an account.",
  introBody2:
    "PrivateNote extends that workflow beyond a short text message. You can share passwords, documents, photos, voice or video recordings, and other files in the same encrypted handoff, with extra controls when the situation needs them.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Both services are designed around temporary sharing. PrivateNote extends the idea to files, media, recipient controls, and business workflows.",
  compareFeatureColumn: "Feature",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Yes",
  compareNo: "Not offered",
  comparePaid: "Starter and Business",
  compareRows: [
    { feature: "Self-destructing notes", privnote: "yes", privatenote: "yes" },
    { feature: "No recipient account required", privnote: "yes", privatenote: "yes" },
    { feature: "Password protection", privnote: "yes", privatenote: "yes" },
    { feature: "Encrypted file attachments", privnote: "no", privatenote: "yes" },
    { feature: "Multiple files in one link", privnote: "no", privatenote: "yes" },
    { feature: "Photos, audio, and video", privnote: "no", privatenote: "yes" },
    { feature: "Open and destroy notifications", privnote: "yes", privatenote: "yes" },
    {
      feature: "Recipient verification",
      privnote: "no",
      privatenote: "paid",
    },
    {
      feature: "Scheduled reveal",
      privnote: "no",
      privatenote: "paid",
    },
    {
      feature: "Business branding on the reveal page",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Developer tools (CLI, MCP, extensions)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Features can change. Comparison based on publicly available product information as of September 2026.",
  compareCta: "Try PrivateNote",

  whyHeading: "Why look for a Privnote alternative?",
  whyBody:
    "Privnote works well when the requirement is simple: send a temporary text note. Temporary text is only one way sensitive information moves between people.",
  whyBody2:
    "You may need to send a PDF, share several files, confirm that a link was opened, protect access with a password, or deliver confidential documents without leaving them in ordinary email.",
  whyClose: "That is the problem PrivateNote is designed to address: a secure handoff, not only a disappearing message.",

  passwordHeading: "A Privnote alternative for sharing passwords",
  passwordBody:
    "Wi-Fi passwords, API keys, and recovery codes often travel in the same email or chat that explains what they are for. That can leave copies in conversation history, synced devices, and backups.",
  passwordBody2:
    "PrivateNote puts the credential behind a separate encrypted link. You send the context in the channel you already use, and the secret in a temporary note that can expire, burn after reading, and optionally require a password. It is a handoff, not a password manager.",
  passwordCta: "Share a password securely",
  passwordArticleLink: "How to share a password securely",

  filesHeading: "Send files, not just text",
  filesBody:
    "Contracts, identity documents, financial PDFs, configuration files, photos, and archives are often the actual payload. A disappearing text note cannot carry them. PrivateNote keeps the note and its encrypted attachments in the same secure handoff, so the message and files travel together.",
  filesBody2:
    "Sending files requires a free PrivateNote account so storage and transfer limits can be enforced. Recipients still open the link without signing in. After the first reveal, attachments remain available for a limited window rather than remaining as a long-lived shared folder.",
  filesLimits:
    "Current limits: Free up to {freeSize} per file and {freeCount} files per transfer ({freeTransfers} transfers a month). Starter up to {starterSize} and {starterCount} files. Business up to {businessSize} and {businessCount} files.",
  filesCta: "Send an encrypted file",
  filesArticleLink: "Send sensitive documents securely",

  mediaHeading: "Share sensitive photos, audio and video",
  mediaBody:
    "Some information never starts as a file on disk. You may need to capture a document with the camera, record a short voice message, or attach an existing photo without first sending it through another messaging app.",
  mediaBody2:
    "PrivateNote can take a photo, record audio or video, or attach existing media. Capture happens in the browser, then the same client-side encryption used for files applies before upload.",
  mediaPhotoLink: "How to share photos securely",
  mediaVoiceLink: "Encrypted voice messages",

  businessHeading: "When a disappearing note becomes a business workflow",
  businessBody:
    "The same private link is useful when the sender is an accountant, an IT administrator, a consultant, or a firm handing confidential files to a client. The need is not only secrecy. It is confirmation, control, and a professional delivery.",
  businessScenarios: [
    "An accountant sends confidential figures to a client.",
    "An IT administrator sends credentials to an employee.",
    "A firm sends identity or financial documents to a customer.",
    "A consultant transfers project files that should not linger in email.",
    "A company needs to know that sensitive information was accessed.",
  ],
  businessBody2:
    "Starter and Business add recipient verification, scheduled reveal, proof of access, longer access windows, revoke for unopened notes, and a sent-notes overview. Business adds branded reveal pages, view-only file access, and larger transfers. Encryption remains client-side on every plan.",
  businessCta: "Explore PrivateNote for Business",
  businessNotifyLink: "Know when a secret link is opened",
  businessVerifyLink: "Recipient verification",

  securityHeading: "How PrivateNote protects your content",
  securityBody:
    "Sensitive content is encrypted in your browser before it is uploaded. PrivateNote’s infrastructure stores ciphertext rather than the plaintext note or file.",
  securityArchitecture:
    "For a standard note, the browser generates a random 256-bit encryption key and uses AES-256-GCM authenticated encryption. The decryption key is carried in the URL fragment — the part after #. Browsers do not include the fragment in normal HTTP requests, so the server does not receive the key as part of the request URL.",
  securityRecipient:
    "The recipient’s browser uses the key from the shared link to decrypt the content locally.",
  securityLimitation:
    "Anyone who later has the full link can still copy or screenshot what they see. PrivateNote controls the handoff, not what a recipient does after opening it.",
  securityFlowWrite: "Write / attach",
  securityFlowEncrypt: "Encrypt in browser",
  securityFlowCiphertext: "Upload ciphertext",
  securityFlowShare: "Share private link",
  securityFlowDecrypt: "Recipient decrypts",
  securityEncryptionLink: "Read how PrivateNote encryption works",
  securityHowItWorksLink: "How it works in detail",
  founderHeading: "Built with cryptography in mind",
  founderBody:
    "PrivateNote is developed by Marjan Skrobot, a cryptography and information-security researcher. Its security model and limitations are documented publicly, including what PrivateNote can — and cannot — protect against.",
  founderLink: "About the security model",

  decideHeading: "Which should you use?",
  decidePrivnoteTitle: "Privnote may be enough if…",
  decidePrivnoteItems: [
    "You only need to send a temporary text note.",
    "You want the simplest possible workflow.",
    "You don’t need file attachments or additional delivery controls.",
  ],
  decidePrivateNoteTitle: "PrivateNote may be a better fit if…",
  decidePrivateNoteItems: [
    "You want documented client-side encryption.",
    "You need to share files or media as well as text.",
    "You need recipient verification or scheduled reveal.",
    "You want access notifications or proof of access.",
    "You need professional branding or business delivery controls.",
  ],
  decideOneTimeLink: "How one-time secret links work",
  decideDevelopersLink: "Developer tools",

  faqHeading: "Frequently asked questions",
  faqs: [
    {
      question: "What are some alternatives to Privnote?",
      answer:
        "Several services provide temporary or encrypted note sharing. PrivateNote is designed for people who want the disappearing-note workflow but also need encrypted files, media, recipient controls or business delivery features.",
    },
    {
      question: "How does PrivateNote differ from Privnote?",
      answer:
        "Both create a temporary private link that the recipient can open without an account. PrivateNote adds encrypted attachments, in-browser photo and audio capture, optional password protection on the same workflow, and paid controls such as recipient verification and branded reveal pages. Privnote is focused on self-destructing text notes.",
    },
    {
      question: "Can I use PrivateNote without an account?",
      answer:
        "Yes. You can create a basic encrypted text note without signing in. Recipients never need an account. Sending files, photos, or recordings requires a free account so storage and monthly transfer limits can be enforced.",
    },
    {
      question: "Can I send files with PrivateNote?",
      answer:
        "Yes. Attach one or more files to the same encrypted note. Files are encrypted in the browser before upload. Sending requires a free account; opening the link does not. Recipients can download attachments during a limited window after the note is revealed.",
    },
    {
      question: "Can I share passwords with PrivateNote?",
      answer:
        "Yes. Put the password in the note and send the encrypted link instead of the password itself. You can add a separate passphrase and keep expiry short. After the recipient has used a high-value credential, rotate it. A private note is a handoff, not a password manager.",
    },
    {
      question: "How does PrivateNote encrypt notes?",
      answer:
        "The browser generates a random 256-bit encryption key and uses AES-256-GCM to encrypt the note before upload. The key is carried in the URL fragment — the part after # — which browsers do not send as part of a normal HTTP request. Password-protected notes wrap that key with Argon2id. File attachments are encrypted in the browser as well.",
    },
    {
      question: "Does the recipient need a PrivateNote account?",
      answer:
        "No. Recipients open the link in a browser and decrypt the content locally. They do not sign in. Anyone who has the full link, and the password if you set one, can open the note.",
    },
  ],

  finalHeading: "Share something privately.",
  finalBody: "Create an encrypted note or file handoff and send the link to your recipient.",
  finalPrimaryCta: "Create a private note",
  finalSecondaryCta: "See plans",
  finalTrust: "No account required to get started.",
};
