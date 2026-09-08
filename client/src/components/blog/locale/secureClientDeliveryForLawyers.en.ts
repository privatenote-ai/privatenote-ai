import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersEn: SecureClientDeliveryForLawyersArticleCopy = {
  intro: [
    "For privileged and professionally confidential communications, encryption is only part of the risk analysis. Another practical question is who can later retrieve a written record of the communication, and how long that record survives.",
    "Counsel already know that email is a poor vault for secrets. Many have moved instructions into Signal or WhatsApp on the footing that “it is encrypted.” That footing is incomplete. Those applications are designed to keep a conversation. Many privileged exchanges are designed to do the opposite: to put a particular instruction, draft, or exhibit into the client’s hands, and then to stop accumulating copies.",
    "The difficulty is practical as well as doctrinal. A substantial class of clients will not install Signal. They will not migrate a family WhatsApp thread into a “secure” second app. They will open a link in the browser they already have. For that class of matter—especially in criminal defence—the profession needs a channel that looks like correspondence from the firm, not a chat bubble from a social network.",
  ],
  sections: [
    {
      title: "Why a “secure chat” is still a transcript",
      paragraphs: [
        "End-to-end encryption in Signal and WhatsApp is real and valuable: it prevents the service provider from reading the plaintext of the conversation. But encryption and persistence are different questions. A message can be strongly encrypted and still remain searchable on participants’ devices, backups, or linked computers. That second question is what matters in practice to solicitors, chambers staff, and criminal defence lawyers:",
      ],
      bullets: [
        "Does a searchable history remain on the client’s telephone, a partner’s telephone, or a device that is later seized, lost, or examined?",
        "Do cloud backups, linked computers, notification previews, and forwarded screenshots multiply the record beyond the original parties?",
        "If the matter later becomes contentious, has counsel inadvertently created a running commentary that was never intended to form part of the brief?",
      ],
      paragraphsAfterBullets: [
        "The same pattern appears in ordinary workplaces: written messages outlive the occasion for which they were sent. See [ephemeral notes for workplace texts](blog:workplace-texts-private-note) and [why secrets should not be pasted into chat](blog:secrets-never-send-in-chat). For passports, medical reports, and contracts, the same objection applies to [email attachments](blog:why-email-is-worst-for-secrets).",
        "None of this is an invitation to destroy records that the law requires a firm to keep. A litigation hold, a statutory retention period, and the proper custody of the file remain untouched. The point is narrower: many operational communications—one-time instructions, access codes, draft wording for the client’s eyes only, a sensitive exhibit that need not live in a family chat—should not be allowed to fossilise in a messenger.",
      ],
    },
    {
      title: "Criminal defence, custody, and the client who will not install another app",
      paragraphs: [
        "The objection is sharpest in criminal defence and other sensitive legal work. The lay client is often under stress, sometimes in custody, sometimes using a relative’s telephone, and rarely in a position to install another app. Asking that person to “just install Signal” is, in a large number of files, a non-starter. WhatsApp may already be on the device—and that is precisely the problem. It is part of the client’s everyday communications: it is where the family argues, where screenshots travel, and where a privileged instruction sits beside a joke from a cousin.",
        "Consider the class of communications that ought not to remain in that chat:",
      ],
      bullets: [
        "Instructions on plea, bail conditions, sureties, or proposed admissions.",
        "Drafts of a statement, a letter before action, or sentencing submissions the client must approve before they are filed.",
        "Addresses, medical reports, financial particulars, or the identity of a proposed witness—material that is necessary today and dangerous if it lingers.",
        "One-time access details for a portal, a video conference, or a document the client should read once and not store in chat.",
        "Counsel-to-counsel handoffs: corresponding solicitors, co-counsel, an agent at court, or a colleague covering a mention, where the receiving lawyer needs the papers now and not a permanent thread.",
      ],
      paragraphsAfterBullets: [
        "In each of those cases the professional obligation is to deliver the material to the intended recipient, under conditions that do not gratuitously enlarge the class of persons who can later reconstruct it. A green chat bubble is not letterhead. It does not identify the firm. It does not look like a communication the client can trust at a glance when they are already wary of links.",
      ],
    },
    {
      title: "What the profession actually needs from a delivery channel",
      paragraphs: [
        "A fit-for-purpose channel for privileged operational delivery has a short list of requirements. The client must not be required to create an account or install software. Encryption must occur on the sender’s device before upload, so the service stores ciphertext rather than the instruction itself. Access must be capable of burning after reading and of expiring on a timer. The reveal page should present as correspondence from the practice—not as an anonymous paste site. And the sender should be able to know that the link was opened, to revoke it if it went to the wrong number, and, where the papers are sensitive, to discourage casual download.",
        "That is the design of a [one-time secret link](blog:one-time-secret-links), applied to legal practice. PrivateNote encrypts in the browser before the payload leaves the device. Recipients open a unique URL; they need no account. Counsel can send the link over whatever channel the client already uses—SMS, email, even a brief call in which the URL is read out—without placing the underlying instruction in that channel. The sensitive content lives in the note. The chat or inbox contains only a link that stops working.",
      ],
      comparisonTable: {
        headers: ["Requirement of practice", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "Client need not install an app",
            "No — the app is the channel",
            "Yes — ordinary browser",
          ],
          [
            "No lasting transcript by default",
            "A conversation in an app—including with disappearing messages",
            "One-off delivery by link; burn-after-read on the service",
          ],
          [
            "Firm identity on delivery",
            "A consumer chat identity",
            "Logo, practice name, and branded reveal page",
          ],
          [
            "Proof the papers were collected",
            "Read receipts are tied to the chat, not a dedicated delivery record",
            "Open alerts and proof of access (status only)",
          ],
          [
            "Wrong-number recall",
            "The message is already on the device",
            "Revoke an unopened note",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal and WhatsApp also offer disappearing messages. Their model remains a conversation in a messenger, whereas PrivateNote is designed as a one-off handoff by link. They are messengers with ephemeral options. PrivateNote is ephemeral delivery by design. For documents rather than short instructions, see [how to send sensitive documents securely](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Example: sending a draft statement for approval",
      paragraphs: [
        "Counsel creates a one-time note and enables [recipient verification](blog:recipient-verification-code-before-reveal). The client receives only the link by SMS; the verification code is communicated separately. The client opens the note in a browser without creating an account. Counsel receives the [open status](blog:know-when-secret-link-opened), and the note is no longer available through the link after it is consumed. If the number was wrong, counsel can still [revoke](blog:revoke-unopened-note-proof-of-access) the link before it is opened.",
      ],
    },
    {
      title: "A shared professional habit",
      paragraphs: [
        "PrivateNote can be used between counsel as well as with clients. A corresponding solicitor, co-counsel, agent at court, or client receives sensitive material in the same form: a short-lived link rather than another permanent chat thread. The recipient still needs no PrivateNote account.",
        "Business is licensed as a professional account rather than a per-seat collaboration suite. The value is the delivery standard: sensitive material arrives under the practice’s identity and does not automatically become another searchable conversation.",
        "Branding is not vanity. A client who has been warned about phishing should be able to recognise the firm’s identity on the page that asks them to open a sensitive message. A consumer chat thread cannot offer that assurance. Business adds company profile, logo, colours, and a Default or Custom reveal page so the delivery is clearly presented under the practice’s identity. That is a matter of recognition, not cryptographic proof of origin.",
      ],
      midCta: {
        body: "Business is the plan built for professional delivery: recipient branding, view-only file access, attachments up to 1 GB, and the full set of delivery controls (proof of access, recipient verification, revoke, delayed reveal). It is €12 / $12 per month, or €120 / $120 per year—one professional account, not a seat licence.",
        button: "See Business on the plans page",
      },
    },
    {
      title: "Additional controls for professional use",
      paragraphs: [
        "Delayed reveal can hold a pack until a filing time or a prison-call window. Business adds view-only file access for exhibits that should be read, not casually saved, and larger attachment limits for bundles that do not belong in a chat. For larger packs, [encrypted file transfer](app:secure-file-transfer) uses the same model: sending a file requires a free account; opening a link never does.",
      ],
    },
    {
      title: "What this channel does not decide",
      paragraphs: [
        "Privilege is a question of law and fact in the relevant jurisdiction. No product confers it. No product can prevent a lawful recipient from making a copy once the plaintext is on the screen. PrivateNote does not replace the firm’s document management system, time recording, or the obligation to retain what the file must retain. It reduces unnecessary copies of communications that were never meant to become a standing archive.",
        "Used with that limitation in mind, it is a professional alternative to the two habits that currently dominate: putting privileged operational matter into email, or putting it into a consumer messenger because the client will not install anything else. Counsel can keep the client on the tools they already have, put the firm’s name on the delivery, and stop leaving a transcript where none is required.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Does encryption in Signal or WhatsApp discharge the duty of confidentiality?",
          answer:
            "End-to-end encryption is real and valuable: it prevents the service provider from reading the plaintext. It does not decide how long a transcript remains on devices, in backups, or in a client’s chat history. Encryption and persistence are different questions. No product confers privilege or professional secrecy.",
        },
        {
          question: "Must the client create an account or install an app?",
          answer:
            "No. The client opens a unique link in an ordinary browser. There is no requirement to install Signal, WhatsApp, or a PrivateNote application, and no requirement to create an account in order to reveal the note.",
        },
        {
          question: "Is PrivateNote a document-management system or a substitute for the file?",
          answer:
            "No. It is a short-lived delivery channel. Matter files, court records, and anything subject to a retention or litigation-hold obligation still belong in the firm’s ordinary systems. Use PrivateNote for communications that should not linger after they have been received.",
        },
        {
          question: "Can a recipient still keep a copy after opening?",
          answer:
            "Yes. Once plaintext is lawfully revealed, a determined recipient may copy, screenshot, download, or photograph the screen. Burn-after-read and expiry reduce leftover copies on the service; they cannot remotely delete what the recipient has already captured. View-only file access on Business reduces casual downloading; it is not a prohibition on photography.",
        },
      ],
    },
  ],
  ctaTitle: "Deliver the instruction. Do not leave the transcript.",
  ctaBody:
    "Encrypt in the browser, present the reveal under your firm’s identity, and send a link the client can open without installing another app. Business adds the branding and delivery controls for professional use.",
  ctaPrimary: "Choose Business",
  ctaSecondary: "Write a private note",
};
