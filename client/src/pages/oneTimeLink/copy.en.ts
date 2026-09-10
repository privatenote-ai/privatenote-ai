import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkEn: OneTimeLinkCopy = {
  heroTitle: "Create a One-Time Link",
  heroSubtitle:
    "Share passwords, messages, and files through an encrypted link · Encrypted in your browser · Recipients don’t need an account",
  whatHeading: "What is a one-time link?",
  whatBody:
    "A one-time link is a safer way to hand off information that should not remain indefinitely available through ordinary communication channels. You put a password, API key, recovery code, private message, sensitive document, or temporary credential behind an encrypted URL. The recipient opens the link to retrieve and decrypt it in their browser. PrivateNote encrypts the content in your browser before it is uploaded, so the server receives encrypted data rather than plaintext. You choose how long the unused link remains available and how many times it can be opened. That makes a one-time link a secure handoff, not a place to store secrets permanently.",
  whatLearnMore: "Learn how one-time secret links work",
  stepsHeading: "How to create a one-time link",
  step1Title: "Add your content",
  step1Body: "Enter a private message, password, or attach a file.",
  step2Title: "Set access",
  step2Body: "Choose expiry, how many times the link can be opened, and optional password protection.",
  step3Title: "Send the link",
  step3Body: "PrivateNote encrypts the content in your browser and returns a link you can send through the channel you already use.",
  useHeading: "What you can share with PrivateNote",
  usePasswordsTitle: "Passwords and credentials",
  usePasswordsBody:
    "Share passwords and temporary credentials without leaving the plaintext sitting in email or chat.",
  usePasswordsLink: "How to share a password securely",
  useApiTitle: "API keys",
  useApiBody:
    "Share API keys, tokens, and webhook secrets without leaving them in chat history or tickets.",
  useApiLink: "How to share an API key securely",
  useMessagesTitle: "Private messages",
  useMessagesBody:
    "For information that should not remain indefinitely searchable in email or chat history after it has been read.",
  useMessagesLink: "Send a secret message without an account",
  useFilesTitle: "Files and documents",
  useFilesBody:
    "For sensitive files where you want encrypted delivery and controlled availability rather than a long-lived shared folder.",
  useFilesLink: "Secure file transfer",
  persistHeading: "Why use a one-time link?",
  persistBody:
    "Sending a password through email, Slack, Teams, SMS, or another messaging service can leave a copy in conversation history, synchronized devices, backups, notifications, and searchable archives. Encryption protects the transfer. Expiration reduces how long the original remains available.",
  handoffHeading: "Built for a secure handoff",
  handoffBody:
    "PrivateNote encrypts messages and files in the browser before they are uploaded. The server receives encrypted data rather than readable content. Decryption happens in the recipient’s browser.",
  handoffEncryptionLink: "How the encryption works",
  handoffHowItWorksLink: "PrivateNote in detail",
  limitsHeading: "What a one-time link cannot prevent",
  limitsBody:
    "After opening, an authorized person can still copy, save, or photograph the information. PrivateNote protects the handoff and limits how long the original link stays available. It does not delete copies already saved.",
  faqHeading: "Frequently asked questions",
  faqs: [
    {
      question: "What is a one-time link?",
      answer:
        "A one-time link is a way to share confidential information temporarily. Instead of sending a password, a message, or a file directly through email or chat, you share an encrypted link with limited lifetime and access. PrivateNote encrypts the content in your browser so the original secret does not sit indefinitely in conversation history.",
    },
    {
      question: "How do I create a one-time link?",
      answer:
        "Use the form at the top of this page. Add a message, password, or file, choose how long the unused link should remain available and how many times it can be opened, then create the link. PrivateNote encrypts the content in your browser and returns a URL you can send through the channel you already use.",
    },
    {
      question: "Can I send a password with a one-time link?",
      answer:
        "Yes. Put the password in the note and send the encrypted link instead of the password itself. You can add a separate passphrase for extra protection. For valuable accounts, rotate the credential after the recipient has used it. A one-time link is a handoff, not a password manager.",
    },
    {
      question: "Can I send a file through a one-time link?",
      answer:
        "Yes. Attach a file or folder to the same encrypted note. Files are encrypted in the browser before upload. Sending attachments requires a free PrivateNote account so storage limits can be enforced. Recipients still do not need an account to open the link.",
    },
    {
      question: "Does the recipient need a PrivateNote account?",
      answer:
        "No. Recipients open the link in a browser and decrypt the content locally. They do not need to sign in. You can also create a basic text note without an account. Sending files requires a free account for abuse prevention and storage limits.",
    },
    {
      question: "What happens after someone opens the link?",
      answer:
        "The recipient’s browser decrypts the content locally. Free notes are read-once: after that open, the original note is destroyed. Starter can allow up to three opens and Business up to ten. If nobody opens the link, it expires after the lifetime you set — at most three days on the free plan. Attached files remain viewable for a limited window after the first open.",
    },
    {
      question: "Can someone screenshot a PrivateNote?",
      answer:
        "Yes. Anyone who can see the revealed content can screenshot, photograph, or copy it. PrivateNote does not claim to block that. It controls the encrypted transfer and how long the original link stays available.",
    },
    {
      question: "How long can a PrivateNote link remain active?",
      answer:
        "If the note is never opened, free links expire in at most three days. Starter allows up to 15 days and Business up to 30 days. After opening, free notes are read-once. Starter can allow up to three opens and Business up to ten. Choose the shortest lifetime that still lets the recipient complete the handoff.",
    },
  ],
  articleLearnMore: "Learn more about how one-time links work and how they stay secure",
  backToCreate: "Ready? Create a one-time link ↑",
};
