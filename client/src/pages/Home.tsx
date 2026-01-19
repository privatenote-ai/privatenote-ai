import React, { useState } from 'react';
import { ShieldCheck, EyeOff, Timer, Shield, Check } from 'lucide-react';
import { CreateNote } from '@/components/note/CreateNote';
import { NoteResult } from '@/components/note/NoteResult';
import { SecurityFeatures } from '@/components/features/SecurityFeatures';

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const [noteUrl, setNoteUrl] = useState('');
  
  // This function would be called from NoteResult when user wants to create a new note
  const handleCreateNew = () => {
    setShowCreateNote(true);
  };
  
  // This would be used when a note is created and we want to show the result
  const handleNoteCreated = (url: string) => {
    setNoteUrl(url);
    setShowCreateNote(false);
  };
  
  return (
    <div className="pt-12 pb-20">
      {/* Hero Section */}
      <section className="px-4 pb-0 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Your Messages,</span>
            <span className="block mt-1 text-primary">Your Privacy.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            End-to-end encrypted notes that self-destruct after reading.
            More secure than alternatives, with client-side encryption ensuring your messages stay private.
          </p>
        </div>
      </section>

      {/* Create Note or Result - Main Feature */}
      <div className="mt-8 mb-8 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          {showCreateNote ? (
            <CreateNote />
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      {/* Security Features */}
      <SecurityFeatures />

      {/* Why PrivateNote */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/60 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Why PrivateNote
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              Share sensitive notes with confidence.
            </h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              PrivateNote keeps your messages private by encrypting in the browser and
              letting the note disappear after it’s read. No accounts, no friction,
              and no ads following you around.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                Client-side encryption means the server never sees your plaintext.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                Read-once and expiring notes reduce exposure over time.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                No tracking cookies, no ads, and no third-party analytics on notes.
              </li>
            </ul>
          </div>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <EyeOff className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    No tracking or ads
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    We don’t monetize your data. Privacy is the product.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Timer className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Disappearing by default
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Automatic expiration keeps notes from lingering.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Verified security flow
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Encryption happens in your browser before anything is sent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Stays Private */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/60 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                A simple privacy flow you can trust.
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Clear steps, no hidden data collection.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Shield className="h-4 w-4" />
              Privacy-first by design
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Write',
                detail: 'Compose your note in the browser — nothing is stored yet.',
              },
              {
                title: 'Encrypt',
                detail: 'Your device encrypts the note before it leaves your screen.',
              },
              {
                title: 'Share',
                detail: 'Send the link. The note disappears after it’s read or expires.',
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2">
            {[
              'No tracking cookies on note pages.',
              'No third-party analytics scripts on notes.',
              'Encryption keys stay in the link, not on our servers.',
              'Minimal metadata stored only to enforce expiration.',
            ].map((detail) => (
              <div key={detail} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
