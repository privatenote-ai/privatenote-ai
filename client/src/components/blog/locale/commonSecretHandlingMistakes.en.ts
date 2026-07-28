import type { CommonSecretHandlingMistakesArticleCopy } from "./commonSecretHandlingMistakes.types";

export const commonSecretHandlingMistakesEn: CommonSecretHandlingMistakesArticleCopy = {
  heroAlt:
    "Calm desk with a laptop, paper notes, and a phone—suggesting everyday places secrets accidentally linger",
  heroCaption:
    "Most secrets leak from everyday habits—email, chat, folders, and screenshots—not from broken encryption.",
  intro: [
    "Most secrets don't leak because encryption fails. They leak because people accidentally leave confidential information sitting in email inboxes, chat histories, shared folders, screenshots, and backups long after it was needed.",
    "Improving security often means changing a few everyday habits rather than adopting complicated new technology. Reducing who can access a secret—and how long it remains available—is one of the most effective ways to lower risk.",
  ],
  sections: [
    {
      title: "Why this matters",
      takeaway: "Strong security isn't just about encryption—it's about limiting access and retention.",
      paragraphs: [
        "Passwords, API keys, recovery codes, contracts, passport copies, and financial records all have one thing in common: they are valuable only because they remain confidential.",
        "Yet most of us handle them using tools designed for convenience rather than confidentiality. We email passwords because it's quick. We paste API keys into Slack because it's faster than opening another application. We upload identity documents to cloud storage and forget they're still there months later.",
        "None of these actions feels particularly dangerous on its own. The problem is that every copy creates another place where sensitive information can remain accessible.",
        "Modern encryption protects information remarkably well while it travels across the internet. The bigger challenge is what happens afterwards. Once a secret reaches an inbox, a chat history, a shared folder, or a downloaded file, it often stays there indefinitely.",
        "Good security isn't about making sharing difficult. It's about making secrets temporary instead of permanent.",
      ],
      calloutTitle: "Key principle",
      callout:
        "Strong security isn't just about encryption. It's about limiting both **access** and **retention**.",
    },
    {
      title: "Mistake 1: Sending secrets through email",
      takeaway: "Email leaves durable copies in Sent folders, inboxes, and backups.",
      paragraphs: [
        "Email remains one of the easiest ways to share information, but it was never designed as a secure vault for confidential data.",
        "Even when email is encrypted while travelling between servers, copies usually remain in your Sent folder, the recipient's inbox, mail server backups, and archived mailboxes. If someone gains access to either email account months or years later, the information may still be available.",
        "For everyday conversations this isn't a major concern. For passwords, recovery codes, private keys, or confidential documents, it creates unnecessary long-term exposure.",
        "Whenever possible, use sharing methods designed for temporary access rather than permanent storage—see [why email is a poor channel for secrets](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Mistake 2: Treating chat apps like secure storage",
      takeaway: "Collaboration tools preserve history extremely well—often for years.",
      paragraphs: [
        "Slack, Microsoft Teams, WhatsApp, Discord, and Signal have transformed how we communicate. They're excellent collaboration tools, but many people begin treating them like secure storage without realising it.",
        "A password shared \"just this once\" can remain searchable for years. API keys pasted into development channels may be copied into exports or backups. Temporary conversations often become surprisingly permanent.",
        "The issue isn't that these platforms are inherently insecure. It's that they preserve history extremely well.",
        "Ask yourself whether the secret still needs to be available six months from now. If the answer is no, a different sharing method is probably more appropriate—see [secrets you should never send in chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Mistake 3: Sending the password in the same message",
      takeaway: "Out-of-band delivery keeps the key off the same channel as the ciphertext.",
      paragraphs: [
        "One of the most common security mistakes is encrypting a file and then sending the password in exactly the same email or chat conversation. If someone compromises that conversation, they obtain both the encrypted file and the key needed to open it.",
        "A much better approach is **Out-of-Band (OOB) delivery**. For example: send the encrypted link by email, and send the passphrase by SMS, Signal, or a phone call.",
        "Using two independent communication channels significantly reduces the likelihood that a single compromise exposes everything. The same pattern applies when you [share a password securely](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Mistake 4: Keeping secrets longer than necessary",
      takeaway: "Ask: does this still need to exist here?",
      paragraphs: [
        "Retention is one of the least appreciated aspects of information security. Many confidential files only need to exist for a short period.",
        "A passport copy might be required for identity verification. A tax return may only be needed until paperwork is complete. A recovery code may never be required again after a successful login.",
        "Yet these files often remain stored in shared folders, downloads, desktops, and cloud storage long after their purpose has been fulfilled.",
        "Before keeping any sensitive information, ask yourself one simple question: **Does this still need to exist here?**",
      ],
    },
    {
      title: "Mistake 5: Leaving cloud links active forever",
      takeaway: "Permission drift turns temporary sharing into permanent access.",
      paragraphs: [
        "Cloud storage services such as Google Drive, Dropbox, and OneDrive are outstanding collaboration tools. Problems arise when temporary sharing quietly becomes permanent.",
        "A document is shared with a colleague. The project finishes. Months later, the shared link still works because nobody remembered to remove access. This phenomenon—sometimes called **permission drift**—is surprisingly common.",
        "Whenever possible, review shared folders regularly and remove access that is no longer required. For one-off confidential handoffs, [compare Drive with one-time encrypted links](blog:google-drive-vs-one-time-encrypted-links).",
      ],
    },
    {
      title: "Mistake 6: Taking screenshots of secrets",
      takeaway: "Screenshots sync across photo libraries, backups, and AI search tools.",
      paragraphs: [
        "Screenshots feel harmless. Unfortunately, they often create even more copies of sensitive information than the original.",
        "A screenshot containing a password or recovery code may automatically synchronise to cloud photo libraries, phone backups, tablets, and laptops. It might also appear in galleries, AI photo search tools, or automatic image backups.",
        "If information is worth protecting, avoid turning it into another image file unless absolutely necessary.",
      ],
    },
    {
      title: "Mistake 7: Ignoring metadata",
      takeaway: "Office files, PDFs, and photos often carry author names, history, and location data.",
      paragraphs: [
        "Documents often reveal much more than their visible contents. Office files, PDFs, and photographs can include author names, editing history, timestamps, software versions, and GPS coordinates.",
        "Recipients usually don't need this information, but it frequently travels with the document anyway.",
        "Before sharing confidential documents, consider removing unnecessary metadata—particularly if the file originated inside your organisation. For a full document workflow, see [how to send sensitive documents securely](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Mistake 8: Reusing passwords",
      takeaway: "One breached site can cascade into many accounts.",
      paragraphs: [
        "Password reuse remains one of the most common causes of account compromise. When the same password protects multiple services, a breach affecting one website can quickly become a breach affecting many others.",
        "Using a unique password for every account dramatically limits the impact of a single incident. A password manager makes this practical by remembering those passwords for you, while a [password generator](app:password-generator) helps create passwords that are genuinely random.",
      ],
    },
    {
      title: "Mistake 9: Sharing permanent credentials",
      takeaway: "Once someone knows your password, clean revocation is nearly impossible.",
      paragraphs: [
        "Sometimes people share their own login credentials because it's faster than creating temporary access. Unfortunately, permanent credentials are difficult to revoke cleanly. Once another person knows your password, there's no way to know where it has been stored or copied.",
        "Whenever possible, create dedicated temporary credentials or invite users through proper access management rather than sharing your own account.",
      ],
    },
    {
      title: "Mistake 10: Assuming encryption solves everything",
      takeaway: "Encryption protects the journey; retention decides what remains afterwards.",
      paragraphs: [
        "Encryption is one of the most important security technologies ever developed. It protects information while it is being transmitted or stored. However, encryption alone doesn't solve every problem.",
        "If decrypted copies remain sitting in inboxes, downloaded files, screenshots, and shared folders, the information can still be exposed later.",
        "Think of encryption as protecting information **during the journey**. Retention determines how much risk remains **after the journey ends**. For definitions, see [what end-to-end encryption means](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Quick reference",
      takeaway: "Match each habit to a safer alternative.",
      comparisonTable: {
        headers: ["Common mistake", "Why it's risky", "Better practice"],
        rows: [
          [
            "Emailing passwords or API keys",
            "Copies remain in inboxes and backups",
            "Use an encrypted one-time link",
          ],
          [
            "Treating chat as secure storage",
            "Messages remain searchable",
            "Share temporary links instead",
          ],
          [
            "Sending passwords in the same message",
            "One compromise exposes everything",
            "Use Out-of-Band (OOB) delivery",
          ],
          [
            "Leaving cloud links active",
            "Forgotten permissions",
            "Remove or expire access",
          ],
          [
            "Reusing passwords",
            "One breach affects multiple accounts",
            "Use unique passwords",
          ],
          [
            "Sharing permanent credentials",
            "Difficult to revoke",
            "Create temporary access",
          ],
          [
            "Keeping secrets indefinitely",
            "Old copies become future liabilities",
            "Delete when no longer needed",
          ],
          [
            "Taking screenshots",
            "Images sync across devices",
            "Share the original secret securely",
          ],
          [
            "Ignoring metadata",
            "Hidden information leaks context",
            "Remove metadata before sharing",
          ],
          [
            "Assuming encryption is enough",
            "Decrypted copies still exist",
            "Reduce both access and retention",
          ],
        ],
      },
    },
    {
      title: "A better approach",
      takeaway: "Four questions often matter more than the tool you pick.",
      paragraphs: [
        "Improving how you handle secrets doesn't require becoming a cybersecurity expert. Before sharing any confidential information, ask yourself four simple questions:",
      ],
      checklist: [
        "Does this really need to be shared?",
        "Who actually needs access?",
        "How long should they keep it?",
        "What happens after they're finished with it?",
      ],
      paragraphsAfterChecklist: [
        "Those questions often have a greater impact on security than the specific software you choose.",
        "Whenever information only needs to be delivered once, consider using a [one-time encrypted link](blog:one-time-secret-links) that automatically limits its lifetime instead of creating another permanent copy. Services such as [PrivateNote](app:home) create end-to-end encrypted, one-time links directly in your browser.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "What is Out-of-Band (OOB) delivery?",
          answer:
            "Out-of-Band (OOB) delivery means sending confidential information through two separate communication channels. For example, you might email an encrypted link but send the passphrase via SMS or Signal. If one channel is compromised, the attacker still lacks the second piece required to access the information.",
        },
        {
          question: "Is encrypted email enough for sharing secrets?",
          answer:
            "Transport encryption protects email while it travels between mail servers, but standard email still leaves readable copies in the sender's and recipient's inboxes, backups, and archives. For highly sensitive information, reducing long-term retention is often just as important as encrypting transmission.",
        },
        {
          question: "Why is long-term retention a security risk?",
          answer:
            "Every additional copy of confidential information creates another place where it can later be discovered, copied, or accessed. Many incidents occur months or years after information was originally shared simply because nobody removed old copies.",
        },
        {
          question: "When should I use a one-time encrypted link instead of cloud storage?",
          answer:
            "If the recipient only needs to view the information once—or for a short period—a one-time encrypted link is often the better choice. Cloud storage is generally more appropriate when multiple people need ongoing access, collaboration, or version history.",
        },
      ],
    },
  ],
  ctaTitle: "Share secrets without leaving permanent copies",
  ctaBody:
    "Most organisations don't lose confidential information because encryption suddenly fails. They lose it because secrets quietly accumulate in places they were never meant to stay. When you need to hand off sensitive information, create an end-to-end encrypted, one-time link in your browser—so the secret matches the lifetime of the task, not the lifetime of an inbox.",
  ctaButton: "Create a secure one-time link",
};
