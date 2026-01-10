import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Server,
  Globe,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code,
  Database,
  Cloud,
  Cpu,
  Sparkles,
  User
} from 'lucide-react';

export default function HowItWorks() {
  const [activeManualStep, setActiveManualStep] = useState(0);
  const [activeAiStep, setActiveAiStep] = useState(0);

  const manualSteps = [
    {
      title: 'Write a note',
      detail: 'Type your note in the editor. No account required.'
    },
    {
      title: 'Encrypt in your browser',
      detail: 'Your browser creates a random AES-GCM key and encrypts the note before it leaves your device.'
    },
    {
      title: 'Share the link',
      detail: 'The key is placed in the URL fragment. The server never receives it.'
    },
    {
      title: 'Reveal and decrypt',
      detail: 'The recipient fetches ciphertext and decrypts locally with the fragment key.'
    }
  ];

  const aiSteps = [
    {
      title: 'Prompt the AI',
      detail: 'Send a short prompt to draft, summarize, or clean up a note.'
    },
    {
      title: 'Human check',
      detail: 'Turnstile verifies the request to reduce automated abuse.'
    },
    {
      title: 'Review the draft',
      detail: 'You can edit the text before encrypting and sharing it.'
    },
    {
      title: 'Encrypt and share',
      detail: 'The final note is encrypted locally and shared like manual mode.'
    }
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 mt-10 mb-24 relative">
      <div className="absolute -top-8 right-8 h-48 w-48 rounded-full bg-gradient-to-br from-blue-200/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-6 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-100/50 to-transparent blur-3xl pointer-events-none" />

      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <div className="lg:grid lg:grid-cols-[220px_1fr] gap-10 items-start">
          <div />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight -mt-6">How It Works</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              A user-first walkthrough of how notes are created, shared, and protected. AI is optional.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block sticky top-24 h-fit">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">On This Page</p>
            <nav className="space-y-2 text-sm">
              <a className="block text-gray-700 dark:text-gray-300 hover:text-primary" href="#manual">Manual Mode</a>
              <a className="block text-gray-700 dark:text-gray-300 hover:text-primary" href="#ai">AI-Enhanced Mode</a>
              <a className="block text-gray-700 dark:text-gray-300 hover:text-primary" href="#storage">What We Store</a>
              <a className="block text-gray-700 dark:text-gray-300 hover:text-primary" href="#reveal">Why Reveal</a>
            </nav>
          </div>
        </aside>

        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          <section id="manual" className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
            <div className="flex items-start gap-3 mb-4">
              <User className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-medium mb-3">Manual Mode (No AI)</h2>
                <p className="mb-4">
                  The simplest path: write, encrypt, share. No accounts and no tracking.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {manualSteps.map((step, index) => (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setActiveManualStep(index)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        activeManualStep === index
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary'
                      }`}
                    >
                      {index + 1}. {step.title}
                    </button>
                  ))}
                </div>

                <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-primary">{manualSteps[activeManualStep].title}:</span>{' '}
                    {manualSteps[activeManualStep].detail}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="ai" className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-medium mb-3">AI-Enhanced Mode (Optional)</h2>
                <p className="mb-4">
                  Use AI to draft or refine text, then encrypt locally before sharing.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {aiSteps.map((step, index) => (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setActiveAiStep(index)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        activeAiStep === index
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary'
                      }`}
                    >
                      {index + 1}. {step.title}
                    </button>
                  ))}
                </div>

                <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-primary">{aiSteps[activeAiStep].title}:</span>{' '}
                    {aiSteps[activeAiStep].detail}
                  </p>
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  AI prompts are sent to the Worker to call the model provider. Prompts are not stored and request bodies are not logged.
                </div>
              </div>
            </div>
          </section>

          <section id="storage" className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
            <div className="flex items-start gap-3 mb-4">
              <Database className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-medium mb-3">What We Store (And What We Don&apos;t)</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold mb-2">Stored</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Encrypted note content (ciphertext)</li>
                      <li>Initialization vectors (IVs)</li>
                      <li>Expiration and read limits</li>
                      <li>Password-protection metadata (salt, wrap IV)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold mb-2">Not Stored</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Encryption keys</li>
                      <li>Wrapped key (stays in the URL fragment)</li>
                      <li>Plaintext notes</li>
                      <li>AI prompts or outputs</li>
                      <li>Analytics tied to identity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="reveal" className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-medium mb-3">Why the Reveal Step</h2>
                <p className="text-sm">
                  We require an explicit reveal action so link preview bots do not accidentally consume a note.
                </p>
              </div>
            </div>
          </section>

          <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
            <h2 className="text-xl font-medium mb-3">Learn More</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/security-resources"
                className="text-primary hover:underline text-sm"
              >
                Security Details →
              </Link>
              <Link
                href="/privacy"
                className="text-primary hover:underline text-sm"
              >
                Privacy Policy →
              </Link>
              <Link
                href="/terms"
                className="text-primary hover:underline text-sm"
              >
                Terms of Use →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
