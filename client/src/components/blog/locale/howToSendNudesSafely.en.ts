import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const howToSendNudesSafelyEn: BlogGuideArticleCopy = {
  heroAlt:
    "A smartphone lying face-down on a dark desk beside a small lock, suggesting a private photo that should not linger in chats or cloud backups",
  heroCaption:
    "An intimate photo is a short-lived handoff, not a souvenir. Reduce what the frame reveals, where copies land, and how long the image remains available.",
  intro: [
    "Sending an intimate photo is an act of trust. Your phone does not understand trust.",
    "A picture sent to someone you know can still land in a camera roll, a cloud backup, a message history, a forwarded thread, or a compromised account. Relationships change. Digital copies do not automatically leave with them.",
    "That does not mean adults should not share intimate photos. It means treating the send as a **handoff**: share only what the recipient needs to see, keep identifying details out of the frame, and do not leave more copies behind than necessary. No tool can stop a determined recipient from photographing a screen. You can still drastically reduce what the image reveals, where it spreads, and how long the service keeps it.",
  ],
  sections: [
    {
      title: "Consent first—always",
      takeaway: "Intimate images require explicit consent between adults. Consent to receive is never consent to redistribute.",
      paragraphs: [
        "An intimate image requires explicit consent between adults. Never pressure someone to send one, and never send one to someone who has not asked for it. Receiving a private image is not a license to keep it forever, show it to friends, or post it anywhere.",
        "Consent is non-transferable. Agreeing to take or receive a private photo is never an agreement to pass it on. Sharing intimate media without consent is a privacy violation—and in many places a crime—regardless of how the recipient originally got the image.",
      ],
      calloutTitle: "If anyone depicted is under 18",
      callout:
        "The legal line is absolute. Do not create, request, forward, save, or redistribute sexual images of minors. If you encounter such material, use official reporting channels such as [Take It Down](https://takeitdown.ncmec.org/) rather than forwarding the file.",
    },
    {
      title: "The bigger risk usually isn’t nudity. It’s identification.",
      takeaway: "If someone can prove the photo is you, the rest of the exposure is much harder to contain.",
      paragraphs: [
        "The obvious sensitivity is your body. From a privacy perspective, the sharper question is: **can someone prove it is you?**",
        "Photos carry more identifying detail than most people notice. Your face is the strongest signal, but it is not the only one. You can eliminate most of that exposure before you touch an encryption setting, simply by sanitizing the frame. The same idea applies to [sharing any sensitive photo](blog:how-to-share-photos-securely): crop to what the recipient actually needs.",
      ],
      bullets: [
        "Tattoos, birthmarks, scars, or distinctive jewelry",
        "Mail, work badges, school papers, or nameplates in the background",
        "Mirrors, TV screens, or glossy surfaces reflecting off-camera details",
        "A recognizable view through a window, or a room that is clearly yours",
      ],
    },
    {
      title: "Ten practical rules",
      takeaway: "Sanitize the pixels, strip hidden metadata, and use a short-lived encrypted link—not a chat that is designed to remember.",
      checklist: [
        "Keep your face out of the frame",
        "Clear the background of badges, mail, and distinctive décor",
        "Check reflections in mirrors, TVs, and glass",
        "Strip location and device metadata before the file leaves your device",
        "Capture in a temporary tool instead of your permanent camera roll",
        "Do not confuse encryption in transit with disappearance after viewing",
        "Treat view-once as risk reduction, not anti-copying DRM",
        "Independently verify who you are talking to",
        "Downsize the file; you do not need a 48-megapixel original",
        "Keep accompanying text and profile names as anonymous as the photo",
      ],
      paragraphsAfterChecklist: [
        "**Keep your face out of frame.** Removing your face strips the single strongest piece of identifying data.",
        "**Clean the background.** A plain wall is better than a room full of clues. Move work badges, mail, family photos, and distinctive décor out of shot.",
        "**Check reflections.** A mirror or television can reveal a person or a room you thought was out of frame.",
        "**Strip location and device metadata.** Photos often store EXIF data—GPS, timestamps, and phone model. Encryption does not remove that; it only scrambles the file as-is. PrivateNote can [re-encode supported images in the browser](blog:how-to-share-photos-securely) to drop common embedded metadata before encryption. Leave that toggle on.",
        "**Bypass the permanent camera roll.** Taking the photo in your regular camera app often backs it up to iCloud or Google Photos, syncs it to other devices, and leaves a local original. Capturing with **Take photo** in the PrivateNote composer uses the live camera in the browser, so the JPEG is created in memory and encrypted before upload instead of being saved to your library first. Picking an existing picture from the library does not give you that benefit.",
        "**Do not confuse encryption with disappearance.** [End-to-end encryption](blog:what-is-end-to-end-encryption) protects an image in transit and, in PrivateNote’s model, keeps plaintext off the server. It does not govern what the recipient does after they decrypt and view it. The same gap exists in encrypted chats: see [why secrets do not belong in chat](blog:secrets-never-send-in-chat).",
        "**Treat view-once as risk reduction, not DRM.** [One-time secret links](blog:one-time-secret-links) keep photos from sitting in a thread for years. They cannot stop someone photographing the screen with another device.",
        "**Verify who you are actually talking to.** Sextortion typically starts with a fake profile obtaining an explicit photo, then threatening exposure. Never send intimate media to someone you have not independently verified—another account, a video call, or an in-person confirmation. A [recipient verification code](blog:recipient-verification-code-before-reveal) helps when the delivery channel itself may be weak, but it does not prove the person is who they claim to be.",
        "**Resize the file.** You do not need a 48-megapixel original for a phone-sized view. Downsizing reduces leftover detail from zooming and often drops hidden metadata with it.",
        "**Keep the accompanying text anonymous.** A sanitized photo next to “Hey, it’s Sarah from accounting” undoes the prep work. Consider the entire payload: image, caption, and profile handle.",
      ],
      midCta: {
        body: "Create a one-time encrypted note, capture the photo in the composer, and share a link that burns after it is opened—not a copy that lives in chat history.",
        button: "Create a private note",
      },
    },
    {
      title: "The screenshot reality check",
      takeaway: "If someone can see a photo on a screen, they can capture that screen. Disappearing delivery still matters.",
      paragraphs: [
        "Some platforms try to block or report screenshots. That adds useful friction. It is not a true security boundary.",
        "If a recipient can see a photo, they can photograph that screen with another camera or use modified software to capture it. Disappearing photos are valuable because they stop sensitive material from casually lingering in chat logs—not because they block a bad actor.",
        "PrivateNote is explicit about this: [click-to-reveal](blog:click-to-reveal-private-notes) makes opening deliberate, expiry and burn-after-read limit leftover service copies, and [revoking an unopened note](blog:revoke-unopened-note-proof-of-access) can stop a mistaken send. None of those remotely delete a copy the recipient already saved.",
      ],
      calloutTitle: "What expiration actually does",
      callout:
        "Expiration stops PrivateNote from serving the encrypted handoff. It does not erase a screenshot, a downloaded file, or a photo taken of the screen. Design the send so a leftover copy is less identifying and less useful—not so you can pretend copies are impossible.",
    },
    {
      title: "A simple privacy-conscious workflow",
      takeaway: "Setup, capture, inspect, deliver, then clean up local leftovers.",
      comparisonTable: {
        headers: ["Step", "Action", "Why it matters"],
        rows: [
          [
            "1. Setup",
            "Clear the background, remove identifying items, and check reflections.",
            "Most identification leaks are in the pixels, not the transport.",
          ],
          [
            "2. Capture",
            "Use Take photo in PrivateNote so the image is created in the browser, not in your camera roll.",
            "Avoids iCloud / Google Photos backups of the original.",
          ],
          [
            "3. Inspect",
            "Take ten seconds to inspect the edges of the frame before you send.",
            "A badge, a mirror, or a window view is easier to fix now than later.",
          ],
          [
            "4. Deliver",
            "Send a browser-encrypted, single-view link. Optionally add a separately delivered verification code.",
            "The server stores ciphertext; the complete URL is a bearer secret.",
          ],
          [
            "5. Cleanup",
            "Clear local drafts, downloads, and any working copies you do not need to keep.",
            "Your own devices are often the longest-lived copy.",
          ],
        ],
        after: [
          "For ID scans, medical paperwork, or other documents rather than intimate photos, the same pattern is in [how to share photos securely](blog:how-to-share-photos-securely) and [encrypted vs “secure” file sharing](blog:encrypted-vs-secure-file-sharing).",
        ],
      },
    },
    {
      title: "How PrivateNote handles intimate media",
      takeaway: "Encrypt locally, keep the image off the camera roll when you capture in-app, and make service access temporary. The recipient can still save what they see.",
      paragraphs: [
        "PrivateNote approaches photo sharing on a simple premise: some information only needs to exist long enough to be delivered.",
        "When you capture with **Take photo** in the composer, the image is encoded as a JPEG in the browser, then encrypted on your device before upload. That keeps the original out of your permanent photo library. Recipients open a unique link, decrypt in their browser, and the note follows its burn and expiry policy.",
        "You can add [click-to-reveal](blog:click-to-reveal-private-notes) so the note does not decrypt on a mis-tap, a [recipient verification code](blog:recipient-verification-code-before-reveal) sent on a separate channel, and [open alerts](blog:know-when-secret-link-opened) so you know when the link was used—status only, never the photo itself. If you sent the link to the wrong person and they have not opened it, [revoke it](blog:revoke-unopened-note-proof-of-access).",
        "Treat the **complete PrivateNote URL as a bearer secret**. It normally carries decryption-key material in the fragment after `#`. Anyone with the full link may be able to open it until it expires. Do not paste the photo into the chat alongside the link.",
      ],
      calloutTitle: "Honest limit",
      callout:
        "PrivateNote reduces unnecessary retention and keeps images off permanent cloud drives we can read. It cannot prevent a recipient from photographing a screen, and it cannot un-send a copy they already saved.",
    },
    {
      title: "If a photo is shared without consent",
      takeaway: "Keep evidence, do not pay, cut off contact, and use hash-based removal tools. Do not send more images.",
      paragraphs: [
        "If an intimate photo escapes or is being used for extortion:",
      ],
      bullets: [
        "**Do not panic-delete the thread.** Keep messages, account details, and headers as evidence for local law enforcement or platform moderators.",
        "**Do not pay.** Anti-cybercrime authorities and victim-support networks advise against paying or sending further material. It rarely stops the extortion. Cut off contact and report the account.",
        "**Use global removal tools.** For adults, [StopNCII.org](https://stopncii.org/) creates an encrypted digital fingerprint (hash) of the photo on your device. Participating platforms use that fingerprint to block and remove uploads without taking possession of your original image.",
        "**For minors:** [Take It Down](https://takeitdown.ncmec.org/) uses the same device-side hashing idea to help stop the spread of explicit media involving minors. Report through official channels; do not circulate the file.",
      ],
      paragraphsAfterChecklist: [
        "Platforms in several jurisdictions also have statutory windows to process valid removal requests for non-consensual intimate imagery. Use those forms in parallel with law enforcement if you are being threatened.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Can a disappearing photo stop screenshots?",
          answer:
            "No. Screenshot warnings add friction. If the recipient can see the image, they can capture the screen. Use disappearing delivery to keep the photo out of chat history—not as a promise that copies are impossible.",
        },
        {
          question: "Is Snapchat or iMessage view-once enough?",
          answer:
            "Those settings reduce how long the photo sits in the thread. They do not reliably prevent saves, another camera, or cloud backups of the original on your own device. A browser-encrypted one-time link plus in-app capture is a tighter handoff for the same job.",
        },
        {
          question: "Does PrivateNote save the photo to my camera roll?",
          answer:
            "Not if you use Take photo in the composer: the JPEG is created in the browser and encrypted before upload. Choosing a picture that already lives in Photos does not remove that library copy or its backups.",
        },
        {
          question: "Should I send nudes to someone I have only met online?",
          answer:
            "Not until you have independently verified who they are. Financially motivated extortion depends on obtaining an identifying explicit photo from a stranger. Verification codes protect the link; they do not prove identity.",
        },
        {
          question: "What if I sent the link to the wrong person?",
          answer:
            "If they have not opened it, revoke the unopened note. After reveal, assume they may have a copy. That is why keeping your face and other identifiers out of the frame still matters after a mistake.",
        },
        {
          question: "Does encryption mean PrivateNote cannot see the photo?",
          answer:
            "In PrivateNote’s model, encryption happens in the browser before upload. The service stores ciphertext, not a readable image. See [encrypted vs “secure” file sharing](blog:encrypted-vs-secure-file-sharing) for the architectural distinction.",
        },
      ],
    },
    {
      title: "The bottom line",
      takeaway: "Share less identifying detail, fewer copies, and a shorter access window—without pretending the recipient cannot capture a screen.",
      paragraphs: [
        "Adults can share intimate photos more safely by treating the send as a temporary handoff: sanitize the frame, strip metadata, keep the original off the camera roll, and deliver through a browser-encrypted one-time link.",
        "The goal is not a magical un-send. It is to leave less proof, fewer leftover copies, and less time for the image to sit where you did not mean it to live.",
      ],
    },
  ],
  ctaTitle: "Send the photo as a one-time encrypted handoff.",
  ctaBody:
    "Capture in the PrivateNote composer, encrypt in the browser, and share a link that expires after it is opened. Protect the complete URL—and remember that a trusted recipient can still save what they see.",
  ctaButton: "Create a private note",
};
