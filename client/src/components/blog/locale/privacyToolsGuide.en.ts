import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideEn: PrivacyToolsGuideArticleCopy = {
  intro: [
    "Most “best privacy tools” pages are affiliate catalogs wearing a trench coat. They rank every category, bury the trade-offs, and leave you with twenty tabs and no system.",
    "This guide is different. It is a **2026 decision framework** for assembling a privacy stack that fits real life: what job you need done, what default to pick, when to upgrade, and when a tool is the wrong shape entirely.",
    "PrivateNote.ai sits in one narrow slot—**one-time secret handoffs**. Everything else below is curated opinion so you can leave this page with a coherent stack, then browse our [privacy tools directory](app:privacy-tools) for the fuller catalog.",
  ],
  sections: [
    {
      title: "Start with a threat model (not a shopping list)",
      paragraphs: [
        "Privacy tools only help if they match what you are defending against. A freelancer sharing Wi-Fi credentials has a different problem than a journalist facing targeted surveillance. Pick the lightest stack that covers *your* risks—then stop collecting tools for sport.",
      ],
      subsections: [
        {
          title: "Everyday personal use",
          paragraphs: [
            "You want less tracking, fewer password reuse disasters, and secrets that do not linger in chat. You are not trying to disappear from nation-states. Focus on a password manager, sane browser defaults, encrypted messaging for sensitive chats, and ephemeral links for one-off credentials.",
          ],
        },
        {
          title: "Freelancer or consultant",
          paragraphs: [
            "You hand secrets to clients who do not share your apps. Email and Slack become permanent archives of API keys and temporary passwords. Add one-time encrypted notes and encrypted file transfer; keep long-lived credentials in a vault, not in threads.",
          ],
        },
        {
          title: "Small team",
          paragraphs: [
            "You need shared access that can be revoked, clear rules for contractors, and less reliance on “just ping it in the channel.” Prefer password-manager sharing for ongoing access, one-time links for temporary handoffs, and written norms so convenience does not silently become policy.",
          ],
        },
      ],
      calloutTitle: "Rule of thumb",
      callout:
        "If a tool does not map to a job you actually do weekly, skip it. A minimal stack you use beats a purist stack you abandon.",
    },
    {
      title: "Privacy jobs, not product categories",
      paragraphs: [
        "Categories (VPN, browser, messenger) encourage collecting logos. Jobs force trade-offs into the open. Use this map to orient; the sections below go deeper.",
      ],
      comparisonTable: {
        headers: ["Job", "Default approach", "Wrong tool for the job"],
        rows: [
          [
            "Keep long-lived passwords",
            "Password manager + strong generator",
            "Browser-saved passwords alone, or chat archives",
          ],
          [
            "Hand someone a one-time secret",
            "Browser-encrypted expiring note",
            "Email, Slack, SMS, or a cloud folder “for now”",
          ],
          [
            "Day-to-day private chat",
            "End-to-end encrypted messenger",
            "SMS, or “disappearing” messages in apps that still archive metadata forever",
          ],
          [
            "Reduce browsing trackers",
            "Hardened mainstream browser + blocker",
            "Installing five conflicting privacy extensions",
          ],
          [
            "Untrusted networks",
            "Reputation-backed no-logs VPN",
            "Assuming a VPN makes you anonymous",
          ],
          [
            "Account takeover hygiene",
            "Breach check + 2FA / passkeys",
            "Reusing passwords and hoping",
          ],
        ],
        after: [
          "For product names, pricing notes, and exclusions, keep the [privacy tools directory](app:privacy-tools) open beside this guide.",
        ],
      },
    },
    {
      title: "Job: long-lived passwords",
      paragraphs: [
        "Passwords you will reuse for months belong in a vault—not in your brain, not in a notes app, and not in yesterday’s Teams thread.",
      ],
      subsections: [
        {
          title: "The problem",
          paragraphs: [
            "Reuse turns one breach into many. Weak memorable passwords fail offline cracking. Browser password stores help, but they rarely match dedicated managers for sync, sharing, and auditability.",
          ],
        },
        {
          title: "Default + alternative",
          paragraphs: [
            "**Default:** [Bitwarden](https://bitwarden.com/) for most people—open source, usable free tier, solid sync. **Alternative:** [KeePassXC](https://keepassxc.org/) if you want a local vault with no cloud. **When polish matters more than open source:** [1Password](https://1password.com/) is a fair pick; know you are choosing proprietary convenience.",
          ],
        },
        {
          title: "When not to use a manager alone",
          paragraphs: [
            "Managers excel at *storage* and ongoing shared access. They are awkward when the recipient has no account, or when the secret should die after one read. That is a different job—see one-time secrets below. Generate strong values with a local [password generator](app:password-generator) before you store or share them.",
          ],
        },
      ],
    },
    {
      title: "Job: one-time secrets",
      paragraphs: [
        "Passwords for contractors, recovery codes, API keys, Wi-Fi for a visitor—anything that should not become searchable history.",
      ],
      subsections: [
        {
          title: "The problem",
          paragraphs: [
            "Email and chat encrypt in transit, then archive forever. Cloud folders linger. Screenshots and device backups widen the blast radius. The failure mode is not “someone sniffs the wire”—it is “the secret is still there in six months.”",
          ],
        },
        {
          title: "Default",
          paragraphs: [
            "**Default:** a browser-encrypted, expiring note such as [PrivateNote.ai](app:home)—ciphertext on the server, decryption material in the link fragment, burn-after-reading or short TTL. For the model, see [how PrivateNote works](app:how-it-works) and [why email is the worst place for secrets](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "When not to use it",
          paragraphs: [
            "Do not replace your password manager or your daily messenger with one-time notes. Do not put long-lived documents or ongoing conversations in ephemeral links. And do not send the link and an optional passphrase in the same channel if the secret is high stakes—split the channels.",
          ],
        },
      ],
      midCta: {
        body: "Need to hand off a password or API key now? Encrypt it in the browser and send a link that can expire after reading.",
        button: "Create a private note",
        href: "app:home",
      },
    },
    {
      title: "Job: day-to-day messaging",
      paragraphs: [
        "Sensitive conversations need end-to-end encryption by default—not a toggle buried in settings, and not a promise that “disappearing messages” erase server-side copies you cannot verify.",
      ],
      subsections: [
        {
          title: "Default + trade-off",
          paragraphs: [
            "**Default:** [Signal](https://signal.org/) for mainstream secure chat. **Trade-off to name out loud:** registration requires a phone number, which some high-anonymity threat models reject. For those cases, look beyond this starter guide—and still treat metadata (who talks to whom) as a residual risk on every messenger.",
          ],
        },
        {
          title: "When not to use chat for secrets",
          paragraphs: [
            "Even encrypted messengers keep history on devices. Paste a production password into a thread and you have created a durable copy. Use chat for conversation; use one-time notes for credentials. More on that pattern: [secrets you should never send in chat](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Job: email and identity separation",
      paragraphs: [
        "Email is a public addressing system with private hopes. Treat inbox encryption and aliasing as damage control, not magic invisibility.",
      ],
      subsections: [
        {
          title: "Defaults",
          paragraphs: [
            "**Encrypted inbox default:** [Proton Mail](https://proton.me/) or [Tuta](https://tuta.com/) when you want zero-access mail for sensitive correspondence. **Aliasing default:** [Firefox Relay](https://relay.firefox.com/) for light masking, or [SimpleLogin](https://simplelogin.io/) when you need custom domains and sharper identity separation.",
          ],
        },
        {
          title: "When not to rely on email",
          paragraphs: [
            "Encrypted email still leaves headers, forwarding habits, and long retention. Never put active credentials in the body “just this once.” If the payload is a secret handoff, use a one-time note and put only context in the email.",
          ],
        },
      ],
    },
    {
      title: "Job: browse with less tracking",
      paragraphs: [
        "In 2026, the fight is less about “secret mode” and more about fingerprinting, cross-site tracking, and extensions that promise privacy while adding attack surface.",
      ],
      subsections: [
        {
          title: "Default stack",
          paragraphs: [
            "**Default:** [Firefox](https://www.mozilla.org/) with strict tracking protection plus [uBlock Origin](https://ublockorigin.com/). **Chromium-shaped alternative:** [Brave](https://brave.com/) if you need extension compatibility—know the community is split on its rewards/crypto surface. **Search:** [DuckDuckGo](https://duckduckgo.com/) (or similarly non-profiling search) so your queries are not an ad-profile feed.",
          ],
        },
        {
          title: "When Tor is the right upgrade",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) is the standard for stronger anonymity and censorship resistance. It is also slower and CAPTCHA-heavy. Use it when the threat model demands it—not as your everyday banking browser.",
          ],
        },
      ],
    },
    {
      title: "Job: untrusted networks (VPN reality check)",
      paragraphs: [
        "A VPN encrypts the path between you and the VPN provider. It hides your IP from the sites you visit. It does **not** make you anonymous, encrypt the destination’s logs, or fix a weak password.",
      ],
      subsections: [
        {
          title: "Defaults we are willing to name",
          paragraphs: [
            "Prefer providers with a public track record, clear jurisdiction story, and audited no-logs claims—commonly [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/), or [IVPN](https://www.ivpn.net/). Pay for the product; free VPN business models often are the product.",
          ],
        },
        {
          title: "When not to bother",
          paragraphs: [
            "On a network you already trust, with HTTPS everywhere, a VPN is optional hygiene—not a moral duty. Skip sketchy “military-grade” brands and anything that leads with influencer codes instead of engineering detail. Our directory’s exclusion notes cover common “privacy-washed” picks.",
          ],
        },
      ],
    },
    {
      title: "Job: breaches, 2FA, and passkeys",
      paragraphs: [
        "Account hygiene is the unglamorous half of privacy. Most personal disasters are credential stuffing and SIM-swap adjacent failures, not exotic malware.",
      ],
      subsections: [
        {
          title: "Practical defaults",
          paragraphs: [
            "Check addresses on [Have I Been Pwned](https://haveibeenpwned.com/). Turn on phishing-resistant factors where you can—passkeys or hardware keys such as [YubiKey](https://www.yubico.com/) beat SMS OTP. Use [2FA Directory](https://2fa.directory/) to see which services still treat second factors as optional theater.",
          ],
        },
        {
          title: "2026 note on passwordless",
          paragraphs: [
            "Passkeys reduce phishing and password reuse, but recovery and cross-ecosystem lock-in are real. Keep a recovery story (hardware key, documented process) before you delete every password. Password managers remain useful for the long tail of sites that have not caught up.",
          ],
        },
      ],
    },
    {
      title: "What changed in 2026 (commentary worth keeping)",
      bullets: [
        "**AI chat is a new archive.** Pasting secrets into assistants creates retention and training-risk questions your 2019 threat model never included. Treat prompts like email bodies.",
        "**Fingerprinting outpaced cookie banners.** Blocking third-party cookies helps; browser choice, tracker blocking, and fewer extensions still matter more than accepting every “legitimate interest” toggle.",
        "**Passkeys are mainstreaming.** Prefer them on high-value accounts; do not pretend every site supports them yet.",
        "**VPN marketing got louder, not wiser.** Jurisdiction theater and affiliate leaderboards are not audits. Pick boring, documented providers—or none.",
        "**Ephemeral sharing is still niche—and still necessary.** Collaboration apps optimized for search make one-time secret tools more valuable, not less.",
      ],
    },
    {
      title: "Minimal starter kit (most people)",
      paragraphs: [
        "If you only do seven things, do these. Everything else is optional depth.",
      ],
      useCaseTable: {
        headers: ["Slot", "Pick"],
        rows: [
          ["Password vault", "Bitwarden (or KeePassXC if you refuse cloud)"],
          ["Password creation", "Local generator—then store in the vault"],
          ["One-time secrets", "PrivateNote.ai (or equivalent browser-encrypted note)"],
          ["Private chat", "Signal"],
          ["Browser + blocker", "Firefox + uBlock Origin"],
          ["Breach / 2FA hygiene", "Have I Been Pwned + passkeys or app/hardware 2FA"],
          ["Travel / café Wi-Fi", "Mullvad, Proton VPN, or IVPN—when the network is the risk"],
        ],
      },
      callout:
        "Advanced add-ons (Tor daily driving, full-disk ritualism, anonymous email webs) are valid—but only after the starter kit is habitual.",
    },
    {
      title: "What we exclude—and why",
      paragraphs: [
        "Curation is mostly saying no. A few patterns we refuse to soft-pedal:",
      ],
      subsections: [
        {
          title: "Privacy-theater VPNs",
          paragraphs: [
            "Free tiers funded by vague data practices, fake “audit” badges, and leaderboard SEO. If the pitch is fear plus a discount code, walk away.",
          ],
        },
        {
          title: "Messengers that market encryption selectively",
          paragraphs: [
            "Default-cloud, optional-E2EE, or “secret chat” modes that train users to paste secrets into the unsafe default. We would rather recommend one honest default than five modes people misuse. Telegram-style clouds and WhatsApp’s metadata/backup realities are called out in our [directory exclusions](app:privacy-tools).",
          ],
        },
        {
          title: "Anything that needs to buy our recommendation",
          paragraphs: [
            "This guide and the directory are not an affiliate list. We make nothing if you click through. That does not make us omniscient—it means incentives are not quietly steering the shortlist.",
          ],
        },
      ],
    },
    {
      title: "Where to go next",
      paragraphs: [
        "Use this article as the decision layer. Use the directory as the living catalog—categories, nuances, and links we keep reviewed.",
      ],
      bullets: [
        "[Privacy tools directory](app:privacy-tools) — curated catalog by category",
        "[How to share a password securely](blog:how-to-share-a-password-securely) — handoff playbook",
        "[Send a secret without an account](blog:send-secret-message-without-account) — no shared app required",
        "[Security resources](app:security-resources) — broader reading on PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — policy and rights context",
        "[Privacy Guides](https://www.privacyguides.org/) — deeper community-maintained recommendations",
      ],
      midCta: {
        body: "Ready to browse the full shortlist with category notes and exclusions?",
        button: "Open the privacy tools directory",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Is this the same as your privacy tools directory?",
          answer:
            "No. This post is the 2026 how-to-choose guide. The [directory](app:privacy-tools) is the curated catalog. Read the guide to decide; use the directory to pick concrete tools.",
        },
        {
          question: "Can I rank-chase every privacy category?",
          answer:
            "You can, but you will not stick with it. A seven-slot starter kit you actually use beats a thirty-tool shrine you configure once.",
        },
        {
          question: "Where does PrivateNote.ai fit?",
          answer:
            "Only in the one-time secrets job—credentials and instructions that should expire. It is not a password manager, messenger, or VPN.",
        },
        {
          question: "Do I need a VPN every day?",
          answer:
            "Usually no. Use one on untrusted networks or when you specifically need to hide your IP from a destination. It is not a substitute for HTTPS, good passwords, or encrypted messengers.",
        },
        {
          question: "Open source or polished proprietary?",
          answer:
            "Prefer open source when the risk is high and you can live with the UX. Proprietary tools can be rational when usability determines whether your family adopts a vault at all—call the trade-off explicitly, as we do with 1Password.",
        },
      ],
    },
  ],
  ctaTitle: "Build the stack, then share secrets properly",
  ctaBody:
    "When the job is a temporary handoff, skip the chat archive. Create a browser-encrypted note, send the link, and let it expire when the moment is over.",
  ctaButton: "Create a private note",
  ctaSecondaryLabel: "Browse the privacy tools directory",
  ctaSecondaryHref: "app:privacy-tools",
};
