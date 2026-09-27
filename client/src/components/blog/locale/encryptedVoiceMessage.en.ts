import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const encryptedVoiceMessageEn: BlogGuideArticleCopy = {
  heroAlt:
    "Quiet desk setup with headphones and a phone ready to record a short private voice message",
  heroCaption:
    "Record in the browser, encrypt like a file attachment, then limit access with the note’s policy.",
  intro: [
    "Some secrets are easier to say than to type: a temporary door code, a quick walkthrough for a contractor, or a spoken confirmation that should not live in Slack forever.",
    "Voice notes in chat apps are convenient, but they often linger in histories, backups, and notification previews. A better pattern is a **private voice message** that is encrypted in your browser, delivered as a short-lived link, and removed from the service after the note’s policy says it should be gone.",
    "PrivateNote’s **Record message** flow treats audio like any other attachment: your browser encrypts it before upload, the recipient reveals the note when ready, then plays the clip inline.",
  ],
  sections: [
    {
      title: "Why chat voice notes leave a trail",
      takeaway: "Encrypted delivery in chat is not the same as short retention.",
      paragraphs: [
        "Many messengers encrypt voice notes in transit or end-to-end. That helps against network snooping, but it does not automatically erase the recording from chat history, device downloads, or corporate backups.",
        "For one-off instructions—handover codes, temporary access steps, or sensitive spoken context—you usually want **ephemeral delivery**, not a permanent media archive. That is the same reason people use [one-time secret links](blog:one-time-secret-links) for passwords instead of pasting them into chat.",
      ],
    },
    {
      title: "How encrypted voice messages work in PrivateNote",
      takeaway: "Recording is local; ciphertext is what leaves the device.",
      paragraphs: [
        "On the create-note screen, signed-in users can choose **Record message** next to file attach. You start recording in the browser, preview the clip, re-record if needed, then attach it to the note.",
        "Before upload, PrivateNote encrypts the audio in your browser the same way it encrypts file attachments. The service stores ciphertext—not a playable MP3 sitting in plaintext on a server disk.",
        "When the recipient opens the link and confirms reveal, their browser decrypts the attachment and can play it with an inline audio player. Downloads may still be available during the note’s post-open file window, just like other attachments.",
      ],
      midCta: {
        body: "Need to leave a spoken instruction that should not live in chat history?",
        button: "Record a private voice message",
      },
    },
    {
      title: "How to send one",
      takeaway: "Sign in, record, set short limits, share the link—not the raw file.",
      checklist: [
        "Sign in (recording uses the same attach path as files)",
        "Open create note and choose Record message",
        "Record, preview, then Use recording",
        "Set a short note lifetime and open limit",
        "Optionally require a verification code or passphrase",
        "Share the complete link with the intended recipient only",
      ],
      paragraphsAfterChecklist: [
        "Plan limits cap recording length (for example shorter on Free, longer on Starter and Business). Stay within the limit shown in the recorder—longer clips are better split or sent as a file if you truly need them.",
        "Treat the full URL like the message itself. If the channel might be exposed, add [recipient verification](blog:recipient-verification-code-before-reveal) or a separately shared passphrase—see [how to share a password securely](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "When voice is the right tool",
      takeaway: "Use speech for nuance; use text for credentials that must be copied exactly.",
      comparisonTable: {
        headers: ["Situation", "Prefer", "Why"],
        rows: [
          [
            "Temporary access steps or a short walkthrough",
            "Encrypted voice message",
            "Faster to explain out loud; availability follows the note and attachment policy",
          ],
          [
            "API keys, passwords, seed phrases",
            "Text note or password-manager share",
            "Recipients need exact characters; speech introduces errors",
          ],
          [
            "Long briefings or meetings",
            "Meeting tool / document handoff",
            "Voice notes are for short, disposable context—not archives",
          ],
        ],
      },
    },
    {
      title: "Limits of the model",
      takeaway: "It reduces leftover service copies; it cannot stop a trusted listener.",
      bullets: [
        "Anyone with the complete link (and any required code or passphrase) can listen before expiry",
        "A recipient can still save or re-record audio after decrypting",
        "Microphone permission and a supported browser are required to record",
        "Background noise and spoken secrets in public spaces remain a human risk",
      ],
      paragraphs: [
        "Client-side encryption means PrivateNote receives encrypted audio rather than a clear recording, which is the same trust model described in [encrypted vs secure file sharing](blog:encrypted-vs-secure-file-sharing). It does not protect a compromised device or a recipient who forwards what they heard.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Do recipients need an account to listen?",
          answer:
            "No. Opening and revealing a note works without an account. Creating and uploading a voice attachment requires a signed-in sender.",
        },
        {
          question: "Is the voice message stored as plaintext on the server?",
          answer:
            "No. Like other attachments, the audio is encrypted in the browser before upload. The service stores ciphertext.",
        },
        {
          question: "Can I combine a voice clip with text or files?",
          answer:
            "Yes. The recording becomes an attachment on the note. You can still add written context and other files within your plan’s limits.",
        },
        {
          question: "What happens after the note is opened?",
          answer:
            "The note follows its open limit and lifetime settings. Attachments remain downloadable only during the configured post-open window, then the service stops serving them.",
        },
      ],
    },
    {
      title: "The bottom line",
      takeaway: "Speak once, encrypt locally, and keep the access window short.",
      paragraphs: [
        "Encrypted voice messages fill the gap between typing a wall of instructions and dropping a permanent voice note into chat.",
        "Record in the browser, encrypt before upload, pair the link with short limits—and keep exact secrets in text when characters matter.",
      ],
    },
  ],
  ctaTitle: "Send the spoken part without the chat archive.",
  ctaBody:
    "PrivateNote encrypts voice recordings in your browser and delivers them through the same one-time note flow you already use for secrets and files.",
  ctaButton: "Create a note with a voice message",
};
