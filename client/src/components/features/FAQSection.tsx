import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    id: 'faq-how-it-works',
    question: 'How does PrivateNote.ai work?',
    answer:
      "You write a note directly in your browser. Your device encrypts the note locally, and only the encrypted content is sent to our server. You share a unique link with the recipient, and the note can be set to disappear after it's opened or after a chosen expiration time.",
  },
  {
    id: 'faq-see-content',
    question: 'Can PrivateNote.ai see my note content?',
    answer:
      "No. Notes are encrypted in your browser before they are uploaded. We only store the encrypted payload (ciphertext), so we can't read your plaintext message.",
  },
  {
    id: 'faq-after-open',
    question: "What happens after the note is opened?",
    answer:
      'Notes are always "read once" for maximum privacy: after the first time someone opens the link, the note is destroyed and cannot be viewed again. You can also choose a time-based expiration window; if the note is never opened before that time runs out, it is automatically deleted without ever being read.',
  },
  {
    id: 'faq-link-length',
    question: 'Why is the link longer than other note-sharing services?',
    answer:
      'Our links are intentionally longer because they carry more cryptographic material client-side, rather than relying on server-stored secrets. All encryption and key generation happen in your browser using the Web Crypto API, and the decryption key is embedded in the URL fragment (#), which is never sent to our servers.\n\nKeys are generated with high entropy to support modern security margins, and we avoid short server-side identifiers or lookup tokens. This design avoids centralized key storage and ensures that only someone with the full link can decrypt the note. Shorter links typically rely on server-held secrets, key derivation shortcuts, or database lookups, which introduce additional trust assumptions.',
  },
  {
    id: 'faq-password',
    question: 'Can I protect a note with a password?',
    answer:
      'Yes. You can add an optional password for an extra layer of protection. Share the password separately from the link (for example, send the link in chat and the password in a different channel).',
  },
  {
    id: 'faq-encryption-key',
    question: 'Is the encryption key stored on your server?',
    answer:
      'No. The decryption key lives in the link after the "#" fragment. Browsers never send this fragment (the part after "#") to any server, so our backend only ever sees a short note ID used to fetch the encrypted data.',
  },
  {
    id: 'faq-metadata',
    question: 'What metadata do you store?',
    answer:
      "We store only what's needed to run the service securely: the encrypted note payload, expiration settings, and limited operational logs needed for reliability and abuse prevention. We don't run third-party analytics on note pages.",
  },
  {
    id: 'faq-recover',
    question: "Can I recover a note after it's destroyed or expired?",
    answer:
      "No. Once a note is deleted (because it was read or expired), it can't be recovered. PrivateNote.ai is designed for disappearing notes, not long-term storage.",
  },
  {
    id: 'faq-share-link',
    question: 'Is it safe to share the link over email or chat?',
    answer:
      "The encrypted note is safe, but the link is the key. Anyone who gets the link (and the password too, if you set one and share it) can open the note. Treat the link like a one-time key: use trustworthy channels, short expirations, and ideally send the link and password over different channels.",
  },
  {
    id: 'faq-forwarding',
    question: 'Can recipients forward the note?',
    answer:
      "They can forward the link, yes. PrivateNote.ai reduces risk with read-once and expirations, but like any tool it can't prevent screenshots, copy/paste, or forwarding once someone has access.",
  },
  {
    id: 'faq-size',
    question: "What's the maximum note size?",
    answer:
      'Notes are intended for short to medium-length text and small secrets. Very large payloads may be rejected or truncated to keep performance and security predictable.',
  },
  {
    id: 'faq-pricing',
    question: 'Is PrivateNote.ai free?',
    answer:
      'PrivateNote.ai currently offers a free way to create secure, disappearing notes. In the future, premium features like longer expirations or advanced controls may be available.',
  },
  {
    id: 'faq-ai',
    question: 'Why ".ai" — do you use AI on my notes?',
    answer:
      "AI features are strictly opt-in. Unless you explicitly click an AI action (such as rewrite, summarize, or security tips), your note is never sent to or processed by any LLM. Regular notes work entirely without AI, and note pages are not used for ad tracking.",
  },
  {
    id: 'faq-expiration-defaults',
    question: "How long do notes live if I don't set an expiration?",
    answer:
      'PrivateNote.ai encourages short-lived notes. You can choose how long a note should live when you create it, and we recommend privacy-first defaults like hours or days rather than months. Once the expiration time passes, the note is deleted automatically.',
  },
  {
    id: 'faq-open-source',
    question: 'Is PrivateNote.ai open source?',
    answer:
      "PrivateNote.ai itself isn't fully open source yet, but the core cryptography relies on the browser's Web Crypto API and standard, well-vetted algorithms like AES-GCM rather than custom 'homegrown' crypto. We focus on documenting the security design and aim to increase transparency over time.",
  },
  {
    id: 'faq-sensitive-secrets',
    question: 'Can I use this for passwords, recovery codes, or private keys?',
    answer:
      "Yes, that's a common use, as long as you understand the tradeoffs: anyone with the link (and password, if set) can read the secret, and they can still copy or screenshot it. For extremely sensitive material, consider splitting information across multiple notes or pairing this with a dedicated password manager.",
  },
];

export const FAQSection: React.FC = () => {
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    const scriptId = 'faq-schema-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      document.head.appendChild(script);
    }

    script.text = JSON.stringify(jsonLd);
  }, []);

  return (
    <section className="mt-20 border-t border-gray-200/70 dark:border-gray-800/70 bg-gray-50/60 dark:bg-gray-900/40 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
              FAQ
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              Get quick answers about encryption, expiration, metadata, and how to safely
              share sensitive notes.
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
            Still unsure? Just start by writing a test note and opening it yourself — you
            can see the full flow in seconds.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white/85 dark:bg-gray-950/80 backdrop-blur shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={`border-b border-gray-200/70 dark:border-gray-800/70 ${index === FAQ_ITEMS.length - 1 ? 'border-b-0' : ''
                }`}
            >
              <AccordionTrigger className="text-left text-sm sm:text-base text-gray-900 dark:text-white px-6 py-5 hover:no-underline hover:bg-gray-50/70 dark:hover:bg-gray-900/50 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold ring-1 ring-primary/20">
                    {index + 1}
                  </span>
                  <span>{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 dark:text-gray-300 px-6 pb-6 pt-2 leading-relaxed">
                <div className="pl-11">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
