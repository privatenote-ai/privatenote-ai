import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { CreateNote } from '@/components/note/CreateNote';
import { NoteResult } from '@/components/note/NoteResult';
import { SecurityFeatures } from '@/components/features/SecurityFeatures';
import { FAQSection } from '@/components/features/FAQSection';

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const noteUrl = '';
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);

  // This function would be called from NoteResult when user wants to create a new note
  const handleCreateNew = () => {
    setShowCreateNote(true);
  };

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} pb-20`}>
      {!isCreateSuccessView && (
        <section className="px-4 pb-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="page-title text-gray-900 dark:text-white">
              <span className="block">Your Messages,</span>
              <span className="block mt-1 text-primary">Your Privacy</span>
            </h1>
            <p className="mt-3 max-w-4xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-5xl">
              End-to-end encrypted notes that self-destruct after reading.
              More secure than alternatives, with client-side encryption ensuring your messages stay private.
            </p>
          </div>
        </section>
      )}

      {/* Create Note or Result - Main Feature */}
      <div className={`${isCreateSuccessView ? "mt-0" : "mt-8"} mb-8 py-4 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          {showCreateNote ? (
            <CreateNote onSuccessStateChange={setIsCreateSuccessView} />
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      {/* Security Features */}
      <SecurityFeatures />

      {/* Why + How wrapper (enables overlap) */}
      <section className="relative">
        {/* Background treatment */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-[0.10]" />
        </div>

        {/* Why PrivateNote */}
        <div className="px-4 pt-14 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/60 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
                Why PrivateNote
              </div>

              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Share sensitive notes with confidence.
              </h2>

              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-xl">
                PrivateNote keeps your messages private by encrypting in the browser and
                letting the note disappear after it’s read. No accounts, no friction,
                and no ads following you around.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {[
                  'Client-side encryption means the server never sees your plaintext.',
                  'Read-once and expiring notes reduce exposure over time.',
                  'No tracking cookies, no ads, and no third-party analytics on notes.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* How It Stays Private */}
        <div className="px-4 pt-8 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-10 sm:mt-16 relative z-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                A simple privacy flow you can trust.
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Clear steps, no hidden data collection.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/15">
              <Shield className="h-4 w-4" />
              Privacy-first by design
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Write', detail: 'Compose your note in the browser — nothing is stored yet.' },
              { title: 'Encrypt', detail: 'Your device encrypts the note before it leaves your screen.' },
              { title: 'Share', detail: 'Send the link. The note disappears after it’s read or expires.' },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/15">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                </div>
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

      <FAQSection />
    </div>
  );
};

export default Home;
