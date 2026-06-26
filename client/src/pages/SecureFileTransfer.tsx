import React, { Suspense, lazy, useEffect, useState } from "react";
import { Bell, FileLock2, FolderArchive, ShieldCheck } from "lucide-react";

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
    text: "Files are encrypted on this device before upload, using the same PrivateNote attachment flow.",
  },
  {
    icon: FolderArchive,
    title: "Folder transfer",
    text: "Choose a folder and PrivateNote prepares a local zip before encrypting the transfer.",
  },
  {
    icon: ShieldCheck,
    title: "Premium controls",
    text: "Use recipient checks, read limits, expiry, and file access windows for sensitive deliveries.",
  },
  {
    icon: Bell,
    title: "Delivery visibility",
    text: "Premium accounts can enable open and destroy notifications without exposing file contents.",
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
            The private way to share files
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
        <section className="border-y border-gray-200/60 bg-gray-50/70 px-4 py-14 dark:border-gray-800/60 dark:bg-gray-950/45 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Key features
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Secure file transfer uses the same disappearing note model, with attachment-first controls for files and folders.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {feature.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default SecureFileTransfer;
