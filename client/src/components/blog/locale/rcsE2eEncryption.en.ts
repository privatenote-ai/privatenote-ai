import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionEn: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "iPhone and Android phones with lock icons in message bubbles, connected by a central padlock representing end-to-end encrypted RCS",
  heroCaption:
    "Cross-platform RCS is finally catching up: the same end-to-end encryption guarantee, whether the bubble is blue or green.",
  intro: [
    "For years, one of the biggest frustrations in mobile messaging wasn’t the lack of features—it was the lack of consistent privacy.",
    "Apple users enjoyed end-to-end encrypted conversations through iMessage, while Android users could benefit from encryption when using Google Messages with other Android devices. Messages sent between Android and iPhone users never had the same protection. Cross-platform conversations relied on Rich Communication Services (RCS), but without interoperable end-to-end encryption.",
    "That is finally changing.",
    "Google recently announced that end-to-end encrypted RCS messaging between Android and iPhone is beginning to roll out, following the publication of the latest GSMA RCS Universal Profile, which incorporates the Messaging Layer Security (MLS) protocol. As support expands across devices and messaging applications, billions of users will gain stronger privacy for everyday conversations.",
    "This is a major milestone for digital communication. It also offers a good opportunity to understand what [end-to-end encryption](blog:what-is-end-to-end-encryption) actually protects—and what it doesn’t.",
  ],
  sections: [
    {
      title: "A better standard for everyday messaging",
      paragraphs: [
        "The transition from SMS to RCS has modernized text messaging with features such as high-quality photo sharing, typing indicators, read receipts, and richer group conversations. Security, however, has remained inconsistent depending on which devices were involved.",
        "Until now, Android users messaging other Android users could enjoy end-to-end encryption through Google Messages, while iPhone users had the same protection within iMessage. Messages exchanged between Android and iPhone, however, lacked interoperable end-to-end encryption.",
        "The updated RCS standard changes that. As support is rolled out, users on both platforms can finally benefit from the same fundamental privacy guarantees regardless of which phone they own.",
        "For a communication technology used by billions of people, this is an important step forward.",
      ],
    },
    {
      title: "What end-to-end encryption actually means",
      paragraphs: [
        "End-to-end encryption means that a message is encrypted before it leaves the sender’s device and can only be decrypted on the recipient’s device.",
        "Unlike traditional transport encryption, where a service provider may be able to access messages once they reach its servers, end-to-end encryption ensures that only the communicating devices possess the keys required to read the conversation. The messaging service transports encrypted data but cannot decrypt its contents.",
        "For users, the benefit is straightforward: your conversation remains private between you and the person you’re talking to.",
        "Properly implemented end-to-end encryption protects against many common threats. Someone monitoring a public Wi-Fi network cannot simply read your messages, internet service providers cannot inspect their contents, and a breach of the messaging provider’s servers would expose encrypted data rather than readable conversations.",
        "For everyday communication, this represents a significant improvement in privacy. For a deeper technical definition, see our guide to [what end-to-end encryption means](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Encryption has limits",
      paragraphs: [
        "As important as end-to-end encryption is, it is often misunderstood.",
        "Encryption protects messages while they are being transmitted and while they are stored by the messaging provider. It does not control what happens after the message has been delivered.",
        "Once a message has been decrypted on the recipient’s phone, it becomes ordinary information again. The recipient may keep it indefinitely, forward it to someone else, copy its contents into another application, or simply take a screenshot. Depending on the messaging platform, conversations may also be synchronized across multiple devices or included in cloud backups.",
        "In other words, end-to-end encryption secures delivery—it does not guarantee that information disappears after it has been read.",
      ],
      callout:
        "This distinction becomes increasingly important when the information being shared is particularly sensitive—passwords, recovery codes, API keys, and other credentials that should not live forever in a searchable chat history.",
    },
    {
      title: "Not every secret belongs in chat history",
      paragraphs: [
        "Most conversations deserve to be preserved. Messages with family, discussions with friends, or work-related conversations often become a useful record that people expect to revisit later.",
        "Sensitive credentials are different.",
        "Imagine sending a temporary administrator password to a colleague. The password travels securely across the internet thanks to end-to-end encryption, but six months later it may still be sitting inside a searchable conversation history. The same applies to API keys, recovery codes, cryptocurrency seed phrases, confidential client information, or temporary login credentials.",
        "In many real-world security incidents, the problem isn’t that the secret was intercepted during transmission. It’s that it remained stored somewhere long after it was supposed to be forgotten.",
        "As messaging becomes increasingly secure, attention is gradually shifting toward a different challenge: reducing unnecessary persistence. That is why some [secrets should never be sent in chat](blog:secrets-never-send-in-chat) at all—encrypted or not.",
      ],
    },
    {
      title: "When one-time links make more sense",
      paragraphs: [
        "For information that only needs to be shared once, leaving it inside a permanent conversation isn’t always ideal.",
        "An increasingly common alternative is to share sensitive information through [encrypted one-time links](blog:one-time-secret-links) that automatically expire or become inaccessible after they have been viewed. Instead of embedding the secret directly inside an ongoing conversation, the recipient opens a dedicated link, retrieves the information, and the link eventually expires—or, in some cases, can only be accessed once.",
        "This approach doesn’t replace encrypted messaging. Rather, it complements it by addressing a different problem.",
        "Messaging applications are designed to preserve conversations. One-time links are designed to minimize the long-term exposure of information that ideally shouldn’t remain stored indefinitely.",
        "Whether you’re sharing a temporary password, an API token, a software license key, or another confidential value, limiting how long that information exists can significantly reduce the risk of accidental disclosure later.",
      ],
    },
    {
      title: "Privacy is more than encryption",
      paragraphs: [
        "The rollout of interoperable end-to-end encrypted RCS messaging is genuinely good news. For the first time, Android and iPhone users can enjoy the same level of protection regardless of which ecosystem they use.",
        "It’s also a reminder that privacy is about more than encryption alone.",
        "Protecting information while it travels across the internet is essential, but so is thinking about what happens afterward. Some information deserves to remain available for years. Other information—particularly passwords, recovery codes, and temporary credentials—is often safer when it exists for only as long as necessary.",
        "Modern messaging apps and one-time secret-sharing services serve different purposes. Neither replaces the other; instead, they address different aspects of secure communication. Choosing the right approach depends on what you’re sharing and how long it needs to exist.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Does this replace SMS?",
          answer:
            "No. Traditional SMS messages remain unencrypted. The new protections apply only to compatible RCS conversations when both devices and messaging applications support the latest end-to-end encrypted RCS standard.",
        },
        {
          question: "Can Google or Apple read encrypted RCS messages?",
          answer:
            "End-to-end encryption is designed so that only the communicating devices possess the keys needed to decrypt messages. The providers transport encrypted data but cannot access the plaintext contents of your conversations.",
        },
        {
          question: "Can someone still take a screenshot?",
          answer:
            "Yes. Once a message has been decrypted on the recipient’s device, they can still take screenshots, copy the content, or forward it to others. End-to-end encryption protects the transmission of the message, not what the recipient chooses to do with it afterward.",
        },
        {
          question: "Are one-time links more secure than messaging apps?",
          answer:
            "Not necessarily—they solve a different problem. End-to-end encrypted messaging is excellent for ongoing conversations. [One-time or expiring links](blog:one-time-secret-links) are often better suited to sharing sensitive information that shouldn’t remain stored in chat history indefinitely.",
        },
      ],
    },
  ],
  referencesTitle: "Further reading",
  references: [
    {
      label:
        "Android and iPhone users can now enjoy end-to-end encrypted RCS messaging (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Share secrets that shouldn’t live in chat",
  ctaBody:
    "When you need to hand someone a password, API key, or recovery code, send a client-side encrypted one-time note instead of pasting it into Messages. Set a short expiry or burn-after-read so the secret doesn’t linger in searchable history.",
  ctaButton: "Create a private note",
};
