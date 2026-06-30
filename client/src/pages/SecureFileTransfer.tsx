import React, { Suspense, lazy, useEffect, useState } from "react";
import { FileCheck, FileLock2, FolderArchive, ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CreateNote = lazy(() =>
  import("@/components/note/CreateNote").then((m) => ({ default: m.CreateNote })),
);

function CreateNoteMountPlaceholder() {
  return <div className="min-h-[28rem] w-full" aria-hidden />;
}

const features = [
  {
    icon: FileLock2,
    title: "Browser-side encryption",
    text: "Files are encrypted on this device before upload. PrivateNote stores only ciphertext — never readable file contents.",
  },
  {
    icon: FolderArchive,
    title: "Folder transfer",
    text: "Choose a folder and PrivateNote prepares a local zip first, then encrypts that archive before it leaves your device.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled access",
    text: "Set expiry, view limits, and file access windows so the transfer disappears after the recipient opens it.",
  },
  {
    icon: FileCheck,
    title: "Sign in to send",
    text: "Sending requires a free PrivateNote account (up to 25 MB per file, 250 MB total storage). Recipients never need an account to open the link.",
  },
];

const faqs = [
  {
    q: "Are my files visible to PrivateNote?",
    a: "No. Files are encrypted in your browser before upload using AES-256-GCM. PrivateNote stores only ciphertext — the server never has access to readable file contents or the encryption key.",
  },
  {
    q: "Do I need an account to send files?",
    a: "Yes, sending requires a free PrivateNote account so we can enforce per-user storage limits and keep the service abuse-free. Recipients do not need an account — anyone with the link can open the transfer.",
  },
  {
    q: "Can I send a whole folder?",
    a: "Yes. Choose a folder and PrivateNote prepares a local zip first, then encrypts that archive before it leaves your device. The recipient downloads and decrypts the zip automatically.",
  },
  {
    q: "What are the file size limits?",
    a: "Signed-in users can attach up to 25 MB per file and 250 MB total encrypted storage. If you need to send a folder, use the built-in folder picker — PrivateNote zips and encrypts it automatically.",
  },
  {
    q: "What happens after the recipient opens the transfer?",
    a: "The transfer follows the same disappearing model as PrivateNote messages. Depending on your settings, access expires after the first view, after a set time limit, or when the file access window ends.",
  },
  {
    q: "Is this different from cloud drive sharing?",
    a: "Yes. PrivateNote is built for temporary, encrypted one-time delivery — not long-term collaboration. Files are never stored in a readable form on the server and the link stops working once the conditions you set are met.",
  },
];

const SecureFileTransfer: React.FC = () => {
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const [mountCreateNote, setMountCreateNote] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const mount = () => {
      if (!cancelled) setMountCreateNote(true);
    };
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(mount, { timeout: 600 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const id = requestAnimationFrame(mount);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} min-w-0 max-w-full overflow-x-clip pb-24`}>
      {!isCreateSuccessView ? (
        <section className="relative isolate mx-auto max-w-4xl px-4 pb-2 text-center sm:px-6 sm:pb-4 lg:px-8">
          <h1 className="page-title text-gray-900 dark:text-white">
            The <span className="text-primary">private way</span> to share files
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-500 dark:text-gray-400 sm:text-xl">
            No file scanning. No access to your data. Encryption happens in your browser.
          </p>
        </section>
      ) : null}

      <div className={`${isCreateSuccessView ? "mt-0" : "mt-8 md:mt-10"} px-4 py-4 pb-14 sm:px-6 lg:px-8`}>
        <div className="mx-auto min-w-0 max-w-4xl">
          {mountCreateNote ? (
            <Suspense fallback={<CreateNoteMountPlaceholder />}>
              <CreateNote mode="file-transfer" onSuccessStateChange={setIsCreateSuccessView} />
            </Suspense>
          ) : (
            <CreateNoteMountPlaceholder />
          )}
        </div>
      </div>

      {!isCreateSuccessView ? (
        <>
          <section className="relative isolate overflow-x-clip border-b border-gray-200/45 bg-gradient-to-b from-gray-50/25 via-gray-50/70 to-gray-50/90 px-4 py-14 dark:border-gray-800/45 dark:from-gray-950/15 dark:via-gray-950/45 dark:to-gray-950/65 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-4xl">
              <div className="mb-10 text-center sm:mb-14">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Key features
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Secure file transfer uses the same disappearing note model, with attachment-first controls for files and folders.
                </p>
              </div>

              {/* Card grid — medium+ screens */}
              <div className="hidden sm:grid grid-cols-2 items-stretch gap-6 md:grid-cols-2 md:gap-7">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="group relative isolate flex h-full min-h-[180px] transform-gpu flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white p-5 shadow-sm transition-[transform,border-color,background-color] duration-200 ease-out hover:translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.015] dark:border-gray-700/70 dark:bg-gray-900 dark:hover:bg-primary/[0.04]"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                        <div className="absolute inset-x-0 top-0 h-px bg-primary/25" />
                      </div>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" aria-hidden />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{feature.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* List view — mobile only */}
              <div className="space-y-4 sm:hidden">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-4 rounded-lg border border-gray-200/70 bg-white p-4 shadow-sm dark:border-gray-700/70 dark:bg-gray-900"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" aria-hidden />
                      </div>
                      <div>
                        <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden border-t border-gray-200/70 bg-gray-50/60 px-4 py-16 dark:border-gray-800/70 dark:bg-gray-900/40 sm:px-6 sm:py-20 lg:px-8">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
              <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
            </div>
            <div className="relative z-10 mx-auto max-w-4xl">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                    FAQ
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                    Practical details about encrypted file and folder sharing with PrivateNote.
                  </p>
                </div>
              </div>

              <Accordion
                type="single"
                collapsible
                className="rounded-3xl border border-primary/20 bg-white/85 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_10px_40px_rgba(15,23,42,0.09)] ring-1 ring-primary/10 backdrop-blur dark:border-primary/15 dark:bg-gray-950/80 dark:ring-primary/5"
              >
                {faqs.map((item, index) => (
                  <AccordionItem
                    key={item.q}
                    value={`faq-${index}`}
                    className={`group overflow-hidden border-b border-gray-200/70 transition-colors duration-150 data-[state=open]:bg-primary/[0.035] dark:border-gray-800/70 dark:data-[state=open]:bg-primary/[0.07] ${index === faqs.length - 1 ? "border-b-0" : ""}`}
                  >
                    <AccordionTrigger className="items-start gap-3 px-6 py-5 text-left text-sm transition-colors hover:bg-gray-50/70 hover:no-underline data-[state=open]:text-primary sm:text-base [&>svg]:mt-1.5 [&>svg]:shrink-0 [&>svg]:text-gray-400 data-[state=open]:[&>svg]:text-primary dark:hover:bg-gray-900/50">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/15 text-xs font-semibold tabular-nums leading-none text-primary shadow-[0_0_8px_rgba(99,102,241,0.15)] ring-1 ring-primary/25">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 pt-1.5 leading-snug text-gray-900 dark:text-white">{item.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      <div className="ml-4 border-l-2 border-primary/25 pl-12">
                        {item.a}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default SecureFileTransfer;
