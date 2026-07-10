import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedEn: ChatControl10VoteArticleCopy = {
  heroAlt: "European Parliament vote on Chat Control with a locked chat bubble over a map of Europe",
  heroCaption: "Illustration generated for PrivateNote.ai.",
  intro:
    "On 9 July 2026, something unusual happened in the European Parliament. The final vote on the extension of the temporary Chat Control 1.0 regulation ended with more Members of the European Parliament voting against it than for it—yet the measure still passed.",
  voteEyebrow: "Final vote, 9 July 2026",
  voteHeadline: "More “No” votes than “Yes”—and it still passed",
  voteLabels: { against: "Against", for: "In favour", abstentions: "Abstentions" },
  voteSummary:
    "At first glance, most observers would conclude that the proposal had been rejected. The answer lies not in encryption or cybersecurity—but in parliamentary procedure.",
  nonE2eChannels: [
    "traditional email services",
    "cloud storage",
    "certain direct messaging services",
    "other communications where providers can access message contents",
  ],
  privacyConcerns: [
    {
      title: "False positives",
      body: "Detecting already-known illegal material using cryptographic hashes is generally reliable, but it is not perfect. Researchers have demonstrated collisions and implementation errors that can generate false reports. If providers begin using AI to identify new, previously unseen material, the false positive rate becomes substantially harder to control. Every false positive potentially involves an innocent person's private communication being flagged for further review.",
    },
    {
      title: "Expansion of surveillance infrastructure",
      body: "Many experts argue that once platforms build large-scale scanning systems, expanding their use to additional purposes becomes technically straightforward. History shows that technologies introduced for narrow purposes often evolve into broader surveillance capabilities over time.",
    },
    {
      title: "Chilling effects",
      body: "Private communication only works when people trust that their conversations remain private. If users believe every message may be automatically analysed, many may avoid discussing sensitive topics altogether—even when perfectly lawful. This phenomenon is well documented in privacy research.",
    },
    {
      title: "Limited effectiveness",
      body: "More than 800 cybersecurity and privacy researchers have argued that broad message scanning is unlikely to significantly reduce child abuse while imposing substantial privacy costs on hundreds of millions of users. Critics argue that law enforcement resources are better invested in targeted investigations rather than indiscriminate scanning.",
    },
  ],
  e2eeCalloutTitle: "End-to-end encryption changes the trust model",
  e2eeCalloutBody:
    "End-to-end encryption ensures that only the sender and intended recipient possess the cryptographic keys needed to read a message. Even the service provider cannot decrypt the contents. Any requirement to inspect encrypted messages before or after encryption fundamentally changes that security model—and has become one of the most controversial topics in modern cybersecurity policy.",
  sections: {
    whyPassed: {
      title: "Why did it pass?",
      paragraphs: [
        "This was not a standard legislative vote requiring a simple majority of votes cast. Because of the specific procedural stage of this legislation, **rejecting the proposal required an absolute majority of all Members of the European Parliament—currently 361 votes**.",
        "Although 314 MEPs voted against the proposal, that number fell short of the required threshold. As a result, the proposal was considered approved.",
      ],
      callout:
        "This procedural outcome has surprised many observers, including journalists, legal experts, and cybersecurity researchers, because the intuitive expectation is that more “No” votes than “Yes” votes should defeat a proposal.",
    },
    whatItDoes: {
      title: "What does Chat Control 1.0 actually do?",
      paragraphs: [
        "The adopted measure does **not** introduce mandatory scanning of all private messages. Instead, it extends the existing temporary legal framework that allows online service providers to **voluntarily** detect and report child sexual abuse material (CSAM) in certain types of communications until 3 April 2028.",
        "This primarily applies to communications that are not protected by [end-to-end encryption](blog:what-is-end-to-end-encryption), such as:",
        "Importantly, the Parliament maintained language excluding end-to-end encrypted communications from this voluntary scanning framework. For a precise definition of what that means in practice—and how it differs from ordinary transport encryption—see our guide on [what end-to-end encryption actually is](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Why are privacy experts concerned?",
      intro:
        "Many researchers and civil liberties organisations opposed the extension—not because they oppose protecting children, but because they question whether this approach achieves that goal without creating significant risks. Our earlier article on [why Europe's cryptographers keep warning about Chat Control](blog:chat-control-europe-cryptographers) explains the broader technical objections in depth.",
    },
    chatControl20: {
      title: "The bigger story is Chat Control 2.0",
      paragraphs: [
        "While this week's vote has attracted significant attention, many experts believe the larger debate is still ahead. The proposal commonly referred to as Chat Control 2.0 aims to establish a permanent legal framework for detecting CSAM online.",
        "Unlike the temporary extension adopted this week, discussions around Chat Control 2.0 have repeatedly included proposals that could affect end-to-end encrypted communications. That is where the debate becomes considerably more significant—and where the warnings in our [cryptographers' briefing on Chat Control](blog:chat-control-europe-cryptographers) matter most.",
      ],
    },
    privateNote: {
      title: "Why this matters for PrivateNote",
      paragraphs: [
        "Private communication is built on a simple principle: if a service cannot read your message, it cannot scan it, analyse it, sell it, or accidentally expose it. PrivateNote was designed around that idea.",
        "When you create a note, encryption happens directly inside your browser. The encryption key never reaches our servers. We store only ciphertext. Without the key—which remains entirely under your control—the contents of your note are mathematically unreadable to us.",
        "That design is not about avoiding responsibility. It is about ensuring that your private communication remains exactly that: private. Whether you are sharing passwords, legal documents, financial information, business secrets, or personal conversations, privacy should not depend solely on trusting the service provider. It should be enforced by cryptography.",
        "For a step-by-step view of how browser-side encryption works in practice, see [how PrivateNote works](app:how-it-works). For sharing short-lived secrets without leaving them in a permanent chat thread, [one-time secret links](blog:one-time-secret-links) are often a better fit than messaging apps—even encrypted ones.",
      ],
    },
    debateContinues: {
      title: "The debate is far from over",
      paragraphs: [
        "Reasonable people can disagree about how society should combat online child abuse. Protecting children is unquestionably one of the most important public interests. The difficult question is how to achieve that goal without undermining the security and privacy infrastructure relied upon by journalists, businesses, lawyers, healthcare providers, activists, and ordinary citizens every day.",
        "As discussions continue around Chat Control 2.0, this balance between public safety and fundamental privacy rights will remain one of the defining technology policy debates in Europe. Whatever one's position, one thing is certain: the future of encrypted communication will increasingly be decided not only by cryptographers and software engineers—but also by legislators.",
      ],
    },
  },
  ctaTitle: "Send private notes without giving the server the key",
  ctaBody: "PrivateNote encrypts notes in your browser and keeps the decryption key in the URL fragment.",
  ctaButton: "Try PrivateNote ->",
};
