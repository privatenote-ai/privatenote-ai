/** English-only security guide copy (messenger, email, browser). */

export type StubGuideProvider = {
  name: string;
  tagline: string;
  description: string;
  link: string;
  highlights: string[];
};

export type StubGuideSection = {
  title: string;
  /** Optional lead paragraph before `paragraphs`. */
  content?: string;
  /** Multi-paragraph prose — the main body of each section. */
  paragraphs?: string[];
  bullets?: string[];
  providers?: StubGuideProvider[];
  callout?: { tone: "info" | "warning"; text: string };
  link?: string;
  linkText?: string;
  plain?: boolean;
};

export type StubGuideContent = {
  title: string;
  description: string;
  /** Personal opening note — cryptographer / builder voice. */
  authorNote: string;
  sections: StubGuideSection[];
};

export const stubSecurityGuides: Record<string, StubGuideContent> = {
  messenger: {
    title: "Secure Messaging Guide",
    description:
      "A practitioner's guide to messaging privacy: why the security community converges on Signal, where Telegram and Meta-owned apps fall short, and when no chat app is the right channel.",
    authorNote:
      "I build end-to-end encrypted tools for a living, and I still watch smart people paste API keys into Telegram groups. Messenger choice matters — but so does knowing what cryptography can and cannot fix. This is the advice I give colleagues, friends, and anyone who asks me at a conference dinner.",
    sections: [
      {
        title: "Why I keep coming back to messenger hygiene",
        paragraphs: [
          "Most people treat messaging like a utility: pick whatever your contacts already use and hope for the best. In security circles we are less relaxed. Not because we are paranoid for sport, but because **the threat model for chat is ugly** — cloud backups, contact graphs, device seizures, screenshot leaks, and apps that market “encryption” while leaving most traffic in the clear.",
          "I have sat in rooms where cryptographers argue for hours about key transparency, metadata minimization, and whether a protocol survives a compromised server. Those arguments rarely reach the App Store description. So this guide is my attempt to translate what the security community actually worries about into choices you can make on your phone today.",
          "One clarification up front: **a good messenger does not replace a purpose-built secret-sharing tool**. Even Signal is the wrong place for a wallet seed phrase or a production API key. Chats sync, forward, backup, and show up in notifications. I built PrivateNote because I wanted a channel designed to disappear after one read. But if you care about everyday conversation privacy, messenger selection is still one of the highest-leverage decisions you can make.",
        ],
      },
      {
        title: "What cryptographers look for (beyond the marketing slide)",
        content: "When researchers evaluate a messenger, we are not impressed by a lock icon. We ask:",
        bullets: [
          "Is end-to-end encryption the default for every conversation — not a buried “secret chat” mode?",
          "Can independent researchers audit the client, or at minimum the protocol design?",
          "What metadata does the operator still see — who talks to whom, when, from which IP?",
          "Does the business model depend on profiling users or their social graph?",
          "What happens with backups, multi-device sync, and cloud storage?",
        ],
        paragraphs: [
          "Get those wrong and you can have perfect ciphertext on the wire while still leaking the story of your life through metadata. Law enforcement, advertisers, and attackers do not always need to read your words if they can map your relationships reliably enough.",
        ],
      },
      {
        title: "Signal: the consensus pick — and why that is rare",
        paragraphs: [
          "Security people disagree about almost everything. VPNs, password managers, nation-state threat models, whether you should ever use SMS for 2FA. **Signal is the exception.** It is the app I recommend first, the app I use for sensitive threads, and the app I point family members toward when they ask a single question: “What should I install?”",
          "The reasons are boring and therefore convincing. Signal uses the Signal Protocol with default E2EE for direct and group chats. The nonprofit model is not an aesthetic choice — it means there is no ad profile to protect, no engagement funnel to optimize. Clients are open source. The team publishes serious security work, responds to research, and has survived years of hostile scrutiny.",
          "Signal is not magic. You still hand over a phone number at signup (though there are thoughtful mitigations). Your contact graph is smaller than Facebook’s but not zero. Physical access to an unlocked phone still beats cryptography. **But within the class “consumer messenger you can plausibly get your parents to install,” Signal is the reference implementation.**",
        ],
        providers: [
          {
            name: "Signal",
            tagline: "Gold-standard E2EE · nonprofit · open source",
            description:
              "Default E2EE, sealed sender, disappearing messages, and a track record of publishing and fixing real vulnerabilities instead of hand-waving them away.",
            link: "https://signal.org/",
            highlights: [
              "Default E2EE for 1:1 and group chats",
              "Sealed sender and minimal server metadata",
              "Disappearing messages and view-once media",
              "Open-source clients and independent audits",
            ],
          },
        ],
      },
      {
        title: "Telegram: fast, social, and widely misunderstood in crypto",
        paragraphs: [
          "Telegram is everywhere in trading groups, NFT Discords-that-moved-to-Telegram, and regional communities that need fast broadcast channels. I understand the appeal. I also watch crypto founders treat it like a hardware security module, and that makes me wince.",
          "Here is the technical reality people gloss over: **ordinary Telegram chats are not end-to-end encrypted.** They are encrypted client-to-server and server-to-client, which means Telegram’s infrastructure can read them. “Secret Chats” implement E2EE, but they do not sync across devices, do not work for most groups, and are not what people use when they paste a Bybit API key at 2 a.m.",
          "The crypto community’s skepticism is not snobbery. It is pattern recognition. Centralized operator, rich metadata, phone-number identity, cloud backups that expand recovery options for you and for anyone who compromises your account. Telegram can be a fine news channel. **It is a poor vault.**",
        ],
        bullets: [
          "Cloud chats are readable on Telegram servers — E2EE is opt-in and limited",
          "Phone-number identity ties your handle to a long-lived global identifier",
          "Contact graphs and activity metadata remain valuable even when message bodies are sealed",
          "Backups and multi-device sync increase convenience and attack surface together",
        ],
        callout: {
          tone: "warning",
          text: "My rule: Telegram for public coordination and memes; Signal for anything you would not want on a conference slide labeled “example of what not to do.” Seed phrases, exchange keys, and recovery codes belong in a one-time encrypted link — not any messenger.",
        },
      },
      {
        title: "WhatsApp and Messenger: real crypto, wrong incentives",
        paragraphs: [
          "WhatsApp deserves credit for deploying the Signal Protocol to a massive audience. Message contents between clients are E2EE in the ordinary sense, and that is not nothing. I have defended WhatsApp in conversations where people treat “Meta” as a cryptographic verdict instead of a business one.",
          "But I do not recommend WhatsApp or Messenger when someone asks me for a privacy default, and I am not alone in that. **E2EE protects payload; it does not erase the surveillance business sitting underneath.** Meta still learns an enormous amount from your social graph, device signals, usage patterns, and cross-app identity. WhatsApp cloud backups to Google Drive or iCloud are a recurring foot-gun: users restore convenience and accidentally restore a plaintext archive outside the E2EE story.",
          "Messenger is worse in practice because protected conversations are optional, fragmented, and rarely the default experience anyone actually lives in. Cryptographers are trained to ask what system users actually run, not what slide decks claim is possible.",
        ],
        bullets: [
          "Rich metadata and cross-platform profiling remain even when message bodies are encrypted",
          "WhatsApp backups can place conversation history back in cloud plaintext",
          "Messenger’s default mode is not E2EE — protected chats are easy to never enable",
          "Corporate incentives still reward identity resolution across apps and the web",
        ],
        callout: {
          tone: "warning",
          text: "If you already live on WhatsApp because your family does, I get it. Turn off cloud backups, tighten app lock, and keep high-stakes secrets out of the thread. For new sensitive relationships, start them on Signal.",
        },
      },
      {
        title: "What I tell people at dinner parties",
        paragraphs: [
          "Use Signal for private conversation. Treat Telegram like a fast bulletin board. Treat WhatsApp like a compromise you make for relatives, not like a security architecture. And **never confuse “encrypted chat” with “safe place for credentials.”**",
          "The security community is blunt about this because we have all seen the incident reports: the exchange API key in a group chat, the seed phrase in a “private” DM screenshot, the contractor forwarding a password on Slack because it was easier. Cryptography gives you a floor. Habits give you the ceiling.",
        ],
        link: "/",
        linkText: "Share one-time secrets with PrivateNote instead of chat",
        plain: true,
      },
    ],
  },
  email: {
    title: "Secure Email Guide",
    description:
      "Email was never designed for privacy. Notes from a builder on zero-access mail, why Proton is my default recommendation, and when even encrypted inboxes are the wrong channel.",
    authorNote:
      "Email is the protocol we cannot kill. Every product still ships password resets, invoices, and legal threats to an inbox. I have spent years explaining why SMTP metadata leaks even when the body is encrypted — and why the worst place for a secret is still the place everyone defaults to.",
    sections: [
      {
        title: "SMTP is a postcard with a filing cabinet attached",
        paragraphs: [
          "If you have only ever used Gmail, it is easy to think email is private because login requires a password. **Email was designed in an era of trusted universities and benign operators.** TLS protects bytes in motion between hops much of the time, but the storage model for mainstream providers still assumes the service can read your mail to index it, train models, scan for ads, and power “smart” features.",
          "I am not anti-cloud. I am anti-confusing “HTTPS on the login page” with “the provider cannot read my archive.” Gmail, Outlook, and Yahoo are excellent productivity products whose business models depend on deep visibility into your communications metadata — and often the content itself.",
          "Attackers love email for the same reason product teams do: it is permanent, searchable, forwardable, and synchronized across every device you have ever owned. Phishing, OAuth token theft, auto-forwarding rules, and mis-typed recipients are not edge cases. They are the baseline threat model.",
        ],
        bullets: [
          "Content indexing for search, fraud detection, and product features",
          "Long-lived OAuth grants to third-party apps",
          "Account recovery flows that attackers target before they touch your keys",
          "Forwarding rules that silently duplicate sensitive threads",
        ],
      },
      {
        title: "What “secure email” means to someone who reads RFCs",
        content: "Privacy-first email providers try to fix different parts of the stack:",
        bullets: [
          "Zero-access encryption at rest — the operator stores ciphertext, not a readable archive",
          "Optional true E2EE to other users (provider-native or PGP) so even a lawful request cannot turn up plaintext",
          "Jurisdiction and transparency reporting that match your threat model",
          "Open-source clients so researchers can verify what the app actually does",
          "Alias and hide-my-email features to reduce cross-site identity correlation",
        ],
        paragraphs: [
          "Notice what is still hard: **SMTP metadata.** Who emailed whom, when, subject lines, routing hops — much of that remains visible to the network even when the body is locked. Encrypted email raises the floor dramatically. It does not turn email into a dead-drop system.",
          "This is why I wrote that email is the worst place for secrets. Not because encryption is useless, but because email’s superpowers — permanence, universality, search — are exactly wrong for one-time credentials.",
        ],
      },
      {
        title: "Proton Mail: the provider I recommend first",
        paragraphs: [
          "When friends ask for a Gmail replacement they can trust with real correspondence — doctor’s offices, lawyers, financial paperwork — I point them at **Proton Mail** first. Swiss jurisdiction is not a cartoon privacy shield, but Proton has spent years publishing transparency reports, open-sourcing clients, and building an ecosystem (VPN, Drive, Pass) that hangs together without an ad profile underneath.",
          "Technically, the important bit is zero-access storage: Proton should not be able to hand over readable mail from disk because it should not possess the keys. Combine that with aliases, hardware-key login on paid tiers, and sensible mobile clients, and you have something I am comfortable recommending to non-technical family members.",
          "Tuta (formerly Tutanota) is my second suggestion when someone wants EU hosting and a focused product without US big-tech adjacency. I have colleagues in Germany who prefer it precisely because the stack is narrower — mail, calendar, contacts — and the privacy posture is loud without being performative.",
        ],
        providers: [
          {
            name: "Proton Mail",
            tagline: "Swiss privacy law · zero-access · Proton ecosystem",
            description:
              "My default recommendation for people leaving Gmail. Zero-access encryption, audited cryptography, and an ecosystem that does not fund itself by reading your inbox.",
            link: "https://proton.me/mail",
            highlights: [
              "Zero-access encryption by default",
              "Swiss jurisdiction and transparency reports",
              "Aliases, custom domains, and hardware-key support",
              "Open-source web client",
            ],
          },
          {
            name: "Tuta",
            tagline: "German GDPR host · encrypted calendar & contacts",
            description:
              "Strong EU-hosted alternative when you want encrypted mail, calendar, and contacts without a Silicon Valley conglomerate in the loop.",
            link: "https://tuta.com/",
            highlights: [
              "Encrypted mailbox, calendar, and contacts",
              "Germany-based infrastructure",
              "No third-party ad trackers in the web app",
              "Affordable custom-domain plans",
            ],
          },
        ],
      },
      {
        title: "Habits that matter more than the logo on the login page",
        paragraphs: [
          "Provider choice is step one. Step two is using email like someone who has seen breach notifications for a decade. I use unique aliases per service so a leak in one place does not correlate my identities. I turn on hardware security keys anywhere they are supported. I audit OAuth connections quarterly because “Sign in with Google” ages badly.",
          "Never put secrets in subject lines. Assume headers leak. Assume your recipient’s provider is worse than yours. Assume permanence: if you would not print it and mail it in an envelope labeled with both addresses, it does not belong in email.",
        ],
        callout: {
          tone: "info",
          text: "Encrypted email protects stored bodies, not the fact that you emailed your accountant at 11:58 p.m. For high-stakes credentials, use a one-time link that dies after reading — that is the workflow PrivateNote exists to support.",
        },
      },
      {
        title: "When I still refuse to use email",
        paragraphs: [
          "Passwords, API tokens, wallet seed phrases, production database URLs, legal hold material I do not want archived forever — **email is out.** Not because I distrust Proton. Because email is the wrong abstraction: it copies, it indexes, it forwards, it litigates.",
          "If you take one thing from this guide: upgrade your inbox, yes. But upgrade your instincts too. The channel should match the lifetime of the secret.",
        ],
        link: "/blog/why-email-is-worst-for-secrets",
        linkText: "Read why email is the worst place for secrets",
        plain: true,
      },
    ],
  },
  browser: {
    title: "Privacy Browsers Guide",
    description:
      "Your browser is the trust anchor for modern cryptography — and the biggest surface for tracking. Practitioner notes on Brave, Tor, Firefox, and why Chrome’s convenience tax is real.",
    authorNote:
      "Every web-based encryption scheme I work on ultimately trusts the browser to load the right code and keep keys where they belong. That is why browser choice is not a lifestyle preference — it is part of your security architecture, even if you never touch a command line.",
    sections: [
      {
        title: "The browser is your operating system now",
        paragraphs: [
          "Most people spend more time inside a browser than inside any app except messaging. That makes the browser a **high-value surveillance target**: cross-site trackers, fingerprinting, long-lived cookies, permission prompts you clicked once in 2019 and never revoked.",
          "In security research circles we repeat a uncomfortable truth: **your browser decides which JavaScript runs when you visit a site.** That matters for banking, it matters for webmail, and it matters enormously for any tool that encrypts client-side — including PrivateNote. A privacy-hostile browser does not break AES. It breaks the assumptions around AES.",
          "So I do not treat browser choice like picking a color theme. I treat it like picking a trust anchor.",
        ],
      },
      {
        title: "Features worth demanding (not buzzwords)",
        content: "When I evaluate a browser for daily use, I look for:",
        bullets: [
          "Tracker and ad blocking without relying on a patchwork of extensions",
          "Meaningful fingerprinting resistance, not cosmetic “anti-tracking” toggles",
          "HTTPS-Only or upgrade-by-default behavior",
          "Per-site permission controls that are easy to audit",
          "A credible answer to “who funds development and why?”",
        ],
        paragraphs: [
          "Extensions help, but they load after the browser core makes policy decisions. I prefer defaults that are privacy-preserving before I install uBlock Origin — though on Firefox I still install uBlock Origin.",
        ],
      },
      {
        title: "Brave: my pragmatic daily driver",
        paragraphs: [
          "I use **Brave** for ordinary browsing because it ships aggressive Shields without asking me to maintain a PhD in filter lists. Chromium compatibility means fewer “this site only works in Chrome” rituals, which sounds trivial until you are on a government portal at deadline hour.",
          "Brave is not purity cult software. It has attracted fair criticism over the years — BAT, search partnerships, whatever the current forum thread is angry about. I stay because **the default path is still more privacy-preserving than Chrome’s**, and because optional Tor windows are a nice escape hatch when I want isolation without launching the full Tor Browser bundle.",
        ],
        providers: [
          {
            name: "Brave",
            tagline: "Chromium speed · shields on by default",
            description:
              "The browser I recommend to friends who want “install one thing and stop being followed everywhere” without living in terminal configuration land.",
            link: "https://brave.com/",
            highlights: [
              "Brave Shields block trackers and ads by default",
              "Optional private Tor windows for isolated tabs",
              "Fingerprinting protections and strict cookie controls",
              "Built-in HTTPS upgrading",
            ],
          },
        ],
      },
      {
        title: "Tor Browser: when anonymity is the product",
        paragraphs: [
          "**Tor Browser** is slower, stricter, and occasionally CAPTCHA hell. I still keep it installed because there are sessions where hiding your origin IP and blending into a uniform fingerprint is not paranoia — it is the point.",
          "Researchers, journalists, activists, and anyone probing sensitive services should know Tor’s rules: do not log into personal Google inside the same profile; do not treat it like Chrome with a VPN sticker; accept that latency is the price of multi-hop routing designed to resist traffic analysis.",
          "The Tor Project’s threat model is one of the few that has been beaten on in public for years and survived with honest documentation. That matters more to me than a slick onboarding animation.",
        ],
        providers: [
          {
            name: "Tor Browser",
            tagline: "Maximum anonymity · onion routing",
            description:
              "Use when your threat model includes ISP-level observation, sensitive research, or visiting services that should not learn your home IP.",
            link: "https://www.torproject.org/",
            highlights: [
              "Multi-hop onion routing",
              "Uniform fingerprint against tracking",
              "No persistent history by default",
              "Documented threat model and open development",
            ],
          },
        ],
      },
      {
        title: "Firefox: the honorable open-source workhorse",
        paragraphs: [
          "Mozilla has taken real punches over the years. Firefox is still the browser I trust when I want **open source, nonprofit governance, and containers** that keep Facebook’s pixels in a cardboard box labeled “not today.”",
          "Firefox is not privacy-maxed out of the box. Enhanced Tracking Protection in Standard mode is a good start; Facebook Container and Multi-Account Containers are genuinely clever; uBlock Origin still belongs in your toolkit. I recommend Firefox to developers who want tweakability without feeding Google’s browser monoculture.",
        ],
        providers: [
          {
            name: "Firefox",
            tagline: "Open source · Enhanced Tracking Protection",
            description:
              "My pick for people who want a nonprofit-backed, extensible browser and are willing to spend twenty minutes on sensible hardening.",
            link: "https://www.mozilla.org/firefox/",
            highlights: [
              "Enhanced Tracking Protection enabled by default",
              "Facebook Container and Multi-Account Containers",
              "Strong extension ecosystem including uBlock Origin",
              "Open-source development with public roadmaps",
            ],
          },
        ],
      },
      {
        title: "How I split Tor and everything else",
        paragraphs: [
          "Practical split: Brave or hardened Firefox for email, banking, documentation, and the boring internet. Tor Browser for sessions where linking my home IP to the activity would be a mistake. Never the two shall meet in the same logged-in identity.",
          "Incognito mode is not a privacy strategy. It is a local history wipe. Your ISP, your employer’s proxy, and the site you visit still see the session. **Private windows do not make you private; they make you tidy.**",
        ],
        callout: {
          tone: "info",
          text: "If you must use Chrome or Edge for a legacy portal, use a separate profile, strict content blocking, and zero personal logins. Treat it like a contaminated workstation you visit on purpose.",
        },
      },
      {
        title: "Chrome, Edge, and the convenience tax",
        paragraphs: [
          "Google Chrome and Microsoft Edge are fast, polished, and deeply integrated with ecosystems that profit from knowing what you do. I use Chrome for testing compatibility, not for living. The security community’s critique is not that Chromium is poorly engineered — it is that **the default policies optimize for advertising and data collection**, and most users never touch the settings that would fight back.",
          "A hardened browser stops a lot of passive tracking. It does not stop you from pasting a password into Slack. Combine transport privacy with channel discipline.",
        ],
        callout: {
          tone: "warning",
          text: "Browser privacy protects your session. It does not encrypt a secret for your contractor. Pair a serious browser with a serious sharing tool when credentials are on the table.",
        },
      },
      {
        title: "The layer underneath the browser",
        paragraphs: [
          "Pick Brave, Firefox, or Tor for the right job. Block third-party cookies like you mean it. Then ask the next question: when you need to move a secret to another person, is the web page you are typing into designed to forget it?",
          "That is the problem I care about most. PrivateNote assumes hostile infrastructure and still keeps plaintext off the server. Your browser choice helps you get there safely. The sharing tool helps you not leave a permanent record when you arrive.",
        ],
        link: "/",
        linkText: "Create a one-time encrypted PrivateNote",
        plain: true,
      },
    ],
  },
};
