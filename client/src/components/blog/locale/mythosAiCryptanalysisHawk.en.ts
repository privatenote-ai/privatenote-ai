import type { MythosAiCryptanalysisHawkArticleCopy } from "./mythosAiCryptanalysisHawk.types";

export const mythosAiCryptanalysisHawkEn: MythosAiCryptanalysisHawkArticleCopy = {
  heroAlt:
    "AI researcher at a multi-monitor lab workstation analyzing abstract cryptographic patterns and a broken cipher visualization",
  heroCaption:
    "AI-assisted cryptanalysis is getting real results in the lab—without overnight collapse of the crypto people actually use.",
  intro: [
    "Anthropic’s unreleased Mythos model helped develop a key-recovery attack against **HAWK**, a post-quantum signature candidate in NIST’s evaluation process. The HAWK team then asked NIST to withdraw the scheme. Separately, Mythos produced a smaller improvement to an attack on reduced-round AES.",
    "Those results belong in the same announcement, but not in the same headline. The HAWK attack materially changed a standards decision; the AES result is an impractical research increment. Neither result breaks the encryption people use every day.",
  ],
  sections: [
    {
      title: "Why this story matters",
      takeaway: "Standards review still works—HAWK died in evaluation, not after mass deployment.",
      paragraphs: [
        "Cryptography depends on adversarial review: researchers try to break algorithms before the rest of us rely on them. Anthropic’s [research account](https://www.anthropic.com/research/discovering-cryptographic-weaknesses) says Mythos worked through literature, proposed approaches, ran experiments, and iterated with researchers. Because that is a company account of its own unreleased model, the technical papers and independent expert analysis matter more than the marketing frame.",
        "**Bart Preneel**, professor at KU Leuven and one of Europe’s best-known cryptographers, put the shift bluntly for anyone who still treats large language models as mere “statistical machines that produce beautifully crafted sentences”: without being “superintelligent,” new research shows they can make **substantial progress in cryptanalysis**—results that would otherwise take a smart researcher several months of hard work.",
        "Johns Hopkins cryptographer [Matthew Green](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/) reaches a similar destination by a sharper route: the two Mythos results are **very different in quality**. HAWK is the meaningful one. The AES work is real science—and much less exciting for anyone who heard “attack on AES” and panicked.",
        "The practical takeaway for anyone who shares secrets or depends on encrypted apps: **standards processes and peer review still work**. HAWK was caught in evaluation, not after mass deployment. That is the system doing its job—with AI as a powerful new research teammate.",
      ],
    },
    {
      title: "What Mythos found on HAWK",
      takeaway: "The attack sharply reduced HAWK’s estimated security; its team requested withdrawal.",
      paragraphs: [
        "HAWK is a proposed post-quantum signature scheme based on the module Lattice Isomorphism Problem. It is **not** a deployed or standards-adopted algorithm. In [his write-up](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/), Green notes it is related to **Falcon**, which is being standardized—but the Mythos attack **does not transfer** to Falcon, which rests on a different hard problem. HAWK had still gone far enough in NIST evaluation that an effective attack mattered.",
        "The attack remains exponential-time, but the [HAWK paper](https://www-cdn.anthropic.com/e8d50c167ad47beeb03d6109a4a484be95cb38ea/hawk_key_recovery.pdf) lowers the estimated key-recovery cost for HAWK-512 from about **2^150 to 2^108** gates, and for HAWK-1024 from **2^288 to 2^182**. Saying it “halves security” is a useful intuition, not a literal description of every parameter set. Larger parameters could restore a target security level, but at the cost of the efficiency that made HAWK attractive. The HAWK team subsequently **requested withdrawal** from NIST’s additional-signature competition.",
        "The most convincing validation is executable: the authors recovered a **HAWK-256 challenge key** in a few hours on one server. That challenge uses weaker parameters than any proposed deployment, so it is evidence that the attack works—not evidence that deployed keys can be recovered in hours. Anthropic reports that one researcher, who was not a cryptography specialist, spent roughly **60 hours** and about **$100,000 in API usage** steering the effort. Those figures describe this campaign, not a general price tag for AI cryptanalysis.",
      ],
    },
    {
      title: "AES, LEA, and Serpent: less drama, still notable",
      takeaway: "A modest lab speedup on 7-round AES—not a break of production AES.",
      paragraphs: [
        "Green’s blunt framing is useful here: most people hear “attack on AES” and panic, but this is the Mythos result that is **much, much less interesting**. Full AES (10, 12, or 14 rounds depending on key size) has withstood public cryptanalysis since 2001—including substantial non-public testing. Researchers normally attack **reduced-round** variants, and Mythos improved a **7-round** instance. Attacks on 7-round AES are not new; Green describes the Mythos work as a **modest constant-factor improvement** on prior results from **2013**—interesting as technique, not a practical break.",
        "The [AES paper](https://www-cdn.anthropic.com/c88771e1bf5ee8885349eed05e5484c0e5f7e02b/aes_mobius_bridge.pdf) reports a meet-in-the-middle technique called the **Möbius Bridge**. Green’s reality check is decisive: the attack still needs about **2^89 cipher operations** and roughly **2^105 chosen-plaintext encryptions** under the target key. Those are two different costs—compute and data—not a before-and-after. Neither is remotely practical. The claimed gain is a modest constant-factor speedup on an already-impractical reduced-round attack, and because the full computation cannot be run, parts of that gain remain an **on-paper analysis** rather than an end-to-end demonstration.",
        "Real AES remains intact. Preneel notes substantial reduced-round improvements on **LEA** and **Serpent** as well. Anthropic researchers and collaborators released [CryptanalysisBench: Can LLMs do Cryptanalysis?](https://arxiv.org/abs/2607.18538) to measure this work more systematically ([project site](https://cryptanalysis-bench.com/)).",
      ],
    },
    {
      title: "Bart Preneel: breakthrough, not panic",
      takeaway: "Research practice will change; overnight collapse of widely used crypto still looks unlikely.",
      paragraphs: [
        "Preneel’s LinkedIn analysis matches the Ars headline’s caution while sharpening what changed:",
      ],
      bullets: [
        "LLMs can do real cryptanalytic work—not just fluent prose—at a level that compresses months of expert effort.",
        "Running these attacks costs on the order of **$100,000**—roughly a postdoc for a year—and is outside most university budgets.",
        "The way cryptography and cryptanalysis are performed **will change**; expect hundreds of valuable research results from these tools.",
        "**There is no reason to panic.** Overnight breaks of all widely used cryptography still look unlikely.",
        "Security margins will shrink faster than we expect. For symmetric crypto, adding more rounds is a natural response; for asymmetric crypto, more surprises may be ahead—without predicting a universal lattice breaker.",
        "The same tools should also help **build stronger designs**.",
        "Open question: who will have the access and budget to find—and verify—these results?",
      ],
    },
    {
      title: "Matthew Green: recombination, verification, and timing",
      takeaway: "Known tools, thoroughly applied; verifying lookalike “results” is now the bottleneck.",
      paragraphs: [
        "In [Some thoughts about Anthropic’s new cryptanalysis results](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/), Green walks through both Mythos papers and what they do—and do not—imply. His headline concern on HAWK is not exotic new math:",
      ],
      calloutTitle: "Matthew Green",
      callout:
        "The HAWK attack’s importance is not exotic new mathematics. It is the model’s thorough synthesis and extension of known tools into a verifiable result.",
      paragraphsAfterCallout: [
        "He adds that Claude’s own gloss cut even sharper: none of the ingredients are exotic—someone (or something) simply did a much more thorough job applying known tools. That is exactly the work attack AIs excel at. Green also notes that Anthropic’s process looked less like a carefully tuned expert lab and more like **strapping the model’s nose to the grindstone** with surprisingly plain prompts until it found something.",
        "The harder problem, in his view, is what comes after the model speaks. **Verifiability is now the bottleneck.** Systems that can produce real results are even better at producing results that **look** real but are wrong. HAWK-style attacks that recover keys on a challenge instance in a few hours are easy to check—you can run the code. Subtle AES-style speedups are not. Lean proofs help, but humans still have to confirm that the theorem was stated correctly. That review step will slow how fast the field can absorb AI-generated cryptanalysis.",
        "For everyday users, Green draws a useful split without turning it into a checklist. **Symmetric ciphers** are deliberately messy—he likens the design style to dragging a tractor into quicksand and burying it under cement—so raw intelligence-hours alone are unlikely to magically untangle AES. **Public-key cryptography** is narrower: only a handful of hard problems (RSA, discrete log / ECC, lattices, coding theory), and even older ones have never had **enough** human attention that we can be sure nothing remains. Lattices and code-based crypto leave especially fertile ground for AI.",
        "His good news is about timing. We are already mid-migration from RSA/ECC to **post-quantum** candidates. If there was ever a moment for a surge in public cryptanalysis capacity, **this is it**—unless AI somehow undermines every hard problem at once. In the best case, weaker candidates die earlier and the literature gets stronger.",
        "Green’s closing caution cuts both ways: stop calling frontier models “glorified autocomplete,” and stop calling them AGI. Capability rises fast, then drops off sharply past a moving line—like a pond where the ground suddenly falls away under your feet.",
        "[Sophie Schmieg](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/), a post-quantum cryptography expert at Google, noted that HAWK was already suspected to have weaknesses waiting to be found. The Mythos-assisted attack made the candidate less competitive than ML-DSA and FN-DSA. Her verdict, as reported by Ars Technica:",
        "> “Basically with this paper, HAWK is dead.”",
      ],
    },
    {
      title: "Caveats to keep front and center",
      takeaway: "Incremental lab progress is not an emergency key-rotation for every app you use.",
      paragraphs: [
        "Bruce Schneier’s line still applies: attacks get better; they never get worse. Safety margins exist for exactly this reason—and Preneel’s advice is that those margins may need to grow faster than the community expected.",
        "Nothing relied on by everyday users was broken in production form. HAWK was a candidate under evaluation, related to Falcon but resting on a different hard problem, so the Mythos attack does not transfer. The AES work remains a small lab increment on a reduced-round challenge instance—not full-round AES—and still requires infeasible numbers of chosen plaintexts outside testing. Spec authors publish weakened versions precisely so this kind of adversarial review can happen.",
        "The scarcer resource is becoming **verification**. Lookalike “results” need human review, especially when the claimed speedup cannot be executed end to end. This campaign’s roughly **$100,000 in API usage** also raises an access question for less well-funded researchers. Separately, Anthropic did not report comparable wins against deeply studied systems like RSA or elliptic-curve crypto—an open question, not a reassurance that those problems are forever safe.",
      ],
    },
    {
      title: "What this means for private sharing",
      takeaway: "Keep trusting well-reviewed primitives; treat “AI broke crypto” headlines as research news.",
      paragraphs: [
        "Continue trusting well-reviewed primitives—full-round AES, and NIST-standardized PQC schemes that remain competitive after public scrutiny. Treat dramatic headlines as research news, not an emergency rotation for every app—unless the announcement names **your** algorithm and **your** parameters.",
        "Prefer designs with safety margin and peer review: [client-side encryption](blog:what-is-end-to-end-encryption), short-lived sharing links, and algorithms that survive public cryptanalysis. Expect AI to accelerate both attack and defense—which is mostly good news for users: broken candidates die earlier, before they become infrastructure.",
        "PrivateNote’s model—encrypt in the browser, keep plaintext off the server, expire or burn links—does not depend on HAWK. The lesson is upstream: choose crypto that has been attacked hard, publicly, for a long time. For more on private AI tooling, see [introduction to private AI](blog:introduction-to-private-ai).",
      ],
    },
    {
      title: "Primary sources",
      takeaway: "Read the attack papers separately; their evidence and practical significance differ.",
      bullets: [
        "[HAWK-n Key Recovery Reduces to SVP in Dimension n/2 + 1](https://www-cdn.anthropic.com/e8d50c167ad47beeb03d6109a4a484be95cb38ea/hawk_key_recovery.pdf) — the executable HAWK key-recovery result.",
        "[New Meet-in-the-Middle Attacks on Reduced-Round AES](https://www-cdn.anthropic.com/c88771e1bf5ee8885349eed05e5484c0e5f7e02b/aes_mobius_bridge.pdf) — the Möbius Bridge analysis.",
        "[Discovering cryptographic weaknesses with Claude](https://www.anthropic.com/research/discovering-cryptographic-weaknesses) — Anthropic’s account of the research process.",
        "[Matthew Green’s independent analysis](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/) — a clear comparison of the two results and the verification problem.",
        "[Dan Goodin, Ars Technica](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/) — primary reporting on the Mythos findings, including Sophie Schmieg’s commentary.",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Did AI break the encryption people use every day?",
          answer:
            "No. HAWK was a NIST candidate under evaluation and was withdrawn. The AES work targeted reduced-round challenge instances, not full-round production AES. Green calls the AES result a small scientific increment; Preneel frames the overall story as breakthrough for research, not overnight collapse of widely used crypto.",
        },
        {
          question: "Is post-quantum cryptography itself dead?",
          answer:
            "No. Schmieg and others point to stronger, better-reviewed PQC signature schemes such as ML-DSA and FN-DSA. Green argues this is actually a good moment for AI cryptanalysis: we are already switching public-key primitives, so weaker candidates can fail before they become infrastructure.",
        },
        {
          question: "What does Matthew Green emphasize that headlines miss?",
          answer:
            "That HAWK and AES are different stories. The HAWK attack mattered because it recombined known tools rather than inventing exotic math, and because runnable challenge-instance code made the claim easy to check. AES-style speedups are harder to trust on paper alone—so verification, not raw model fluency, is becoming the bottleneck.",
        },
        {
          question: "What does Preneel worry about most?",
          answer:
            "Not that AES dies tomorrow—but that security margins shrink faster, verification stays expensive (~$100K-scale campaigns), and access to the best tools may concentrate among a well-funded few while everyone else struggles to keep up.",
        },
        {
          question: "Should I change how I share secrets?",
          answer:
            "Keep using strong, reviewed crypto and ephemeral handoffs. Panic-switching away from AES or standard E2EE tools is not what this story supports.",
        },
      ],
    },
  ],
  ctaTitle: "Research moves faster. Your sharing habits can still be simple.",
  ctaBody:
    "Prefer crypto that has survived public review—and handoffs that expire when the job is done. PrivateNote encrypts notes and files in the browser with short-lived, one-time links.",
  ctaButton: "Create a private note",
};
