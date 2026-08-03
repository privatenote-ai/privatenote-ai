import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseEn: CryptoSeedArticleCopy = {
  heroAlt: "Encrypted file sharing concept illustrating local encryption before uploading secrets",
  intro: [
    "A cryptocurrency seed phrase is one of the most valuable secrets you will ever own. It usually cannot be reset. There is no \"Forgot password.\" Whoever holds it typically controls the wallet and everything in it.",
    "That may sound odd on the blog of a company that builds encrypted one-time links. Security is not pretending every tool fits every job—it is matching the approach to what you are protecting, including our own limits.",
    "For **replaceable secrets**—such as Wi‑Fi passwords, temporary credentials, MFA recovery codes, many API keys, and confidential business messages—a [encrypted one-time link](blog:one-time-secret-links) is an excellent solution.",
    "**Long-lived master secrets**, such as cryptocurrency seed phrases, deserve a different approach.",
  ],
  ruleTitle: "Rule #1",
  ruleParagraphs: [
    "**Do not enter a cryptocurrency seed phrase into a website—including PrivateNote.** If transmission is unavoidable, encrypt locally first and share **only the ciphertext**. PrivateNote is for transporting pre-encrypted data, not for typing the mnemonic.",
    "**Legitimate hardware wallet vendors do not ask you to enter your recovery phrase on a website.** If a site requests your seed phrase, treat it as highly suspicious—verify authenticity before you proceed.",
    "Avoid entering seed phrases on websites whenever possible.",
  ],
  offlineAlternatives: [
    { label: "Metal backup", body: "stored in a safe or safety deposit box" },
    { label: "SLIP-39", body: "or similar schemes for inheritance or disaster recovery" },
    { label: "Hardware wallet transfer", body: "when practical, instead of the recovery phrase" },
  ],
  seedPhraseTraits: [
    { label: "Grants full control", body: "over assets" },
    { label: "Often lasts decades", body: "without rotation" },
    { label: "Cannot be changed", body: "if compromised" },
    { label: "Has no vendor recovery", body: "if stolen" },
  ],
  oneTimeLinkFit: [
    "API keys & temporary passwords",
    "Wi‑Fi credentials",
    "MFA recovery codes",
    "Business messages & legal drafts",
    "Temporary access tokens",
  ],
  localEncryptFirst: [
    "Cryptocurrency seed phrases",
    "Hardware wallet backups",
    "CA private keys & signing keys",
    "Password manager recovery material",
    "High-value master secrets",
  ],
  philosophySteps: [
    "avoid transmitting when you can",
    "encrypt locally",
    "upload ciphertext only",
    "erase temporary plaintext",
    "send the age file passphrase—not the mnemonic—on a separate channel when possible",
  ],
  sections: {
    sendAtAll: {
      title: "Do you need to send it at all?",
      question: "**does the phrase need to leave where it is?** Often, no.",
      outro:
        "Every transmission adds a chance of disclosure. If you can avoid sending it, do. For other channels that also retain secrets indefinitely, see [why email is the worst place for secrets](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Why seed phrases are different",
      p1: "A seed phrase is the root secret for an entire digital estate—not \"just another password.\"",
      listIntro: "Unlike most credentials, it:",
      outro:
        "You are not only defending against today's attackers—you are making choices that may matter ten or twenty years from now.",
    },
    browserEncryption: {
      title: "Browser encryption is strong—but not magic",
      paragraphs: [
        "PrivateNote encrypts in your browser before upload. Our servers see ciphertext only; the key never reaches us. That is far better than [email](blog:why-email-is-worst-for-secrets), chat, or cloud docs for everyday secrets—and aligns with a strict [end-to-end encryption](blog:what-is-end-to-end-encryption) model for the note contents.",
        "Every browser crypto app shares one constraint: **plaintext must exist in the browser before encryption.** Malicious JavaScript—from extensions, supply-chain compromise, injection, or a bad CDN—could theoretically read it first. That is inherent to client-side encryption in the browser, not unique to PrivateNote.",
        "For API keys and temp passwords, that trade-off is usually fine. For a seed phrase protecting life savings, you may want to trust fewer systems.",
      ],
    },
    encryptLocal: {
      title: "Encrypt before the browser sees it",
      intro: "Encrypt locally, then upload ciphertext only:",
      outro: "PrivateNote never receives the mnemonic—only encrypted data.",
      callout:
        "Local encryption does **not** stop malware on your machine. It **keeps plaintext off web apps, cloud services, and servers** that do not need it. You shrink the trusted computing base; you do not eliminate a compromised endpoint.",
    },
    whichTool: {
      title: "Which tool to use",
      age: "**age** (recommended for most users): simple file encryption with secure defaults — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: excellent if you already use OpenPGP.",
      openssl: "**OpenSSL**: trusted and powerful; low-level CLI—better for experienced users.",
    },
    ageExample: {
      title: "Minimal example (age)",
      passphraseTitle: "Need a strong passphrase?",
      passphraseBefore: "Use a long, unique secret for `age -p`. Generate one locally in your browser—the",
      passphraseLink: "passphrase generator",
      passphraseAfter: "on passwords.lu runs client-side; nothing is uploaded.",
      p1: "After `seed.txt.age` is verified, **securely erase plaintext** on the sender's device. After the recipient imports into a wallet, **erase their plaintext copy** too.",
      p2: "For regular exchange with someone, `age -r` (public-key mode) avoids a shared passphrase—worth learning separately.",
      docsLabel: "Docs:",
    },
    separateChannels: {
      title: "Use separate channels",
      intro:
        "Split the encrypted file from the secret that unlocks it. You are separating the `.age` ciphertext from the **age decryption passphrase**—not sending the seed phrase mnemonic through a second channel.",
      steps: [
        "Upload the **encrypted file** (ciphertext) with PrivateNote",
        "Send the **age passphrase** that decrypts that file—via Signal, phone, or in person",
      ],
      outro: "An attacker must compromise multiple systems—not one link.",
    },
    recommend: {
      title: "What we recommend",
      intro:
        "The split is really about **replaceable** versus **long-lived master** secrets—not the file format or channel alone.",
      oneTimeTitle: "Good fit for one-time links",
      oneTimeSubtitle: "Replaceable secrets you can rotate or revoke",
      localTitle: "Encrypt locally first",
      localSubtitle: "Long-lived master secrets that rarely change",
      outro:
        "For API keys specifically, see our guide on [how to share an API key securely](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Match the tool to the risk",
      body: "Every approach has trust assumptions—password managers, hardware wallets, offline tools, browser crypto. None is perfect; trade-offs differ. The question is whether they fit the **value** of what you protect.",
    },
    philosophy: {
      title: "Our philosophy",
      p1: "We built PrivateNote so encryption happens **before** data reaches our servers. For temporary, replaceable secrets, that beats email, messaging, or cloud storage. You can also [send a secret without an account](blog:send-secret-message-without-account). Read [how PrivateNote works](app:how-it-works) for the full model.",
      listIntro: "For a seed phrase that could be your life savings:",
      closingQuote:
        "Sometimes the best advice is not \"use our product.\" It is \"use the right tool for the job.\"",
    },
  },
  ctaTitle: "Share replaceable secrets—not seed phrases—in the browser",
  ctaBody:
    "Create an encrypted one-time note for API keys, passwords, and credentials. For seed phrases, encrypt locally with age first, then share only the ciphertext.",
  ctaButton: "Try PrivateNote ->",
};
