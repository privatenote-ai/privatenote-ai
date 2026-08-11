import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessEn: BlogGuideArticleCopy = {
  heroAlt:
    "Account activity view with an unopened note and a clear option to revoke the link",
  heroCaption:
    "Changed your mind before anyone opened it? Destroy the link. Need a receipt? View proof of access.",
  intro: [
    "Secure sharing is not only about encryption at send time. It is also about **control afterward**: stopping a link you should not have sent, and keeping a coarse record of what happened to one you did send.",
    "PrivateNote’s Starter and Business plans add two complementary tools. **Revoke** destroys an unopened link so it can no longer be revealed. **Proof of access** shows a simple timeline—created, opened, attachment downloaded, destroyed, expired, or revoked—without exposing note contents.",
    "Together they answer the two follow-up questions teams actually ask: “Can I take it back?” and “Can I show that the link was accessed?”",
  ],
  sections: [
    {
      title: "Revoke while it is still unopened",
      takeaway: "Revocation works before reveal—not after someone already decrypted a copy.",
      paragraphs: [
        "If a note has not been opened yet, you can revoke it from the create-success screen or from account notifications / activity. The link stops working; recipients who arrive later see that access is gone.",
        "Revoke is the right move when you pasted the wrong recipient, spotted the secret in the wrong chat, or decided the handoff should wait. It is **not** remote deletion of a file someone already downloaded after reveal—no honest E2EE handoff tool can promise that.",
      ],
      checklist: [
        "Create the note on Starter or Business",
        "If something looks wrong, revoke immediately from the success screen",
        "Or open Account → Notifications / activity and revoke while status is still unopened",
        "Send a replacement note if the recipient still needs the secret",
      ],
      midCta: {
        body: "Need take-backs and receipts on sensitive handoffs?",
        button: "Create a note you can revoke",
      },
    },
    {
      title: "Proof of access without content leaks",
      takeaway: "A coarse receipt: the link was accessed—not a transcript of reading.",
      paragraphs: [
        "Proof of access is designed for operational and compliance conversations that need evidence of delivery events without putting secrets into email or tickets.",
        "The timeline stays high level: created, link opened, attachment downloaded (when tracked), destroyed, expired, revoked. That matches the privacy stance of [open alerts](blog:know-when-secret-link-opened): status, not substance.",
      ],
      calloutTitle: "Read the label carefully",
      callout:
        "Proof of access is a receipt that the link was accessed—not cryptographic proof that a specific human carefully read every word, and not DRM against screenshots.",
    },
    {
      title: "How revoke and proof fit together",
      takeaway: "Prevent access when you can; document access when you must.",
      comparisonTable: {
        headers: ["Situation", "Use", "Outcome"],
        rows: [
          [
            "Wrong recipient, still unopened",
            "Revoke",
            "Link dies; create a corrected note",
          ],
          [
            "Handoff completed, auditor asks “was it opened?”",
            "Proof of access",
            "Show timeline events without content",
          ],
          [
            "Note already revealed",
            "Rotate the secret / assume exposed",
            "Revoke no longer recovers plaintext copies",
          ],
          [
            "Waiting on recipient",
            "Alerts + lifetime",
            "Follow up or auto-expire if never opened",
          ],
        ],
      },
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Can I revoke after the recipient opened the note?",
          answer:
            "Revoke targets unopened notes. After reveal, assume the recipient could retain what they saw; rotate credentials or treat the document as delivered.",
        },
        {
          question: "Does proof of access include the message text?",
          answer:
            "No. It is a status timeline only. Contents remain outside notification and proof views.",
        },
        {
          question: "Is revoke available on Free?",
          answer:
            "Revoke and proof of access are Starter/Business capabilities. Free users still get encryption, short lifetimes, and open alerts once signed in with a verified email.",
        },
        {
          question: "Where do I find proof later?",
          answer:
            "Open your account notification center / activity, find the note, and choose View proof of access when the plan supports it.",
        },
      ],
    },
    {
      title: "The bottom line",
      takeaway: "Control the unopened link; document the opened one.",
      paragraphs: [
        "Encryption answers “who can read this in transit and at rest.” Revoke and proof answer “what do we do next.”",
        "Use them with [verification codes](blog:recipient-verification-code-before-reveal) and [open alerts](blog:know-when-secret-link-opened) for a complete handoff loop—from send, to confirm, to take-back or receipt.",
      ],
    },
  ],
  ctaTitle: "Take back an unopened secret.",
  ctaBody:
    "Revoke links that should never open, and keep a coarse proof timeline when you need to show that a handoff was accessed—without emailing the secret.",
  ctaButton: "Create a private note",
};
