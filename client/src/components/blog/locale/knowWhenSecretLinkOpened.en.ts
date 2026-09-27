import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedEn: BlogGuideArticleCopy = {
  heroAlt:
    "Notification panel showing a note-opened alert without any message content visible",
  heroCaption:
    "Status only: opened, destroyed, expired, or revoked—never the secret itself.",
  intro: [
    "After you send a sensitive link, the natural question is: **did they open it yet?** Waiting in silence is stressful; chasing people in chat creates more plaintext noise.",
    "PrivateNote can notify you when delivery status changes—by email, in-tab live alerts while the site is open, and optional browser notifications—without ever emailing the note contents.",
    "That visibility helps you rotate credentials, revoke unopened links, or simply stop wondering whether the handoff landed.",
  ],
  sections: [
    {
      title: "What you can learn (and what you cannot)",
      takeaway: "Alerts are about lifecycle events, not message text.",
      paragraphs: [
        "Typical events include note opened, destroyed, expired, attachment downloaded, and revoked. Wording stays coarse on purpose: enough for operational confidence, not a surveillance feed of reading behaviour.",
        "PrivateNote’s privacy model still applies. Status mail and toasts do **not** include the decrypted secret. If you need a structured receipt for an audit trail, use **proof of access** on eligible plans—described in [revoke and proof of access](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Signal", "Where it appears", "Good for"],
        rows: [
          [
            "Email alerts (verified account)",
            "Your account email",
            "Async confirmation when you are away from the site",
          ],
          [
            "Live in-tab alerts (signed in)",
            "PrivateNote open in a browser",
            "Near real-time awareness during an active handoff",
          ],
          [
            "Browser notifications (permission required)",
            "OS permission prompted from Customize",
            "Heads-up when the tab is in the background",
          ],
          [
            "Account → Activity (plan dependent)",
            "Your private activity history",
            "Reviewing what happened later",
          ],
        ],
      },
    },
    {
      title: "How to enable alerts",
      takeaway: "Sign in, verify email, then toggle alerts per note or in preferences.",
      checklist: [
        "Sign in and verify the email on your account",
        "Enable email notifications in Account → Preferences",
        "When creating a note, open Customize → Email alerts",
        "Choose notify when opened, or opened and destroyed (for read-once flows)",
        "Allow browser notifications if you want OS-level pings",
        "Keep PrivateNote open for live in-tab toasts during critical handoffs",
      ],
      paragraphsAfterChecklist: [
        "Open notifications are available to signed-in Free users once email is verified; richer tracking such as attachment-download events and revoke tooling expands on paid plans.",
        "For the underlying handoff pattern, see [how to make a private note](blog:how-to-make-a-private-note) and [send a secret message without an account](blog:send-secret-message-without-account) for recipients.",
      ],
      midCta: {
        body: "Sending a time-sensitive secret and need confirmation it landed?",
        button: "Create a note with open alerts",
      },
    },
    {
      title: "Using alerts operationally",
      takeaway: "Treat “opened” as a cue to rotate or close the loop—not as proof of careful reading.",
      bullets: [
        "Password handoff: when you see opened, rotate or confirm the recipient changed the credential",
        "Document send: opened + attachment downloaded (where available) means the file window is active",
        "No open before expiry: follow up on another channel, or revoke if still unopened",
        "Unexpected open: assume the link may be compromised; revoke if possible and resend",
      ],
      calloutTitle: "Honest limit",
      callout:
        "“Opened” means the reveal flow progressed—not that a human carefully read every line, and not that screenshots were impossible.",
    },
    {
      title: "Privacy expectations",
      takeaway: "Monitoring delivery should not recreate an email of the secret.",
      paragraphs: [
        "Teams sometimes abuse read receipts as productivity surveillance. PrivateNote’s design keeps alerts minimal: status labels and references, not content dumps.",
        "That matches the product promise elsewhere—browser-side encryption, [end-to-end encryption concepts](blog:what-is-end-to-end-encryption), and never putting the secret back into email just to prove it arrived.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Will the alert include my note text?",
          answer:
            "No. Email and live alerts describe status only. Message content stays out of notification channels.",
        },
        {
          question: "Do I need to keep the tab open?",
          answer:
            "Email alerts work without the tab. Live in-tab toasts need the site open; browser notifications help when the tab is backgrounded and permission is granted.",
        },
        {
          question: "Can recipients see that I enabled alerts?",
          answer:
            "Recipients focus on opening and revealing the note. Sender-side notification settings are not part of the secret payload they decrypt.",
        },
        {
          question: "What if I need to stop access after sending?",
          answer:
            "If the note is still unopened, revoke the link from the success screen or account activity on eligible plans. Details in [revoke and proof of access](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "The bottom line",
      takeaway: "Close the loop without copying the secret into another inbox.",
      paragraphs: [
        "Knowing when a link was opened lets you finish the operational story: rotate, follow up, or revoke.",
        "Turn on the alert channel that matches how you work—email for async, live alerts for live handoffs—and keep the plaintext where it belongs: inside the encrypted note.",
      ],
    },
  ],
  ctaTitle: "Send the secret. Get the status.",
  ctaBody:
    "Enable open and destroy alerts so you know when a PrivateNote handoff moves—without putting the message into email.",
  ctaButton: "Create a note with alerts",
};
