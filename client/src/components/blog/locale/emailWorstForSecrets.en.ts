import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsEn: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Laptop on a desk showing an email with server credentials and an SSH private key in plain text",
  intro:
    "Email has become the default way to exchange almost everything—contracts, passwords, API keys, bank details, medical records, identity documents, Wi‑Fi passwords, and recovery codes. Most of us send sensitive information over email without thinking twice.",
  calloutTitle: "Email was built to deliver messages—not to make them disappear",
  calloutBody:
    "Once you send an email, you often lose control over where it ends up, how long it is stored, and who may eventually have access to it. If you're sending anything that should remain private, email is usually the wrong tool.",
  emailCopies: [
    "your mailbox",
    "the recipient's mailbox",
    "mail provider backups",
    "archived copies",
    "synchronized devices",
    "company backup systems",
    "exported PST or MBOX files",
    "disaster recovery infrastructure",
  ],
  agedSecretsExamples: [
    "a production database password",
    "an API key",
    "SSH credentials",
    "VPN login details",
    "a cryptocurrency recovery phrase",
  ],
  forwardingPaths: [
    "forwarded",
    "copied into ticketing systems",
    "pasted into chat applications",
    "attached to other emails",
    "shared with contractors",
    "included in support requests",
  ],
  aiProcessingUses: [
    "spam detection",
    "phishing protection",
    "malware detection",
    "smart replies",
    "inbox categorization",
    "search",
    "productivity features",
    "AI-assisted writing and summarization",
  ],
  oneTimeSecretExamples: [
    "a password",
    "an API key",
    "a recovery code",
    "a software license",
    "a server credential",
    "a confidential message",
  ],
  oneTimeBenefits: [
    "No inbox history.",
    "No searchable archive.",
    "No accidental forwarding of the secret itself.",
    "No forgotten copies sitting in mailboxes for years.",
  ],
  sections: [
    {
      title: "Your email doesn't just exist in one place",
      paragraphs: [
        "Many people imagine email as a simple conversation between two people. In reality, every email typically exists in multiple locations:",
        "Even if you delete an email, copies may continue to exist elsewhere. Some organizations retain email for years to satisfy legal, regulatory, or business requirements. In practice, an email often becomes permanent.",
      ],
    },
    {
      title: "Secrets age poorly",
      paragraphs: [
        "The most dangerous thing about email is not necessarily today. It's five years from now. Imagine you emailed someone:",
        "Perhaps the credentials have since changed. Perhaps they haven't. Years later, that email may still be sitting in multiple inboxes, searchable in seconds. Anyone who gains access to one of those accounts suddenly has a map of your past secrets. Our guide on [secrets you should never send in chat](blog:secrets-never-send-in-chat) covers similar risks in messaging apps—email is often worse because the retention is longer and the copies are more numerous.",
      ],
    },
    {
      title: "Email is designed to be searchable",
      paragraphs: [
        "Modern email clients are incredibly good at finding old messages. Search for `password`, `API`, or `confidential`, and messages from years ago appear almost instantly.",
      ],
      callout:
        "This is a fantastic feature for everyday communication. It is a terrible feature for secrets. Sensitive information should become **harder** to find over time—not easier.",
    },
    {
      title: "Forwarding takes one click",
      paragraphs: [
        "Perhaps you trust the recipient. That isn't always enough. Emails are routinely:",
        "Once a secret leaves your inbox, you no longer control how many copies exist. Unlike a password manager or encrypted sharing service, email has no concept of revoking access after delivery.",
      ],
    },
    {
      title: "AI is increasingly processing email",
      paragraphs: [
        "Another reason to think carefully before emailing sensitive information is that email providers increasingly use automated systems to process messages. These systems may help with:",
        "Providers differ significantly in how these features work, what data is processed, and under what privacy policies. While many providers have introduced stronger privacy commitments in recent years, sending sensitive information by email still means entrusting that information to systems outside your control. If your goal is to minimize exposure, reducing the amount of sensitive information sent through email is a sensible first step.",
      ],
    },
    {
      title: "Regulatory scanning is also part of the discussion",
      paragraphs: [
        "Privacy is no longer just a technical question. It has become a policy question. In July 2026, the European Parliament approved an extension of the temporary legal framework that allows providers of certain communication services to voluntarily detect and report child sexual abuse material (CSAM) until April 2028.",
        "The framework primarily affects services that can access message contents, such as many traditional email providers and other non-[end-to-end encrypted](blog:what-is-end-to-end-encryption) communication services. For more on what that vote meant—and why more “No” votes than “Yes” still resulted in approval—see our explainer on [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "The stated goal is child protection, and reasonable people can disagree about the appropriate balance between privacy and public safety. Nevertheless, the discussion illustrates an important point: **if a service can read your messages, then future laws, policies, or platform decisions may affect how those messages are processed.** By contrast, end-to-end encrypted services are fundamentally different because the provider does not possess the cryptographic keys needed to read the contents.",
    },
    {
      title: "There is a better way to share secrets",
      paragraphs: [
        "Not every piece of information needs to live forever. Sometimes you simply need to send something once. Examples include:",
        "Instead of sending these directly in an email, send a [one-time encrypted link](blog:one-time-secret-links). The recipient opens the link, reads the secret, and the encrypted data is permanently deleted. For API keys specifically, see our workflow guide on [how to share an API key securely](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "Browser encryption makes a difference",
      paragraphs: [
        "At PrivateNote, encryption happens inside your browser before anything is uploaded. Your browser encrypts the message locally. Only the encrypted ciphertext reaches our servers. The decryption key never leaves your device and is never stored by us.",
        "When the recipient opens the note, it can be configured to self-destruct after the first successful read or automatically expire after a chosen period. That means there is no permanent email containing the secret waiting to be discovered years later. You can [send a secret message without creating an account](blog:send-secret-message-without-account), or read [how PrivateNote works](app:how-it-works) for the full encryption model.",
      ],
      callout:
        "The practical test is simple: can the provider obtain the decryption key or the plaintext? If yes, the system is not truly end-to-end encrypted. Email fails that test by design.",
    },
    {
      title: "The right tool for the right information",
      paragraphs: [
        "Email remains one of the most useful communication technologies ever created. It is excellent for conversations, invoices, newsletters, and everyday business communication.",
        "It is not the ideal place for information that should disappear after it has served its purpose. Passwords, recovery codes, API keys, confidential documents, and other sensitive information deserve a sharing mechanism designed with privacy in mind.",
        "**Sometimes the safest secret is the one that simply doesn't exist anymore.**",
      ],
    },
  ],
  ctaTitle: "Share a secret without leaving it in anyone's inbox",
  ctaBody:
    "Create an encrypted one-time note in your browser. Send the link by email if you must—the secret itself stays out of the thread.",
  ctaButton: "Try PrivateNote ->",
};
