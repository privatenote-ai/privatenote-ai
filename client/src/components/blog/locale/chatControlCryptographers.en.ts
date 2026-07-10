import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersEn: ChatControlCryptographersArticleCopy = {
  heroAlt: "Chat Control is back editorial graphic with a locked chat bubble and map of Europe",
  heroCaption: "Illustration generated for PrivateNote.ai.",
  intro:
    "Today, Tuesday, July 7, the European Parliament is expected to revisit the proposed Child Sexual Abuse Regulation, commonly known by critics as Chat Control. The goal behind the proposal is not controversial: children must be protected from horrific abuse. The technical question is whether mandatory scanning of private communications can do that without breaking the security guarantees everyone else depends on.",
  updatePrefix: "**Update (9 July 2026):** Parliament extended Chat Control 1.0 even though more MEPs voted against it than for it.",
  updateLink: "Read what happened and why",
  updateSuffix: ".",
  calloutTitle: "This is not a debate about whether child abuse should be fought.",
  calloutBody:
    "Victims deserve protection. Law enforcement deserves effective tools. Platforms should rapidly report known illegal material and cooperate in investigations. The disagreement is whether mass scanning of everyone's private messages is a technically sound way to get there.",
  expertEyebrow: "Expert warning",
  expertTitle: "Bart Preneel: the security community is unusually aligned",
  expertParagraphs: [
    "Bart Preneel, full professor at KU Leuven and one of Europe's best-known experts in cryptography, privacy, and digital rights, warned today that Chat Control is returning for a third vote after two earlier votes failed to settle the issue. In his LinkedIn post, he described the proposal as indiscriminate scanning of unencrypted communications, now extended to the use of AI to find new CSAM.",
    "Preneel also pointed to the unusually broad expert consensus behind the criticism: more than 800 cybersecurity and privacy experts have warned that mass scanning and AI-based content analysis still have unacceptable error rates, raise serious proportionality concerns, and are less effective than targeted approaches. As he put it, the security community rarely reaches this level of agreement on any topic.",
    "His practical recommendation is direct: contact Members of the European Parliament and explain why indiscriminate scanning is not a sound way to address the serious problem of CSAM distribution.",
    "For the technical background, he points readers to two scientist letters: the September 2025 open letter, which explains the core concerns with client-side scanning and AI-based detection, and the November 2025 follow-up, which argues that the proposed increase in scope amplifies the same risks the security community has already identified.",
  ],
  expertLinks: {
    preneel: "Bart Preneel's LinkedIn post",
    sep2025: "September 2025 open letter",
    nov2025: "November 2025 follow-up",
  },
  technicalConcerns: [
    {
      title: "AI cannot reliably classify unknown CSAM at Internet scale",
      body: "Image classification depends on context. Family photos, medical images, educational material, and consensual images exchanged by teenagers can be difficult even for humans to interpret correctly.",
    },
    {
      title: "Known-image matching can be evaded",
      body: "Cropping, resizing, compression, small pixel changes, and adversarial perturbations can leave an image recognizable to a person while changing how automated matching systems see it.",
    },
    {
      title: "Client-side scanning changes the encryption trust model",
      body: "The encryption algorithm may remain mathematically strong, but the software is required to inspect content before encryption protects it. That is not the privacy guarantee users expect from end-to-end encryption.",
    },
    {
      title: "Scanning infrastructure becomes a high-value target",
      body: "Once devices are required to inspect private messages, the same mechanism can attract attackers, political pressure, and future demands to scan for other categories of content.",
    },
  ],
  protectedGroups: [
    "journalists and confidential sources",
    "lawyers and clients",
    "doctors and patients",
    "businesses protecting trade secrets",
    "government officials and diplomats",
    "law enforcement and military communications",
  ],
  betterInvestments: [
    { title: "Support victims", body: "Trauma-informed reporting channels and long-term victim support." },
    { title: "Fund specialists", body: "More capacity for trained law enforcement teams that investigate abuse." },
    { title: "Investigate evidence", body: "Rapid, targeted investigation based on concrete leads and reports." },
    { title: "Work across borders", body: "International cooperation where offenders, platforms, and victims span jurisdictions." },
    { title: "Remove confirmed material", body: "Faster takedown of known illegal content after proper confirmation." },
    { title: "Prevent abuse earlier", body: "Education and prevention work before abuse occurs." },
  ],
  betterInvestmentEyebrow: "Better investment",
  betterInvestmentTitle: "Strengthen the work that directly helps victims and investigators",
  sections: {
    proposalReturns: {
      title: "The proposal keeps returning",
      paragraphs: [
        "Over the last several years, CSAR has gone through multiple revisions. Some changes deserve recognition: faster handling of voluntary reports, clearer obligations, and narrower categories of content are all better than broader, vaguer mandates.",
        "But those changes do not remove the central technical problem. The most contested versions of Chat Control still rely on detection technologies that cryptographers, computer scientists, and security researchers have warned are not reliable enough to deploy against hundreds of millions of private communications.",
      ],
    },
    cryptographersObject: { title: "Why cryptographers keep objecting" },
    e2eeScanning: {
      title: "End-to-end encryption cannot survive mandatory client-side scanning",
      paragraphs: [
        "End-to-end encryption gives users a simple promise: only the sender and the intended recipient can read the message. Mandatory client-side scanning changes that promise. The device must inspect the message before encryption protects it and report anything the scanning system considers suspicious.",
        "In transit, the message may still be encrypted with strong cryptography. The problem is what happens before that step. If software is required to examine the plaintext on the device and report matches to an outside system, the endpoint is no longer acting only for the user. That is a different trust model from end-to-end encryption as people understand it.",
      ],
    },
    encryptionProtects: {
      title: "Encryption protects more than personal chats",
      intro:
        "The public debate often sounds as if encrypted messaging is only about casual conversation. It is not. Secure private communication is critical infrastructure for people and institutions that face real risk.",
    },
    moreTech: {
      title: "More technology does not automatically mean more safety",
      paragraphs: [
        "The proposal also sits alongside broader calls for age verification and additional mitigation systems. Those ideas may sound like extra safety layers, but security engineering is rarely improved by adding complexity without understanding the new attack surfaces it creates.",
        "Centralized identity checks, scanning pipelines, review queues, and reporting infrastructure can all introduce privacy risks of their own. A system built to protect children should not quietly create new databases, new surveillance incentives, and new failure modes for everyone.",
      ],
    },
    betterWays: {
      title: "There are better ways to protect children",
      intro:
        "One point from the scientific criticism deserves special attention: CSAM is evidence of an earlier crime. The real objective should be preventing abuse, supporting victims, and enabling targeted investigations that can actually identify offenders.",
    },
    privateNote: {
      title: "Why this matters for PrivateNote",
      paragraphs: [
        "At PrivateNote, the principle is simple: when you create an encrypted note, only the people you choose should be able to read it. Not us. Not advertisers. Not cloud providers. Not anyone else.",
        "That principle is not a slogan. It reflects decades of cryptographic engineering. The debate around Chat Control asks whether private communication should remain genuinely private, or whether every device should become a mandatory checkpoint that inspects messages before they are encrypted.",
      ],
    },
    policyReality: {
      title: "Policy should follow technical reality",
      paragraphs: [
        "Reasonable people can disagree on policy. **But policy should be informed by technical reality.** When hundreds of cryptographers, computer scientists, security engineers, and privacy researchers warn that a proposed technology cannot deliver its promises without weakening fundamental security guarantees, lawmakers should listen.",
        "Protecting children and protecting secure communications are not mutually exclusive goals. Europe should pursue solutions that accomplish both.",
      ],
    },
  },
  ctaTitle: "Send private notes without giving the server the key",
  ctaBody: "PrivateNote encrypts notes in your browser and keeps the decryption key in the URL fragment.",
  ctaButton: "Try PrivateNote ->",
};
