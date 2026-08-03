# Did Anthropic’s Mythos Break Cryptography? HAWK, AES, and the Real Result (draft source)

Proposed slug: `mythos-ai-cryptanalysis-hawk`

## Meta

- **Title:** Did Anthropic’s Mythos Break Cryptography? HAWK, AES, and the Real Result
- **Subtitle:** _(none — removed)_
- **Description:** Mythos helped produce a decisive attack on the HAWK signature candidate and a far smaller reduced-round AES result. Here is what changed—and what did not.
- **Category:** encryption · ai
- **Source reporting:** [Dan Goodin, Ars Technica (29 Jul 2026)](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/)
- **Expert commentary:** [Matthew Green](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/) (Johns Hopkins); Bart Preneel (KU Leuven); Sophie Schmieg (Google, via Ars Technica)

---

## Quick answer (TL;DR)

An Anthropic security model called Mythos helped find a fatal weakness in **HAWK**, a post-quantum digital signature scheme under NIST consideration—then the developer withdrew it. Separately, Mythos improved reduced-round attacks on AES (and other ciphers). Cryptographers including **Bart Preneel** call this a real research breakthrough that will change how cryptanalysis is done—and still say there is **no reason to panic**: widely used production crypto is not about to fall overnight.

---

## Why this story matters

Cryptography depends on adversarial review: researchers try to break algorithms before the rest of us rely on them. For decades that work was almost entirely human. [Ars Technica’s Dan Goodin](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/) reports that Anthropic’s Mythos model—still limited to a trusted preview group—helped advance attacks in ways that are worth watching, even with heavy caveats.

**Bart Preneel**, professor at KU Leuven and one of Europe’s best-known cryptographers, put the shift bluntly for anyone who still treats large language models as mere “statistical machines that produce beautifully crafted sentences”: without being “superintelligent,” new research shows they can make **substantial progress in cryptanalysis**—results that would otherwise take a smart researcher several months of hard work. He frames that as a breakthrough that fits a broader pattern: LLMs already advancing on serious math problems.

The practical takeaway for anyone who shares secrets or depends on encrypted apps: **standards processes and peer review still work**. HAWK was caught in evaluation, not after mass deployment. That is the system doing its job—with AI as a powerful new research teammate.

---

## What Mythos found

### HAWK: a NIST PQC candidate withdrawn

HAWK is a digital signature scheme meant to resist future quantum computers. Its security rests on the hardness of the Lattice Isomorphism Problem. It had passed two NIST PQC evaluation rounds and was in a third round specifically meant to catch deeper flaws.

According to Ars Technica’s summary of Anthropic’s results—and Preneel’s reading of the same announcement:

- An Anthropic researcher **without cryptography expertise** spent roughly **60 hours** and about **$100,000** in compute prompting Mythos to improve the best-known attack.
- Mythos produced a previously unknown method for finding **automorphism symmetries**—the kind of structure classical attacks already hunt for.
- The result effectively **cut HAWK’s key strength in half**. Preneel’s summary: the attack implies the **key size must be increased substantially** to hit the targeted security level.
- Doubling key size could mitigate the issue, but the extra cost made HAWK less competitive against established PQC signatures such as **ML-DSA** and **FN-DSA**.
- After Anthropic’s announcement, the **HAWK developer withdrew** the algorithm.

In academic cryptography, an algorithm is often treated as broken when an adversary can recover a key faster than brute force allows. That bar is what took HAWK out of contention.

Mythos reportedly worked semi-autonomously in an agentic harness: literature review, mathematical reasoning, experiments, then an end-to-end verification pipeline. Two agents initially disagreed; one rejected a method as unworkable until the second found a way to make it work, and they converged on a verified attack.

### AES, LEA, and Serpent: reduced-round improvements

Mythos also improved the best-known **meet-in-the-middle** attack against **AES-128 reduced from 10 to 7 rounds**—again a challenge / weakened instance, not production AES.

Key points from the [Ars Technica report](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/) and Preneel’s notes:

- The new attack still needs roughly **2^105 chosen-plaintext encryptions** under the target key.
- Its computational cost is about **2^89 cipher operations**.
- The **Möbius Bridge** is a modest constant-factor speedup on an already-impractical reduced-round attack. The 2^89 and 2^105 figures are two different costs (compute vs data), not a before-and-after.
- Real AES uses **10, 12, or 14** rounds depending on key size, so the real-world speedup is unknown.
- Preneel also highlights that Mythos found **other substantial improvements** for reduced-round attacks on the block ciphers **LEA** and **Serpent**.

Anthropic researchers and collaborators also released [CryptanalysisBench: Can LLMs do Cryptanalysis?](https://arxiv.org/abs/2607.18538) ([project site](https://cryptanalysis-bench.com/)), an arXiv benchmark for measuring whether language models can do cryptanalysis work in a structured way—further evidence that this is becoming a research field, not a one-off demo.

---

## What the experts said

### Bart Preneel (KU Leuven): breakthrough, not panic

Preneel’s LinkedIn analysis matches the Ars headline’s caution while sharpening what changed:

- **LLMs can do real cryptanalytic work**—not just fluent prose—at a level that compresses months of expert effort.
- Running these attacks costs on the order of **$100,000**, which he compares to roughly the cost of a **postdoctoral researcher for one year**—and therefore **outside the budget of most university departments**.
- Overall, this is a **very significant development**: the way cryptography and cryptanalysis are performed **will change**. In the coming years we can expect **hundreds of valuable research results** obtained with these tools.
- **There is no reason to panic.** It still does not seem likely that these models will overnight break all widely used cryptography.
- **Security margins will shrink faster than we expect**, and we may have to increase them. For **symmetric** cryptography, adding more rounds is a natural response. For **asymmetric** cryptology, more surprises may be ahead—without predicting a super-efficient algorithm that solves all lattice problems believed to be hard.
- On the positive side: the same tools should also help **build stronger designs**.
- The open institutional question: **who will have the access and budget** to find and verify these results? Only a happy few with the most advanced tools—or will the rest of the research community struggle to keep up?

That last point matters as much as the math. If AI cryptanalysis is real but expensive and gated, the bottleneck shifts from “can anyone find the attack?” to “who can afford to search—and who can afford to verify?”

### Matthew Green (Johns Hopkins)

Primary source: [Some thoughts about Anthropic’s new cryptanalysis results](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/) (29 July 2026).

Green stresses that the striking part was not brand-new math—it was recombination:

> “What’s particularly concerning (and so especially ripe for AI) is that the attack does not invent fundamentally new mathematics. It simply extends a bunch of tools that were lying around and well-known, and gets a good result.”

That framing pairs cleanly with Preneel’s: you do not need superintelligence to change the field—you need a system that can combine known tools at research scale. Green’s point explains *why* AI is ripe for this work; Preneel’s explains *what it means for the profession*.

### Sophie Schmieg (Google)

[Sophie Schmieg](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/), a post-quantum cryptography expert at Google, noted that HAWK was already suspected to have weaknesses waiting to be found. The Mythos-assisted attack that halved key strength made the candidate less competitive than ML-DSA and FN-DSA.

Her verdict, as reported by Ars Technica:

> “Basically with this paper, HAWK is dead.”

---

## Caveats you should keep front and center

Dan Goodin’s reporting is careful about what these results do *not* claim. Preneel’s “no reason to panic” line lands in the same place. Summarizing both:

1. **Incremental, not apocalyptic.** Nothing relied on by everyday users was broken in production form.
2. **Challenge / reduced-round instances.** Spec authors publish weakened versions for adversarial review. Real parameters (and full round counts) are stronger.
3. **Primitives still hold—for now.** The underlying mathematical problems were not shown to be generally dead. Preneel explicitly rejects assuming a universal lattice-breaking algorithm is around the corner.
4. **Lab-only practicality.** The AES-class attacks still require infeasible numbers of chosen plaintexts outside testing.
5. **Cost and access.** ~$100K per campaign is real research money—not a weekend hobby—and may concentrate capability among well-funded labs.
6. **Marketing vs. substance.** Anthropic has incentives to highlight AI cryptanalysis; weigh independent expert reaction (Green, Schmieg, Preneel) alongside company framing.
7. **Open question on “hard” classics.** Ars notes Anthropic did not report comparable wins against deeply studied systems like RSA or elliptic-curve crypto. The biggest splash was against a newer, less battle-tested candidate.

Bruce Schneier’s long-standing line still applies: attacks get better; they never get worse. Safety margins exist for exactly this reason—and Preneel’s advice is that those margins may need to grow faster than the community expected.

---

## What this means if you care about private sharing

For people who encrypt notes, files, and credentials day to day:

- **Continue trusting well-reviewed primitives** (for example AES with full rounds, and NIST-standardized PQC schemes that remain competitive after public scrutiny).
- **Treat “AI broke crypto” headlines as research news**, not an emergency key-rotation for every app you use—unless the announcement names **your** algorithm and **your** parameters.
- **Prefer designs with safety margin and peer review**—client-side encryption, short-lived sharing links, and algorithms that survive public cryptanalysis—over novelty for its own sake.
- **Expect AI to accelerate both attack and defense**, which is mostly good news for users: broken candidates die earlier, before they become infrastructure—and stronger designs get help too.

PrivateNote’s model—encrypt in the browser, keep plaintext off the server, expire or burn links—does not depend on HAWK. The lesson from this episode is upstream: choose crypto that has been attacked hard, publicly, for a long time—and expect the attack surface of *review* itself to speed up.

---

## Key takeaways

- Mythos helped find an attack that forced HAWK’s key size up (and the scheme out); the developer withdrew the PQC signature candidate.
- Bart Preneel: substantial progress in cryptanalysis, forever-changing research practice—and still no reason to panic about overnight breaks of widely used crypto.
- Matthew Green: HAWK is the meaningful result; AES is a small lab increment. Known tools, thoroughly applied; verifiability is the bottleneck; PQC transition timing is good news for users.
- Sophie Schmieg: with this paper, HAWK is dead relative to stronger PQC signature options like ML-DSA and FN-DSA.
- Reduced-round AES/LEA/Serpent results shrink safety margins in the lab; production AES with full rounds is not shown broken.
- Access and budget may decide who can find—and verify—the next wave of AI-assisted results.

---

## Sources and further reading

- Dan Goodin, *[Mythos attack on 3rd-round PQC algorithm candidate puts it out of commission](https://arstechnica.com/security/2026/07/mythos-uncovers-crypto-weaknesses-that-went-unknown-for-years/)*, Ars Technica, 29 July 2026 — primary reporting; includes commentary from **Sophie Schmieg** (Google).
- **Matthew Green**, *[Some thoughts about Anthropic’s new cryptanalysis results](https://blog.cryptographyengineering.com/2026/07/29/some-notes-about-anthropics-new-results/)*, A Few Thoughts on Cryptographic Engineering, 29 July 2026 — HAWK vs AES quality split, recombination of known tools, verifiability bottleneck, and PQC-transition timing.
- **Bart Preneel** (KU Leuven), LinkedIn commentary: *Large language models make substantial progress in cryptanalysis – but no reason to panic* (summary of Anthropic’s Mythos results, cost/access concerns, and margin advice).
- Anthropic’s announcement and associated HAWK / AES technical write-ups (linked from the Ars article).
- [CryptanalysisBench: Can LLMs do Cryptanalysis?](https://arxiv.org/abs/2607.18538) — arXiv:2607.18538; also [cryptanalysis-bench.com](https://cryptanalysis-bench.com/).
- Related PrivateNote reading: [What is end-to-end encryption?](/blog/what-is-end-to-end-encryption) · [Introduction to private AI](/blog/introduction-to-private-ai) · [European cryptographers on Chat Control](/blog/chat-control-europe-cryptographers)

---

## FAQ (for site chrome, if published)

**Did AI break the encryption people use every day?**  
No. HAWK was a NIST candidate under evaluation and was withdrawn. The AES work targeted reduced-round challenge instances, not full-round production AES. Preneel’s framing: breakthrough for research, not overnight collapse of widely used crypto.

**Is post-quantum cryptography itself dead?**  
No. Schmieg and others point to stronger, better-reviewed PQC signature schemes (such as ML-DSA and FN-DSA). Preneel expects more surprises in asymmetric crypto without predicting a universal lattice breaker.

**Why does Green’s post matter?**  
It is the best primary write-up of what the Mythos results do and do not mean: HAWK vs AES are different stories; the HAWK attack recombined known tools; runnable challenge-instance code is easy to verify while AES-style speedups are harder; and verification—not raw model fluency—is becoming the bottleneck.

**What does Preneel worry about most?**  
Not that AES dies tomorrow—but that security margins shrink faster, verification stays expensive (~$100K-scale campaigns), and access to the best tools may concentrate among a well-funded few while everyone else struggles to keep up.

**Should I change how I share secrets?**  
Keep using strong, reviewed crypto and ephemeral handoffs. Panic-switching away from AES or standard E2EE tools is not what this story supports.
