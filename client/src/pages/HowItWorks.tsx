import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  AlertTriangle,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Lock,
  PenLine,
  Shield,
  ShieldCheck,
  Sparkles,
  Timer,
  XCircle,
} from 'lucide-react';
import { SecureNoteIllustration } from '@/components/SecureNoteIllustration';

export default function HowItWorks() {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');

  const manualSteps = [
    {
      title: 'Write your note',
      detail: 'Type your message locally. No account, no tracking cookies.',
      icon: <PenLine className="h-5 w-5" />
    },
    {
      title: 'Encrypt in your browser',
      detail: 'Your device creates a random AES-GCM key and encrypts before sending.',
      icon: <Lock className="h-5 w-5" />
    },
    {
      title: 'Share the link',
      detail: 'The key lives in the link fragment so the server never sees it.',
      icon: <Key className="h-5 w-5" />
    },
    {
      title: 'Reveal and decrypt',
      detail: 'The recipient decrypts locally. The note disappears after it’s read.',
      icon: <Timer className="h-5 w-5" />
    }
  ];

  const aiSteps = [
    {
      title: 'Ask for a draft',
      detail: 'Send a short prompt to draft, summarize, or clean up a note.',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      title: 'Human check',
      detail: 'Turnstile verifies the request to reduce automated abuse.',
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      title: 'Review before sharing',
      detail: 'Edit the draft so you control what gets encrypted.',
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: 'Encrypt and share',
      detail: 'The final note is encrypted locally and shared like manual mode.',
      icon: <Lock className="h-5 w-5" />
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
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight mt-2">
            How PrivateNote Works
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The same calm, private flow every time: write, encrypt, share. AI is optional,
            and you’re always in control.
          </p>
        </div>
      </div>

      <div className="space-y-10 text-gray-700 dark:text-gray-300">
        <section className="relative overflow-hidden backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200/50 to-transparent blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Choose your flow</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manual mode keeps everything on-device. AI mode adds a helper, with a tradeoff.
              </p>
            </div>
            <div className="flex rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 p-1">
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  mode === 'manual'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                Manual Mode
              </button>
              <button
                type="button"
                onClick={() => setMode('ai')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  mode === 'ai'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                AI Mode
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-col items-center text-center">
              <SecureNoteIllustration caption="Your words stay on your device. They are encrypted before anything leaves it." />
            </div>

            {mode === 'ai' && (
              <div className="mt-4 text-sm text-amber-900/90 dark:text-amber-100/90">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-semibold">AI mode shares your prompt with a third-party model provider.</p>
                    <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-100/80">
                      We don’t store prompts, but third-party processing means it is less private than manual mode.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(mode === 'manual' ? manualSteps : aiSteps).map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Step {index + 1}</p>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-2">What We Store (And What We Don&apos;t)</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Minimal storage keeps the system reliable without keeping your secrets.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Stored
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {[
                  'Encrypted note content (ciphertext)',
                  'Initialization vectors (IVs)',
                  'Expiration and read limits',
                  'Password-protection metadata (salt, wrap IV)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                <XCircle className="h-4 w-4 text-rose-500" />
                Not stored
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {[
                  'Encryption keys',
                  'Wrapped key (stays in the URL fragment)',
                  'Plaintext notes',
                  'AI prompts or outputs',
                  'Analytics tied to identity',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <EyeOff className="h-4 w-4 text-rose-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-2">Why the Reveal Step</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We require an explicit reveal action so link preview bots don&apos;t consume a note
                before the intended recipient can open it.
              </p>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <h2 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">Learn More</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/security-resources" className="text-primary hover:underline">
              Security Details →
            </Link>
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Use →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
