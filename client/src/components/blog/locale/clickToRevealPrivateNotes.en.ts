import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesEn: BlogGuideArticleCopy = {
  heroAlt:
    "Recipient view of a PrivateNote reveal screen with a clear Open when ready warning before decrypt",
  heroCaption:
    "Reveal is intentional: the recipient chooses when to decrypt—and when the burn policy can take effect.",
  intro: [
    "Opening a one-time note should be deliberate. PrivateNote therefore shows a **click-to-reveal** gate with an explicit warning before decryption begins.",
    "The link can arrive early. The ciphertext can sit encrypted until someone is ready. Decrypt and consume happen only after the recipient confirms **Reveal Note**, with copy that makes the consequence clear: open only when ready—this cannot be undone.",
    "That pause is deliberate. It reduces accidental reveals from link previews, mis-taps, or opening on the wrong device before you are ready to consume a one-time note.",
  ],
  sections: [
    {
      title: "A confirmation step, not a scheduled unlock",
      takeaway: "The recipient chooses when to reveal; the server does not unlock the note on a calendar.",
      paragraphs: [
        "There is no “unlock this note next Tuesday at 09:00” switch in the product today. Instead, PrivateNote separates **delivery** from **opening**.",
        "You can send the link whenever coordination requires. The recipient can wait until they are at a private screen, have any verification code or passphrase ready, and are prepared for a one-time open. The secret stays sealed until that conscious action.",
        "Related timing controls still matter: note lifetime (how long the link works if never opened) and attachment download windows (how long files stay fetchable after open). Those limit availability; click-to-reveal limits *when decrypt starts*.",
      ],
    },
    {
      title: "Why accidental opens are expensive",
      takeaway: "One-time notes punish curiosity and mis-taps equally.",
      paragraphs: [
        "If a note is configured for a single view, the first successful reveal can destroy further access. Opening on a phone lock screen, a shared laptop, or a public Wi-Fi café can waste the only view—or expose content in the wrong place.",
        "The reveal screen forces a pause. Combined with [recipient verification codes](blog:recipient-verification-code-before-reveal), you get two deliberate steps before plaintext appears.",
      ],
      calloutTitle: "Product copy, by design",
      callout:
        "“Open only when you're ready — this cannot be undone.” is not marketing fluff. It is the safety rail for burn-on-open workflows.",
    },
    {
      title: "How the recipient flow works",
      takeaway: "Land on the link → optional verify → reveal → decrypt locally.",
      checklist: [
        "Open the complete PrivateNote URL",
        "Enter a verification code if the sender required one",
        "Read the reveal warning",
        "Press Reveal Note only when ready",
        "Decrypt happens in the browser; follow any open/burn policy afterward",
      ],
      paragraphsAfterChecklist: [
        "Senders can reinforce the pause with a clear instruction: “I’ll send the link now; don’t reveal it until we’re on the call.” The confirmation screen supports that instruction, but it does not schedule or technically enforce a future opening time.",
        "For the broader one-time model, see [one-time secret links](blog:one-time-secret-links) and [how to make a private note](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Send a note the recipient can hold until they are ready to open it.",
        button: "Create a private note",
      },
    },
    {
      title: "Timing controls that pair with reveal",
      takeaway: "Lifetime, open limits, and file windows complement the click gate.",
      comparisonTable: {
        headers: ["Control", "Protects against", "Typical use"],
        rows: [
          [
            "Click-to-reveal",
            "Accidental or premature decrypt",
            "Any one-time or high-sensitivity note",
          ],
          [
            "Note lifetime",
            "Stale unopened links",
            "“If they don’t open in 24h, kill it”",
          ],
          [
            "Open / view limit",
            "Repeated access after handoff",
            "Once (or a small fixed count)",
          ],
          [
            "Attachment download window",
            "Endless file re-downloads after open",
            "15 minutes default; longer on eligible plans",
          ],
        ],
      },
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Can I schedule a note to unlock at a future time?",
          answer:
            "Not as a server-side schedule. Share the link early if needed, and ask the recipient to wait—click-to-reveal plus optional verification keeps content sealed until they confirm.",
        },
        {
          question: "Does previewing the link decrypt the note?",
          answer:
            "The reveal confirmation is the intentional decrypt step. Recipients should not press Reveal until they are ready for the burn policy to apply.",
        },
        {
          question: "What if someone opens the link by mistake?",
          answer:
            "If they stop before Reveal, they may still be able to return later (subject to lifetime). After Reveal on a one-time note, further access is typically gone—send a new note if needed.",
        },
        {
          question: "How does this relate to email notifications?",
          answer:
            "Open and destroy alerts tell the sender when status changes. They do not include message content. See [how to know when a secret link was opened](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "The bottom line",
      takeaway: "Reveal is a conscious action, not an automatic consequence of loading a link.",
      paragraphs: [
        "Click-to-reveal lets you send a link early without decrypting the note merely because the landing page loaded.",
        "Pair it with short lifetimes, verification when channels are weak, and clear instructions to the recipient—and you get a practical pause before the secret is shown, without pretending the product can remote-delete a screenshot.",
      ],
    },
  ],
  ctaTitle: "Let the recipient reveal only when ready.",
  ctaBody:
    "PrivateNote keeps the ciphertext sealed until the recipient confirms reveal—so one-time notes are less likely to burn on an accidental tap.",
  ctaButton: "Create a note with click-to-reveal",
};
