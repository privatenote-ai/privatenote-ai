import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksEn: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Calm desk scene suggesting a temporary file handoff versus long-lived cloud collaboration folders",
  heroCaption:
    "Drive shines for ongoing collaboration. One-time links shine when the file only needs to exist for the handoff.",
  intro: [
    "Google Drive is one of the best tools available for storing files and collaborating with other people over days, weeks, or years. [One-time encrypted links](blog:one-time-secret-links) solve a different problem: securely handing sensitive information to someone once, then automatically removing access when it is no longer needed.",
    "Neither approach is universally better. The right choice depends on whether you are collaborating on a document or simply delivering confidential information.",
  ],
  sections: [
    {
      title: "Why this matters",
      takeaway:
        "Convenience makes Drive the default—even when the file only needs to be seen once.",
      paragraphs: [
        "For many people, Google Drive has become the default answer whenever a file needs to be shared. It is built into Gmail, Android, Google Workspace, and countless business workflows. Need to send a PDF, a spreadsheet, or a contract? Upload it to Drive, copy the link, and press send.",
        "That convenience has made Drive incredibly successful—but it can also encourage us to use the same tool for situations it was not specifically designed to handle.",
        "Imagine sending a passport copy to your accountant, a signed employment contract to HR, or tax documents to a financial adviser. In most cases, the recipient only needs those files once. After the task is complete, every remaining copy simply increases the chance that the information stays accessible longer than necessary.",
        "The biggest risk is rarely that someone intercepts the file while it travels across the internet. Modern cloud services encrypt data [in transit](blog:encrypted-vs-secure-file-sharing). The larger issue is **retention**. Sensitive information often remains in cloud storage, email notifications, synced folders, and downloaded files long after everyone has forgotten it exists.",
      ],
    },
    {
      title: "Google Drive is built for collaboration",
      takeaway: "Simultaneous editing, version history, and shared folders are strengths—not flaws.",
      paragraphs: [
        "Google Drive is excellent at helping people work together. Multiple people can edit the same document simultaneously, changes are saved automatically, version history makes it easy to recover previous revisions, and permissions can be adjusted whenever team members join or leave a project. For ongoing work, these are enormous advantages.",
        "This is exactly the environment Drive was designed for. A project folder might stay active for months while documents evolve and new files are added.",
        "The challenge appears when those same collaboration features are used for information that was never intended to remain available in the first place.",
      ],
    },
    {
      title: "The hidden cost of long-term access",
      takeaway: "Temporary handoffs leave permanent footprints when the platform optimises for availability.",
      paragraphs: [
        "Most confidential files do not need to be available forever. A passport copy might only be needed for identity verification. A tax return may only be required for a specific filing. An API key could be used once before being rotated. Once the recipient has finished their task, continuing to store the information provides very little benefit.",
        "Unfortunately, deleting access is not always straightforward. People download files to their laptops. They synchronise folders across devices. Email invitations remain in inboxes. Shared folders continue to exist. Months later, someone discovers an old folder with permissions that nobody remembered granting.",
        "None of these events represent a failure of Google Drive. They are simply the natural consequence of using a collaboration platform for a temporary handoff—the same retention pattern that shows up when people [email secrets](blog:why-email-is-worst-for-secrets) or leave [documents in chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "When one-time links make more sense",
      takeaway: "Deliver once, expire by design—without turning every handoff into a shared workspace.",
      paragraphs: [
        "One-time encrypted links are designed with a different goal. Instead of creating a shared workspace, they focus on delivering confidential information with the smallest practical digital footprint. The information is encrypted before it leaves your browser, and access can be limited to a single view or a short expiration period. Once the handoff is complete, the link becomes unusable.",
        "This approach is not about replacing cloud storage. It is about recognising that not every file deserves permanent storage or ongoing permissions.",
        "If you are sending a recovery code to a colleague, a signed contract to a client, or medical records to a specialist, you probably do not need collaborative editing, version history, or a shared folder. You simply need the right person to receive the information safely—see also [how to send sensitive documents securely](blog:send-sensitive-documents-securely).",
        "Services such as [PrivateNote](app:secure-file-transfer) are built around this temporary sharing model. Rather than encouraging long-term storage, they minimise retention by combining client-side encryption with automatic expiration.",
      ],
    },
    {
      title: "Which method should you choose?",
      takeaway: "Match the tool to the lifetime of the information—not to whichever platform is most familiar.",
      paragraphs: [
        "The decision is less about abstract “security” and more about purpose.",
        "If multiple people need to review, edit, and revisit a document over time, Google Drive is an excellent choice. Features such as comments, version history, and shared folders make collaboration straightforward.",
        "If the information only needs to be delivered once, a one-time encrypted link is often the better fit. It removes the need to manage long-lived permissions, reduces unnecessary copies, and limits how long the information remains available.",
      ],
      calloutTitle: "Rule of thumb",
      callout:
        "Choose the tool that matches how long the information actually needs to remain available—not the tool you open by habit.",
    },
    {
      title: "Comparison",
      takeaway: "Collaboration features and ephemeral delivery solve different jobs.",
      comparisonTable: {
        headers: ["Feature", "Google Drive", "One-time encrypted link"],
        rows: [
          ["Designed for collaboration", "Yes", "No"],
          ["Long-term storage", "Yes", "No"],
          [
            "Client-side end-to-end encryption",
            "Not by default*",
            "Yes",
          ],
          ["Automatic expiration", "No (manual cleanup)", "Yes"],
          ["Read-once access", "No", "Yes"],
          ["Ongoing permission management", "Yes", "No"],
          ["Best for temporary confidential sharing", "Sometimes", "Yes"],
        ],
        after: [
          "*Standard Drive encrypts data in transit and at rest with keys managed by Google. Google Workspace offers optional [client-side encryption](https://support.google.com/a/answer/10741875) for some organisations, but everyday shared links still optimise for durable access rather than burn-after-reading delivery.",
        ],
      },
    },
    {
      title: "Best practices checklist",
      takeaway: "Small habits cut retention risk on whichever tool you pick.",
      paragraphs: [
        "Whatever tool you choose, a few simple habits significantly reduce unnecessary exposure.",
      ],
      checklist: [
        "Share only what the recipient needs—avoid entire folders packed with unrelated personal data",
        "Remove unnecessary metadata from PDFs, Office files, and images when practical",
        "If you use a passphrase, send it on a separate channel (out-of-band / OOB delivery)",
        "After the task is done: revoke shared access, delete temporary local copies, and avoid indefinite shared folders",
      ],
      paragraphsAfterChecklist: [
        "Out-of-band delivery means the encrypted link travels on one channel (for example email) while the passphrase travels on another (Signal, SMS, or a phone call). Compromising one channel alone should not be enough to open the file.",
        "For a deeper workflow on document handoffs, follow the [sensitive documents guide](blog:send-sensitive-documents-securely). For how browser encryption differs from transport encryption, see [encrypted vs secure file sharing](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Is Google Drive secure?",
          answer:
            "Yes—Google Drive is a mature cloud platform that encrypts information in transit and at rest. Overall exposure still depends on how files are shared, how permissions are managed, and how long documents remain accessible after the task is finished.",
        },
        {
          question: "Is Google Drive end-to-end encrypted?",
          answer:
            "Not in the sense used for client-side encrypted messaging or browser-encrypted one-time links. For standard Drive storage, Google manages the encryption keys. Optional Workspace client-side encryption changes that picture for eligible organisations, but everyday “anyone with the link” sharing still leaves durable copies and permission surfaces that ephemeral delivery avoids. See [what end-to-end encryption means](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "Are one-time links safer than Google Drive?",
          answer:
            "For temporary confidential handoffs, they often reduce long-term risk because they minimise retention and can remove access automatically after delivery. For collaborative editing and ongoing projects, Drive remains the better tool. Safety follows purpose—not a universal ranking.",
        },
        {
          question: "What if I send a one-time link to the wrong person?",
          answer:
            "Protect the content with a passphrase, use a short expiration, and destroy the note before it is opened when your tool allows it. Verifying the recipient before you send remains the strongest defence. Guidance from agencies such as [CISA](https://www.cisa.gov/) consistently emphasises limiting access duration and least privilege—the same ideas behind short-lived encrypted links.",
        },
      ],
    },
  ],
  ctaTitle: "Need a temporary confidential handoff?",
  ctaBody:
    "Google Drive and one-time encrypted links are complementary tools. If people need to work together on documents over time, Drive is one of the best collaboration platforms available. If your goal is to hand confidential information to someone once and minimise how long it remains accessible, create an end-to-end encrypted, one-time link in your browser—without leaving permanent copies in email or shared folders.",
  ctaButton: "Create a secure one-time link",
};
