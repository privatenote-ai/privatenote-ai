import React from "react";
import { Link } from "wouter";
import {
  Check,
  Lock,
  PenLine,
  Share2,
  Sparkles,
} from "lucide-react";

export default function HowItWorks() {
  const flowSteps = [
    {
      title: "Write",
      detail: "Compose your note in the browser — nothing is stored yet.",
      icon: <PenLine className="h-5 w-5" />,
    },
    {
      title: "Encrypt",
      detail: "Your device encrypts the note before it leaves your screen and lands encrypted on our server.",
      icon: <Lock className="h-5 w-5" />,
    },
    {
      title: "Share",
      detail: "Send the link. The note disappears after it’s read or expires.",
      icon: <Share2 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-24 pb-20 mb-20 relative">
      {/* Reduced background glows (less noise) */}
      <div className="absolute top-[-80px] right-1/4 w-80 h-80 bg-primary/10 blur-[130px] -z-10" />
      <div className="absolute bottom-[120px] left-1/4 w-56 h-56 bg-blue-500/10 blur-[120px] -z-10" />

      {/* Hero Header (slightly tighter) */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="page-title mb-10 pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 relative z-10">
          Security by <span className="text-primary italic">Design.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          Choose absolute privacy with Standard mode, or enable AI Assist for optional productivity.
        </p>
      </div>

      {/* Tighter vertical rhythm overall */}
      <div className="space-y-16">
        <section className="py-6 mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                A simple privacy flow you can trust.
              </h2>
              <p className="mt-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                Clear steps, no hidden data collection.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {flowSteps.map((step) => (
              <div key={step.title} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    {step.icon}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* Infrastructure & Manual Reveal */}
        <section className="space-y-20 pt-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl md:w-1/2">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Infrastructure
              </h2>
              <p className="max-w-xl text-base text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                Utilizing Cloudflare&apos;s edge (Workers, KV, Durable Objects) to reduce latency and improve availability.
              </p>

              <div className="space-y-3">
                {[
                  "Notes stored as encrypted ciphertext",
                  "Minimized data collection & short retention",
                  "Future: EU-only storage (Premium feature)",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300"
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center md:justify-end md:w-1/2">
              <div className="relative">
                <svg
                  className="h-56 w-96 md:h-60 md:w-[28rem]"
                  viewBox="0 0 360 200"
                  fill="none"
                  role="img"
                  aria-label="Robust infrastructure illustration"
                >
                  <g id="servers">
                    <rect
                      x="100"
                      y="80"
                      width="45"
                      height="70"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect x="110" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="110" y="102" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="110" y="112" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="113" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="122" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="132" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />

                    <rect
                      x="157"
                      y="50"
                      width="45"
                      height="100"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect x="167" y="62" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="167" y="72" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="167" y="82" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="167" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="170" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="179" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="189" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="170" cy="125" r="3" fill="hsl(var(--primary))" />
                    <circle cx="179" cy="125" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="189" cy="125" r="3" fill="hsl(var(--primary))" opacity="0.5" />

                    <rect
                      x="214"
                      y="80"
                      width="45"
                      height="70"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect x="224" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="224" y="102" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="224" y="112" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="227" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="236" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="246" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="flex justify-center md:order-1 md:justify-start md:w-1/2 md:-mt-6">
              <svg
                className="h-56 w-96 md:h-60 md:w-[28rem]"
                viewBox="0 0 360 200"
                fill="none"
                role="img"
                aria-label="Manual reveal protection from link preview bots"
              >
                <g id="note">
                  <rect
                    x="130"
                    y="60"
                    width="100"
                    height="80"
                    rx="8"
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                  />
                  <rect x="145" y="80" width="70" height="4" rx="2" fill="hsl(var(--border))" />
                  <rect x="145" y="92" width="60" height="4" rx="2" fill="hsl(var(--border))" opacity="0.7" />
                  <rect x="145" y="104" width="65" height="4" rx="2" fill="hsl(var(--border))" opacity="0.7" />
                </g>

                <g id="bot">
                  <rect
                    x="80"
                    y="140"
                    width="40"
                    height="40"
                    rx="8"
                    fill="hsl(var(--primary))"
                    opacity="0.14"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <circle cx="90" cy="153" r="4" fill="hsl(var(--primary))" />
                  <circle cx="110" cy="153" r="4" fill="hsl(var(--primary))" />
                  <line
                    x1="100"
                    y1="140"
                    x2="100"
                    y2="128"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="125" r="3" fill="hsl(var(--primary))" />
                  <line
                    x1="120"
                    y1="150"
                    x2="145"
                    y2="110"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                </g>

                <g id="blocked">
                  <line
                    x1="195"
                    y1="95"
                    x2="215"
                    y2="115"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="215"
                    y1="95"
                    x2="195"
                    y2="115"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>

            <div className="mt-10max-w-2xl md:order-2 md:w-1/2">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Manual Reveal
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                Link preview bots in apps like Slack or iMessage can accidentally “read” a one-time note before your recipient sees it.
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 italic leading-relaxed">
                “Our manual reveal step forces human interaction, ensuring only the intended recipient consumes the note.”
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl md:w-1/2">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                AI Assist (on your device)
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                If you turn on AI Assist, the note is decrypted only in your browser so a local model (WebLLM) can run the action you chose. Plaintext for that step stays on your device; our Worker never receives your note content for AI processing.
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                The model and weights may download from public CDNs or repos configured for WebLLM—separate from your encrypted note payload. Results are merged into your draft locally before anything is encrypted again for upload.
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 italic leading-relaxed">
                AI Assist still increases exposure versus Standard mode while the model runs (memory, downloads, and browser environment). Use it only when that trade-off is acceptable.
              </p>
            </div>

            <div className="flex justify-center md:justify-end md:w-1/2">
              <svg
                className="h-56 w-96 md:h-60 md:w-[28rem]"
                viewBox="0 0 360 200"
                fill="none"
                role="img"
                aria-label="AI processing illustration with secure chip"
              >
                <g id="chip">
                  <rect
                    x="130"
                    y="55"
                    width="100"
                    height="90"
                    rx="12"
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                  />
                  <rect x="150" y="75" width="60" height="6" rx="3" fill="hsl(var(--primary))" />
                  <rect x="150" y="88" width="60" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.7" />
                  <rect x="150" y="101" width="60" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.5" />
                  <circle cx="160" cy="122" r="4" fill="hsl(var(--primary))" />
                  <circle cx="178" cy="122" r="4" fill="hsl(var(--primary))" opacity="0.7" />
                  <circle cx="196" cy="122" r="4" fill="hsl(var(--primary))" opacity="0.5" />
                </g>

                <g id="pins" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                  <line x1="120" y1="70" x2="110" y2="70" />
                  <line x1="120" y1="90" x2="108" y2="90" />
                  <line x1="120" y1="110" x2="110" y2="110" />
                  <line x1="240" y1="70" x2="250" y2="70" />
                  <line x1="240" y1="90" x2="252" y2="90" />
                  <line x1="240" y1="110" x2="250" y2="110" />
                </g>

                <g id="spark">
                  <circle cx="265" cy="55" r="10" fill="hsl(var(--primary))" opacity="0.12" />
                  <path
                    d="M265 44 L268 53 L277 56 L268 59 L265 68 L262 59 L253 56 L262 53 Z"
                    fill="hsl(var(--primary))"
                    opacity="0.6"
                  />
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* Call to Action (slightly tighter, less tall) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[2.5rem] bg-primary text-white relative overflow-hidden group">
          <Sparkles className="absolute -right-10 -top-10 h-56 w-56 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-2">Ready to secure your data?</h3>
            <p className="text-primary-foreground/80 font-medium">
              Fast, ephemeral, and legally compliant.
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link
              href="/"
              className="px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
