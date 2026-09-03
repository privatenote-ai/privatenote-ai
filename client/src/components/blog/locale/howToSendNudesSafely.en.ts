import type { HowToSendNudesSafelyCopy } from "./howToSendNudesSafely.types";

export const howToSendNudesSafelyEn: HowToSendNudesSafelyCopy = {
  heroAlt:
    "A smartphone lying face-down on a dark desk beside a small lock, suggesting a private photo that should not linger in chats or cloud backups",
  heroCaption:
    "Treat an intimate photo as a short-lived handoff: less identifying detail, fewer copies, a shorter access window.",
  quickAnswer:
    "There is no risk-free way to send an intimate photo. The safest approach is to remove identifying details, avoid permanent local copies, strip location metadata, and use an encrypted one-time link. Design the photo as if a leftover copy might outlive the relationship.",
  consent: {
    title: "Consent first",
    takeaway: "A relationship is not standing consent, and consent to receive is never consent to redistribute.",
    paragraphs: [
      "Intimate images require explicit consent between adults. Never pressure someone to send one, and never send one to someone who has not asked. Receiving a private image is not a license to keep it, show it around, or post it.",
      "Even in a relationship, ask first. A partner who likes nudes is not automatically okay with an unsolicited photo in the middle of their workday. Talk about likes, timing, and limits—and honor them.",
      "Consent is not transferable. Agreeing to take or receive a photo is never an agreement to pass it on. Sharing intimate media without consent is a privacy violation—and in many places a crime.",
    ],
    warningTitle: "If anyone depicted is under 18",
    warning:
      "Do not use PrivateNote to create, request, send, store, or redistribute sexual images involving minors. Laws differ by jurisdiction, including how they treat self-produced images between minors, and the consequences can be serious. If an image of you was taken when you were under 18 and is being shared or threatened, use an official service such as [Take It Down](https://takeitdown.ncmec.org/). Do not redistribute the image while seeking help.",
  },
  identify: {
    title: "The bigger risk is identification",
    takeaway: "If someone can prove the photo is you, the rest is much harder to contain.",
    lead: "Nudity is sensitive. From a privacy perspective the sharper question is whether the frame can prove it is you. Clean the pixels before you touch an encryption setting. The same idea applies to [any sensitive photo](blog:how-to-share-photos-securely): crop to what the recipient actually needs.",
    items: [
      "Face, tattoos, birthmarks, scars, or distinctive jewelry",
      "Mail, diplomas, sticky notes, work badges, school papers, or nameplates",
      "Mirrors, TVs, or glass reflecting off-camera details",
      "A recognizable window view, landmark, poster, or a room that is clearly yours",
    ],
    after:
      "Crop identifying details out of the frame where you can. If cropping is impractical, cover them completely with clothing, a prop, or an opaque mask. Use blur only if it is strong enough that the original detail cannot reasonably be recognized. A decorative mask only helps if it covers enough of your face.",
  },
  rules: {
    title: "How to send nudes safely in practice",
    takeaway:
      "Sanitize the frame, keep originals off your camera roll, and send a short-lived link. Their unlocked phone and a future breakup still count.",
    groups: [
      {
        heading: "Clean the frame",
        paragraphs: [
          "**Keep your face out of frame.** A face is one of the strongest and easiest ways to connect an intimate image to your identity. A unique tattoo, an identifiable room, leftover metadata, or the account next to the link can be enough on their own.",
          "**Clean the background.** A plain wall is better than a room full of clues. Move work badges, mail, diplomas, sticky notes, family photos, posters, and distinctive décor out of shot. Close blinds on a window that shows a landmark or a street you could be placed by.",
          "**Check reflections.** A mirror or television can reveal a person or a room you thought was out of frame. Glance at glass and screens before you send.",
          "**Crop first, then cover, then blur.** Crop identifying details out entirely where possible. If cropping is impractical, cover them with clothing, a prop, shadow, or an opaque mask. Use blur only as a fallback, and only if it is strong enough that the original detail cannot reasonably be recognized. In PrivateNote, **Take photo** lets you crop before encryption; treat the blur brush as a last pass, not a substitute for cropping.",
        ],
      },
      {
        heading: "Keep copies off your devices",
        paragraphs: [
          "**Capture inside the sharing tool when you can.** Taking the photo in your regular camera app often creates a copy in a cloud-synced photo library. **Take photo** in the PrivateNote composer uses the live camera in the browser and does not intentionally save the captured image to your photo library. The JPEG is then encrypted before upload. Picking an existing library picture does not give you that benefit.",
          "**If you already took the photo with the regular camera,** check whether it has synced to iCloud Photos, Google Photos, or another backup service. Delete copies you no longer want from both the device and the synchronized library, including Recently Deleted or Trash. Do not toggle your entire photo backup system on and off around a single picture.",
          "**Re-encode instead of trusting EXIF stripping.** Photos often store embedded metadata—GPS, timestamps, and phone model—in more than one structure. Encryption does not remove that; it only scrambles the file as-is. PrivateNote can create a new encoded version of supported images in the browser before encryption, discarding common embedded metadata rather than uploading the original file unchanged. Leave **Remove location & photo metadata** on. See [how to share photos securely](blog:how-to-share-photos-securely).",
          "**Resize the file.** You do not need a 48-megapixel original for a phone-sized view. Downsizing reduces leftover detail from zooming and often drops hidden metadata with it.",
        ],
      },
      {
        heading: "If you want to keep one",
        paragraphs: [
          "Avoid keeping highly sensitive images in your ordinary cloud-synced photo library. Those libraries optimize for availability, synchronization, and retention—often the opposite of what you want here. If you choose to retain one, prefer a protected or encrypted location with strong device and account authentication, and understand whether it is backed up or synchronized elsewhere.",
          "PrivateNote is a handoff, not an archive. Expiration removes our copy of the encrypted file; it does not create a private album on your device.",
        ],
      },
      {
        heading: "Send a handoff, not a souvenir",
        paragraphs: [
          "**Do not confuse encryption with disappearance.** [End-to-end encryption](blog:what-is-end-to-end-encryption) protects an image in transit and, in PrivateNote’s model, keeps plaintext off the server. It does not govern what the recipient does after they decrypt and view it. The same gap exists in encrypted chats—see [why secrets do not belong in chat](blog:secrets-never-send-in-chat).",
          "**Treat view-once as risk reduction, not DRM.** [One-time secret links](blog:one-time-secret-links) keep photos from sitting in a thread for years. They cannot stop someone photographing the screen with another device.",
          "**Assume today’s partner can become tomorrow’s leak.** The person you trust now may not be trustworthy after a breakup. That is why a less-identifying frame still matters in a committed relationship: leftover copies outlive the relationship.",
          "**Verify who you are actually talking to.** Sextortion typically starts with a fake profile obtaining an explicit photo, then threatening exposure. Never send intimate media to someone you have not independently verified. A [recipient verification code](blog:recipient-verification-code-before-reveal) helps when the delivery channel itself may be weak, but it does not prove identity.",
          "**Ask them to delete it when they are done.** This is not a technical control and does not prevent screenshots, but it makes your expectation clear: the image was intended to be private and temporary, not forwarded or published.",
          "**Keep the accompanying text anonymous.** A sanitized photo next to “Hey, it’s Sarah from accounting” undoes the prep work. Consider the entire payload: image, caption, and profile handle.",
        ],
      },
      {
        heading: "Their phone is part of the send",
        paragraphs: [
          "None of this holds if their phone is unlocked on a bar table. Ask them to use a passcode or biometric lock. Unique passwords and two-factor authentication on their accounts make it harder for someone else to open the thread or the cloud backup later. A password manager helps if they cannot keep unique logins straight.",
          "Think about notification previews. Do not describe the contents in the message carrying the link. Lock-screen notifications can expose the context even when the photo itself is encrypted. For particularly sensitive exchanges, both people should consider hiding message previews on the lock screen.",
          "If they will not lock the device, treat that as a reason not to send.",
        ],
      },
    ],
    midCtaBody:
      "Capture in the composer, encrypt in the browser, and share a link that burns after it is opened.",
    midCtaButton: "Create a private note",
  },
  screenshot: {
    title: "Screenshots are not a solved problem",
    takeaway: "If someone can see a photo, they can capture the screen. Disappearing delivery still matters.",
    paragraphs: [
      "Screenshot warnings add friction. They are not a security boundary. Disappearing photos are valuable because they stop material lingering in chat logs—not because they block a determined recipient.",
      "PrivateNote is explicit: [click-to-reveal](blog:click-to-reveal-private-notes) makes opening deliberate, expiry limits leftover service copies, and [revoking an unopened note](blog:revoke-unopened-note-proof-of-access) can stop a mistaken send. None of those remotely delete a copy already saved.",
    ],
    calloutTitle: "What expiration actually does",
    callout:
      "It stops PrivateNote from serving the encrypted handoff. It does not erase a screenshot, a download, or a photo of the screen. Design the send so a leftover copy is less identifying—not so you can pretend copies are impossible.",
  },
  workflow: {
    title: "The safest way to send an intimate photo",
    takeaway: "Setup, capture, inspect, deliver, then clean up local leftovers.",
    steps: [
      {
        label: "Setup",
        action: "Clear the background, remove identifying items, check reflections. Ask whether they want a photo, and whether their phone is locked.",
        why: "Most identification leaks are in the pixels, not the transport. An unlocked phone undoes the rest.",
      },
      {
        label: "Capture",
        action: "Use Take photo in PrivateNote so the image is captured in the browser. Crop identifying details out; cover or strongly blur only what you cannot crop.",
        why: "PrivateNote does not intentionally save the captured image to your photo library. A regular camera shot often lands in a synced album.",
      },
      {
        label: "Inspect",
        action: "Take ten seconds on the edges of the frame before you send. Crop identifiers out; cover what remains.",
        why: "A badge, a tattoo, a mirror, or a landmark in a window is easier to crop or cover now than later.",
      },
      {
        label: "Deliver",
        action: "Send a browser-encrypted, single-view link. Optionally add a separately delivered verification code. Do not describe the contents in the message that carries the link. Ask them to delete the photo when they are done.",
        why: "The complete URL is a bearer secret. Notification previews can leak context. Asking them to delete states your expectation; it does not prevent a screenshot.",
      },
      {
        label: "Cleanup",
        action: "Clear drafts, downloads, and working copies you do not need to keep. If you keep one, use a protected location—not your ordinary synced photo library.",
        why: "Your own devices are often the longest-lived copy.",
      },
    ],
    after:
      "For ID scans or documents rather than intimate photos, use the same pattern in [how to share photos securely](blog:how-to-share-photos-securely) and [encrypted vs “secure” file sharing](blog:encrypted-vs-secure-file-sharing).",
  },
  product: {
    title: "How PrivateNote handles this",
    takeaway: "Encrypt locally and make service access temporary. The recipient can still save what they see.",
    paragraphs: [
      "Some information only needs to exist long enough to be delivered. **Take photo** captures a frame in the browser and encrypts it on your device before upload. PrivateNote does not intentionally save that capture to your photo library. After capture you can crop the frame; treat blur as a fallback for details you cannot crop. Recipients open a unique link, decrypt locally, and the note follows its burn and expiry policy.",
      "Add [click-to-reveal](blog:click-to-reveal-private-notes) so a mis-tap does not decrypt, a [verification code](blog:recipient-verification-code-before-reveal) on a separate channel, and [open alerts](blog:know-when-secret-link-opened) for status only—never the photo. Sent to the wrong person and still unopened? [Revoke it](blog:revoke-unopened-note-proof-of-access).",
      "Treat the **complete URL as a bearer secret**. It normally carries the decryption key after `#`. Do not paste the photo into the chat alongside the link, and do not describe the contents in the message that carries it.",
    ],
    calloutTitle: "Honest limit",
    callout:
      "PrivateNote reduces unnecessary retention and cannot read the image on our servers. It cannot prevent a recipient from photographing a screen, and it cannot un-send a copy they already saved.",
  },
  incident: {
    title: "If a photo is shared without consent",
    takeaway: "Keep evidence, do not pay, cut off contact, use hash-based removal. Do not send more images.",
    lead: "If an intimate photo escapes or is being used for extortion:",
    items: [
      "**Do not panic-delete the thread.** Keep messages, account details, and headers as evidence for law enforcement or platform moderators.",
      "**Do not pay.** Paying or sending further material rarely stops extortion. Cut off contact and report the account.",
      "**Use removal tools.** For adults, [StopNCII.org](https://stopncii.org/) hashes the photo on your device so participating platforms can block uploads without taking the original.",
      "**If the person depicted was under 18:** use [Take It Down](https://takeitdown.ncmec.org/). Report through official channels. Do not redistribute the file while seeking help.",
    ],
    after:
      "Use platform removal forms in parallel with law enforcement if you are being threatened. In the United States, covered platforms must provide a removal process for non-consensual intimate images.",
  },
  sources: {
    title: "Official resources and further help",
    intro:
      "These resources explain photo metadata, image-based abuse, and device-side hashing in more detail.",
    items: [
      {
        label: "FTC: Image-Based Abuse",
        description:
          "Official guidance on documenting abuse, ignoring extortion demands, reporting threats, and requesting removal.",
        href: "https://consumer.ftc.gov/articles/image-based-abuse-what-know-and-do",
      },
      {
        label: "StopNCII.org: How It Works",
        description:
          "Explains how participating platforms use a hash created on your device without receiving the original image.",
        href: "https://stopncii.org/how-it-works/",
      },
      {
        label: "Apple: Manage location metadata in Photos",
        description:
          "Instructions for viewing, removing, and preventing location metadata in photos on Apple devices.",
        href: "https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web",
      },
      {
        label: "NCMEC: Take It Down",
        description:
          "A device-side hashing service for images taken when the person depicted was under 18.",
        href: "https://takeitdown.ncmec.org/",
      },
    ],
  },
  faqs: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is the safest way to send nudes?",
        answer:
          "There is no completely safe method. Reduce the risk by removing your face and other identifiers, stripping location metadata, keeping the original out of ordinary cloud-synced photo libraries, and using a browser-encrypted one-time link. Assume the recipient can still save what they see—including after a breakup.",
      },
      {
        question: "Can I send a surprise nude to my partner?",
        answer:
          "Only if you have already agreed that unsolicited photos are welcome. Being in a relationship is not standing consent. Ask what they want, including when a photo is a bad idea—work, family, or a shared device.",
      },
      {
        question: "Can a disappearing photo stop screenshots?",
        answer:
          "No. Warnings add friction. If the recipient can see the image, they can capture the screen. Use disappearing delivery to keep the photo out of chat history—not as a promise that copies are impossible.",
      },
      {
        question: "Is Snapchat or iMessage view-once enough?",
        answer:
          "Those settings shorten how long the photo sits in the thread. They do not reliably prevent saves, another camera, or cloud backups of the original on your device. A browser-encrypted one-time link plus in-app capture is a tighter handoff.",
      },
      {
        question: "Does PrivateNote save the photo to my camera roll?",
        answer:
          "PrivateNote does not intentionally save a Take photo capture to your photo library. The frame is encoded in the browser and encrypted before upload. Choosing a picture that already lives in Photos does not remove that library copy or its backups.",
      },
      {
        question: "What if I already took the photo with my regular camera?",
        answer:
          "Send it through an encrypted one-time link with metadata removal on. Then check whether it has synced to iCloud Photos, Google Photos, or another backup, and delete copies you no longer want from the device and the synchronized library—including Recently Deleted or Trash. Next time, use Take photo in the composer so you are not deliberately creating a library copy.",
      },
      {
        question: "How should I store a nude I want to keep?",
        answer:
          "Avoid your ordinary cloud-synced photo library. If you choose to retain one, prefer a protected or encrypted location with strong device and account authentication, and understand whether it is backed up or synchronized elsewhere. PrivateNote expires the handoff; it is not a vault for photos you want to keep.",
      },
      {
        question: "Should I send nudes to someone I have only met online?",
        answer:
          "Not until you have independently verified who they are. Financially motivated extortion depends on obtaining an identifying explicit photo from a stranger. Verification codes protect the link; they do not prove identity.",
      },
      {
        question: "Does asking the recipient to delete the photo actually help?",
        answer:
          "It is not a technical control and does not prevent a screenshot or a second-device photo. It makes your expectation clear: the image was intended to be private and temporary, not forwarded or published.",
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
  close: {
    title: "The bottom line",
    takeaway: "Less identifying detail, fewer copies, a shorter window—without pretending the recipient cannot capture a screen.",
    paragraphs: [
      "Adults can share intimate photos more safely by treating the send as a temporary handoff: sanitize the frame, strip metadata, keep the original off the camera roll, and deliver through a browser-encrypted one-time link. Design the photo as if the relationship might end, and treat their unlocked phone as part of the risk.",
      "The goal is not a magical un-send. It is to leave less proof, fewer leftover copies, and less time for the image to sit where you did not mean it to live.",
    ],
  },
  ctaTitle: "Send the photo as a one-time encrypted handoff.",
  ctaBody:
    "Capture in the composer, encrypt in the browser, and share a link that expires after it is opened. Protect the complete URL—and remember that a trusted recipient can still save what they see.",
  ctaButton: "Create a private note",
};
