import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiEn: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Person working at a home desk with a laptop showing a neural-network visualization and a compact local AI server beside it",
  intro: [
    "**Private AI** means running a large language model on hardware you directly control—your laptop, your browser, or a server in your office—so your input text is never sent to a third-party cloud for inference. It is the practical answer to a simple question: *can I get high-quality help from AI without handing my words to someone else's computer?*",
    "That question matters more every year. Cloud assistants are remarkably powerful, but they process your prompts on remote infrastructure. For notes, credentials, legal drafts, health information, or anything you would not paste into a public chatbot, local and browser-side AI is no longer a hobbyist curiosity. It is a vital security requirement.",
    "This guide walks through how private AI evolved, why major labs publish model weights, the main ways people run models locally, the open-source projects and model families that matter most, where the state of the art stands in 2026—and how [PrivateNote](app:home) fits in with **Write with Private AI**, which runs entirely inside your browser tab.",
  ],
  sections: [
    {
      title: "A short evolution: from labs to your laptop",
      paragraphs: [
        "For years, useful language models lived almost exclusively inside tech giants with massive GPU clusters. Training required millions of dollars in compute, specialized teams, and proprietary datasets. If you wanted AI assistance, you used an API or a cloud web app—and your text left your machine.",
        "Three industry shifts changed that picture completely:",
      ],
      bullets: [
        "**Transformer scaling laws** — Research showed that well-trained models on large, high-quality datasets could deliver surprisingly general capabilities—not only at frontier scale.",
        "**Open-weight releases** — Starting with Meta's Llama family and followed by Mistral, Google Gemma, Alibaba Qwen, and others, downloadable parameters reached developers worldwide.",
        "**Inference tooling maturation** — Projects like llama.cpp, Ollama, vLLM, WebLLM, and Transformers.js made it practical to run those weights on consumer hardware.",
      ],
      callout:
        "By 2026, the gap between \"cloud-only\" and \"runs on my device\" has narrowed dramatically. Frontier cloud models are still larger and faster, but small and mid-size open models are highly capable at drafting, summarizing, rewriting, and answering everyday questions—especially for short-form writing like notes.",
    },
    {
      title: "Why companies publish model weights",
      paragraphs: [
        "Releasing weights is not charity. Labs publish parameters for strategic reasons that shape the entire ecosystem.",
      ],
      bullets: [
        "**Ecosystem leverage** — When developers build on your model, your architecture becomes a default. Fine-tunes, tools, and integrations follow the weights.",
        "**Research credibility** — Open weights invite scrutiny, reproducibility, and academic adoption. That visibility reinforces technical leadership.",
        "**Regulatory and trust positioning** — European players like Mistral and global brands like Meta and Google use open releases to signal transparency and differentiate from fully closed APIs.",
        "**Distillation and specialization** — Smaller models trained from larger ones spread capability downward. Publishing parent weights accelerates that pipeline across the community.",
        "**Competitive pressure** — Once one major lab open-releases a strong model, others face pressure to match or risk losing developer mindshare.",
      ],
      callout:
        "Open weights are not always \"open source\" in the strict sense. Licenses may restrict commercial use, require attribution, or exclude certain domains. Always read the model card before deploying in production.",
    },
    {
      title: "Three ways to deploy private AI",
      paragraphs: [
        "There is no single best architecture. The right choice depends on your hardware, privacy requirements, and whether you need a 70-billion-parameter generalist or a fast assistant for short notes.",
      ],
      beforeFlowSteps: "Most private-AI deployments land in one of these patterns:",
      flowDiagramCaption: "Three deployment patterns at a glance",
      flowSteps: [
        {
          step: "Option 1",
          title: "Local application environments (Ollama and desktop apps)",
          body: "Tools like [Ollama](https://ollama.com), LM Studio, and GPT4All download model weights and run them natively on your Mac, Windows, or Linux machine. You get offline inference, native GPU acceleration, and access to larger models than a browser can comfortably load. Trade-offs: significant disk space (often tens of gigabytes per model), dedicated RAM or VRAM, and manual updates.",
        },
        {
          step: "Option 2",
          title: "Sandbox environments (in-browser WebGPU)",
          body: "Modern browsers expose **WebGPU**, which lets JavaScript run neural networks on your GPU without installing anything. Projects like WebLLM, MLC LLM, and Transformers.js compile models for the web. You sacrifice model size and raw speed, but gain a remarkable property: **your prompt never leaves the browser tab for inference**. No account, no server round-trip, no provider logging your draft.",
        },
        {
          step: "Option 3",
          title: "Dedicated compute (home or office servers)",
          body: "Teams with dedicated NVIDIA GPUs, a Mac Studio, or a small rack server often run **vLLM**, **llama.cpp**, or Ollama as a shared internal endpoint. This is the pattern for maximum-quality private AI: large context windows, bigger models, and multiple users on a LAN. Trade-offs: hardware cost, power, cooling, and ongoing operational maintenance.",
        },
      ],
      afterFlowSteps: [
        "The through-line is the same in all three cases: **inference happens on infrastructure you control**, not on a multi-tenant cloud where your text becomes someone else's processing load.",
      ],
    },
    {
      title: "Open-source projects that matter most",
      paragraphs: [
        "Models are only half the story. These foundational projects turned raw weights into software millions of people can actually run.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — High-efficiency C/C++ inference; the foundation for countless local CPU and GPU deployments.",
        "**[Ollama](https://ollama.com)** — A friendly CLI and desktop experience for pulling, updating, and chatting with models locally.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — High-throughput batched serving for shared team GPU servers and API-scale workloads.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — The de facto library and hub for discovering, downloading, fine-tuning, and sharing models.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Compiles models for zero-install, browser-native execution via WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Runs ONNX-exported models directly in JavaScript—another path to browser-side inference.",
      ],
    },
    {
      title: "Model families worth knowing",
      paragraphs: [
        "Dozens of checkpoints appear every month. Four families dominate private-AI conversations in 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 and the newer Llama 4 lines set the benchmark for open-weight generalists: strong reasoning, broad tooling support, and a huge fine-tune ecosystem.",
        "**Google Gemma** — The Gemma 2, Gemma 3, and **Gemma 4** families focus on efficiency—strong performance per parameter, excellent small models, and variants tuned for on-device and hosted inference.",
        "**Mistral AI (Europe)** — Paris-based Mistral ships compact, capable models (Mistral, Mixtral, Codestral) with developer-friendly licenses and a distinctly European data-sovereignty narrative.",
        "**Alibaba Qwen** — The Qwen 2.5 and **Qwen 3** series excel at multilingual tasks and ship tiny variants (sub‑1B parameters) that run exceptionally well on modest laptop and browser hardware.",
      ],
      callout:
        "PrivateNote's browser AI uses **Gemma 2 2B** and **Qwen3 0.6B** via WebLLM—open-weight models compiled for WebGPU, not a proprietary closed checkpoint. Larger **Gemma 4** variants appear in the optional Cloud Assist path, not in Write with Private AI today.",
    },
    {
      title: "State of the art in 2026",
      paragraphs: [
        "The frontier is split. Closed APIs from OpenAI, Anthropic, and Google still lead on raw capability, tool use at scale, and the largest context windows. But open weights are close enough for many real workflows—and ahead on **privacy, cost control, and customization**.",
        "Among open models, **Gemma 4**, **Llama 4**, **Qwen 3**, and large **Mistral** checkpoints represent the current generation: better instruction-following, improved coding and math, and more reliable refusals on sensitive prompts. Smaller distilled variants bring a meaningful slice of that quality to laptops and browsers.",
        "Multimodal models (text + image) are expanding in both cloud and open releases, but for note-taking and secret handoffs, text-only small models remain the sweet spot: fast enough to feel interactive, small enough to stay local.",
      ],
    },
    {
      title: "Private AI in PrivateNote: Write with Private AI",
      paragraphs: [
        "PrivateNote is built for encrypted, ephemeral notes—not for replacing your entire AI stack. Still, drafting a sensitive message is exactly where browser-side AI shines: you get writing help **before** encryption, without sending your text to our servers for inference.",
        "Open [PrivateNote](app:home) and choose **Write with Private AI**. There is no manual model picker—on supported desktops with WebGPU, your device tier decides which checkpoint runs:",
        "Be honest about the trade-offs. Weights download into browser storage and inference runs locally—but browser AI is **slower** than a cloud datacenter and cannot match the **large context windows** of server-class models. It is also hardware-dependent: many phones and older laptops fall back to typing without AI or to optional Cloud Assist. But for drafting a short private note, a password handoff message, or a confidential reply, it is **quite capable**—and the privacy properties are fundamentally different from paste-into-ChatGPT workflows.",
      ],
      bullets: [
        "**Modest hardware** — Loads **Qwen3 0.6B** and runs inference locally via WebGPU.",
        "**Capable desktops** — Loads **Gemma 2 2B** and runs inference locally via WebGPU.",
        "**Private by architecture** — With Write with Private AI, your draft is processed in the browser. It is not sent to PrivateNote servers for model inference.",
        "**Encrypt after drafting** — Once you are happy with the text, the note is encrypted locally before upload—same model as every other PrivateNote.",
        "**Optional Cloud Assist** — If your device cannot run local models, you may opt into Cloud Assist (Google **Gemma 4 26B** via Cloudflare Workers AI). That path is faster and more capable, but **not fully private**—your prompt leaves the device in plaintext and you must enable it explicitly. See [how PrivateNote works](app:how-it-works) for the full comparison.",
        "**Right tool for the job** — Use browser Private AI for sensitive drafts. Use Ollama or a home GPU server when you need long documents, huge context, or the largest open models.",
      ],
      callout:
        "Private AI in the browser is not trying to beat frontier cloud models on benchmarks. It is trying to make **private drafting practical** for the notes people already create in PrivateNote.",
    },
    {
      title: "Choosing your private-AI setup",
      paragraphs: [
        "If you are new to private AI, start simple: install Ollama and try a mid-size Llama or Gemma checkpoint for everyday writing on your laptop.",
        "If your threat model requires that drafts never leave the device—even before encryption—use browser-side tools, including Write with Private AI inside PrivateNote. Data sovereignty and intelligent automation no longer contradict each other; you simply match the sensitivity of the text to the architecture running it.",
        "If you are securing a team, evaluate a shared GPU server with vLLM and access controls—and read [securing AI agents like employees](blog:securing-ai-agents-like-employees) for how agentic systems change the trust boundary. For developers wiring agents into workflows, see [PrivateNote for developers](blog:privatenote-for-developers) and the [Codex MCP integration](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Try private drafting in your browser",
  closingBody: [
    "Open PrivateNote, select Write with Private AI, and draft your next sensitive note without sending it to an external cloud model. Encrypt it when you are ready—then share a secure, one-time link.",
  ],
  fileSharingNote:
    "Sharing files too? [Secure file transfer](app:secure-file-transfer) uses the same browser-side encryption. Sending requires a free account; recipients open links without signing up.",
  tagline: "Draft locally. Encrypt first. Share a link.",
  relatedReading: "Related reading",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb: "As AI agents gain tools and memory, security must govern the whole system—not just the model.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Share secrets from VS Code, Cursor, or an AI agent without pasting into chat history.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb: "Encrypt before upload, share a link, and let the note expire—step by step.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb: "Who holds the keys, and why browser encryption differs from HTTPS alone.",
    },
    {
      slug: "privacy-tools",
      blurb: "Practical privacy tools beyond better habits alone.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Why ephemeral notes beat permanent chat logs for sensitive workplace messages.",
    },
  ],
};
