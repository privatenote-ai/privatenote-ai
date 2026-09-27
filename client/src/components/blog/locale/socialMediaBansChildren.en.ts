import type { SocialMediaBansChildrenArticleCopy } from "./socialMediaBansChildren.types";

export const socialMediaBansChildrenEn: SocialMediaBansChildrenArticleCopy = {
  heroAlt:
    "Teenager looking at a smartphone at home, illustrating debates over children's social media access and online safety policy",
  heroCaption: "Policy debates are accelerating—but the evidence on blanket bans is more mixed than headlines suggest.",
  intro: [
    "Parents have legitimate reasons to worry. Children are spending more time online than ever, encountering cyberbullying, harassment, engagement-driven recommendation algorithms, and content designed to maximize attention and screen time.",
    "Concerns about mental health, excessive screen time, and online safety have prompted governments worldwide to consider increasingly restrictive legislation. One proposal has gained particular momentum: **banning children from social media**.",
    "We see this political wave gathering pace globally—from Australia's landmark legislation restricting access for under-16s to similar proposals and debates across France, Denmark, and Norway. At first glance, the logic appears straightforward: if children cannot access social media, they cannot be harmed by it.",
    "Unfortunately, technology and human behavior are rarely that simple.",
    "A comprehensive report published by [Information Labs](https://informationlabs.org/wp-content/uploads/2026/07/SMB-Report.pdf) brings together experts in children's rights, psychology, cryptography, computer science, and digital policy. Despite approaching the issue from different disciplines, many contributors reach a similar conclusion: **blanket social media bans are unlikely to address the root causes of online harm and may introduce significant unintended consequences**.",
  ],
  sections: [
    {
      title: "The debate over harm and regulation",
      paragraphs: [
        "Supporters of age restrictions argue that governments have a responsibility to reduce children's exposure to known online risks, even while the scientific evidence continues to evolve. Waiting for perfect academic consensus, they argue, could delay protections for a vulnerable generation.",
        "The debate is therefore not whether online harms exist—they clearly do—but whether blanket social media bans are the most effective response.",
        "Researchers remain divided on both the scale of social media's effects and the effectiveness of broad restrictions. Much of the public debate has been shaped by social psychologist Jonathan Haidt, whose book [The Anxious Generation](https://www.anxiousgeneration.com/) links the rise of smartphones and social media to worsening adolescent mental health.",
        "Other researchers urge greater caution. Dr. Candice Odgers, Associate Dean for Research at the University of California, Irvine, has argued that strong causal claims linking digital technology to the youth mental health crisis are not currently supported by the broader body of scientific evidence.",
        "Furthermore, a landmark study by Amy Orben and Andrew K. Przybylski at the University of Oxford, published in **Nature Human Behaviour**, analyzed data from more than 355,000 adolescents and found that digital technology use explained **at most 0.4%** of the variation in well-being.",
        "This does not suggest that social media has no effect on individual children. Rather, it indicates that the relationship is considerably more complex than public debate often suggests, with family environment, existing mental health, education, socioeconomic factors, and social support all playing important roles.",
      ],
    },
    {
      title: "The risk of digital displacement",
      paragraphs: [
        "The Information Labs report highlights a concern that receives comparatively little public attention: **digital displacement**.",
        "Children do not simply disappear from the internet when access to mainstream platforms is restricted. Instead, some migrate toward online spaces that are significantly harder to monitor.",
        "Mainstream platforms—despite their many shortcomings—often provide reporting tools, moderation teams, safety features, and direct access to support resources. Smaller or niche platforms frequently offer far fewer safeguards.",
        "This concern is particularly relevant for marginalized young people. Research from [ReachOut Australia](https://about.au.reachout.com/our-research/social-media-report) shows that many young people use social media to access mental health information and support. Research from LGBTQIA+ youth organization [Minus18](https://www.minus18.org.au/resources) similarly highlights the importance of online communities for many queer young people, who often rely on them for friendship, emotional support, and a sense of belonging—particularly when comparable support may not be available offline.",
        "If mainstream services become inaccessible, some users may instead turn to:",
      ],
      bullets: [
        "Unregulated discussion forums",
        "Private encrypted groups with little or no moderation",
        "Virtual Private Networks (VPNs) to bypass restrictions",
        "Alternative international applications operating outside domestic oversight",
      ],
      callout:
        "Rather than eliminating risk, blanket bans may simply relocate it to places where parents, educators, researchers, and child-protection organizations have much less visibility.",
    },
    {
      title: "Why age verification raises privacy concerns",
      paragraphs: [
        "Any social media ban depends on one crucial assumption: platforms must be able to determine a user's age.",
        "As cryptographer **Dr. Bart Preneel** argues in his contribution to the Information Labs report, achieving this while preserving online privacy is extraordinarily difficult.",
        "To prove that someone is old enough to use a platform, adults—not only children—must increasingly submit sensitive personal information.",
        "Common proposals include:",
      ],
      bullets: [
        "AI-powered facial age estimation",
        "Government-issued identity documents such as passports or driver's licences",
        "Third-party identity verification services",
        "Credit card verification",
      ],
      callout:
        "Building policy around large-scale identity verification means creating new collections of highly sensitive personal data. Identity verification providers, like any organization that stores sensitive information, become attractive targets for cybercriminals. The result is a difficult trade-off: efforts intended to improve child safety may simultaneously increase privacy and cybersecurity risks for millions of legitimate users.",
    },
    {
      title: "The real issue: platform design",
      paragraphs: [
        "One of the strongest recurring themes throughout the Information Labs report is that online harms are strongly influenced by **how platforms are designed**, not simply by who uses them.",
        "Many major social media companies rely on business models that reward user engagement. Recommendation systems are typically optimized for metrics such as watch time, clicks, shares, or session length. While commercially effective, these objectives can also amplify emotionally engaging or sensational content because it keeps users interacting with the platform.",
        "Children—whose decision-making, impulse control, and emotional regulation are still developing—may be particularly susceptible to these design choices.",
        "Rather than excluding children entirely, organizations including [UNICEF](https://www.unicef.org/press-releases/age-restrictions-alone-wont-keep-children-safe-online) and the [5Rights Foundation](https://5rightsfoundation.com/) advocate changing the engineering incentives that shape digital platforms in the first place.",
      ],
    },
    {
      title: "Evidence-based alternatives",
      paragraphs: ["Instead of blanket bans, many experts recommend interventions that target the underlying causes of harm, including:"],
      bullets: [
        "Secure-by-design defaults for children's accounts, such as disabling autoplay and limiting late-night notifications",
        "Restrictions on behavioural profiling and targeted advertising directed at minors",
        "Limits on addictive interface features, including infinite scroll and autoplay",
        "Stronger enforcement of existing EU laws, especially the [Digital Services Act](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package) and the [General Data Protection Regulation (GDPR)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)",
        "Greater transparency around recommendation algorithms and improved access to platform data for independent academic researchers",
      ],
      callout:
        "These approaches aim to reduce harm while preserving privacy and maintaining access to legitimate online communities and support networks.",
    },
    {
      title: "A privacy and security perspective",
      paragraphs: [
        "Cybersecurity has repeatedly demonstrated that collecting more personal data rarely solves systemic security problems.",
        "Blocking malicious websites does not eliminate phishing. Strict password rules alone do not stop credential theft. Sustainable security comes from secure-by-design systems, sensible defaults, accountability, transparency, and user education.",
        "The same principle applies to children's online safety.",
        "Building large databases of identity documents to enforce age restrictions introduces entirely new attack surfaces. Policies intended to protect children should therefore be evaluated not only for their social objectives, but also for the privacy and security risks they create.",
        "Effective child protection and strong privacy do not have to be competing goals. Well-designed technologies and evidence-based regulation can support both.",
        "That is also why tools built for sensitive sharing—such as [one-time encrypted links](blog:one-time-secret-links) and [end-to-end encryption](blog:what-is-end-to-end-encryption)—matter: they reduce long-lived copies of secrets without requiring everyone to hand identity documents to every platform they use.",
      ],
    },
  ],
  preneelEyebrow: "Expert perspective",
  preneelTitle: "Bart Preneel on age verification and privacy",
  preneelParagraphs: [
    "Dr. Bart Preneel is a Belgian cryptographer and professor at KU Leuven. His contribution to the Information Labs report focuses on a question policymakers often treat as a technical detail: how do you verify age online without turning the entire internet into an identity checkpoint?",
    "Preneel's argument is not that child safety is unimportant. It is that **mandatory age gates scale poorly**—they push sensitive documents and biometric inference into commercial verification pipelines, create honeypots for attackers, and still fail against determined teenagers using VPNs or borrowed accounts.",
    "If you want the policy debate in plain language, his public talk on the topic is worth watching alongside the written report.",
  ],
  preneelVideoLabel: "Watch Bart Preneel on YouTube",
  preneelReportLabel: "Read the Information Labs report (PDF)",
  referencesTitle: "References and further reading",
  references: [
    {
      label: "Information Labs — Perspectives Report: Social Media Bans for Children (2026)",
      href: "https://informationlabs.org/wp-content/uploads/2026/07/SMB-Report.pdf",
    },
    {
      label: "Jonathan Haidt — The Anxious Generation",
      href: "https://www.anxiousgeneration.com/",
    },
    {
      label: "Candice L. Odgers — The great rewiring debate is overstated (Nature, 2024)",
      href: "https://www.nature.com/articles/d41586-024-00902-2",
    },
    {
      label: "Orben & Przybylski — Adolescent well-being and digital technology use (Nature Human Behaviour, 2019)",
      href: "https://doi.org/10.1038/s41562-018-0506-1",
    },
    {
      label: "ReachOut Australia — How young people use social media for mental health information and support",
      href: "https://about.au.reachout.com/our-research/social-media-report",
    },
    {
      label: "Minus18 — LGBTQIA+ youth resources",
      href: "https://www.minus18.org.au/resources",
    },
    {
      label: "UNICEF — Keeping Children Safe Online: Trends in Online Platform Regulation (2025)",
      href: "https://www.unicef.org/documents/keeping-children-safe-online",
    },
    {
      label: "5Rights Foundation",
      href: "https://5rightsfoundation.com/",
    },
    {
      label: "European Commission — Digital Services Act",
      href: "https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package",
    },
    {
      label: "EU General Data Protection Regulation (GDPR)",
      href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    },
  ],
  closingTitle: "Final thoughts",
  closingParagraphs: [
    "Protecting children online is one of the most important challenges facing modern society.",
    "The evidence does not suggest that online harms should be ignored. It does, however, suggest that the problem is considerably more complex than a simple choice between unrestricted access and blanket prohibition.",
    "Many researchers argue that meaningful progress will come from improving platform design, enforcing existing regulations, reducing incentives for addictive engagement, strengthening digital literacy, and protecting users' privacy.",
    "Those solutions require sustained regulation, technical redesign, and effective enforcement rather than a single legislative measure. They focus on addressing the systems that create online harms instead of simply restricting access—and they offer a path toward an online environment that is both safer for children and more respectful of everyone's privacy.",
  ],
  ctaTitle: "Share sensitive information without permanent copies",
  ctaBody:
    "When adults and teens need to pass passwords, recovery codes, or personal documents, one-time encrypted links reduce the damage if a message is forwarded, screenshotted, or stored in a chat log.",
  ctaButton: "Create a private note",
};
