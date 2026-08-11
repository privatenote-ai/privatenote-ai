import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";

const SLUG = "delayed-reveal-scheduled-secret-links";

/**
 * Product feature post: Delayed reveal — schedule when a one-time note can first be opened.
 */
export const DelayedRevealScheduledSecretLinksPost: React.FC = () => {
  const { language, t } = useLanguage();
  const createHref = localizedPath("/", language);
  const oneTimeHref = localizedPath("/blog/one-time-secret-links", language);
  const makeNoteHref = localizedPath("/blog/how-to-make-a-private-note", language);

  return (
    <BlogGuideArticle slug={SLUG}>
      <article>
        <BlogPostHeader
          slug={SLUG}
          title={t.blogDelayedRevealTitle ?? "Delayed Reveal for One-Time Secret Links"}
          excerpt={
            t.blogDelayedRevealExcerpt ??
            "Schedule when a private note can first be opened — for credential handovers, HR packs, and embargoed documents."
          }
          headerClassName="mb-8"
        />

        <BlogArticleTakeaways slug={SLUG} />

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Expiry answers one question: when does this link stop working? Teams often need a
            second answer first: when is it allowed to open?
          </p>
          <p>
            Delayed reveal lets you create an encrypted one-time note now and set{" "}
            <strong>Do not allow opening before</strong> a specific time (for example August 15,
            09:00 UTC). Recipients can receive the link early. They cannot reveal the ciphertext
            until that moment.
          </p>

          <hr className="border-gray-200 dark:border-gray-700" />
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Why schedule the open, not just the expiry?
            </h2>
            <p>
              Credential handovers, HR packs, embargoed announcements, and legal disclosures often
              have a hard start time. Sending the secret the night before is convenient — as long
              as nobody can open it early.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Scheduled credential handover</strong> — ship the link when the ticket is
                ready; unlock access at cutover.
              </li>
              <li>
                <strong>HR and onboarding packs</strong> — share materials that should not be
                readable until day one.
              </li>
              <li>
                <strong>Embargoed information</strong> — press or partner material that must stay
                sealed until a public time.
              </li>
              <li>
                <strong>Legal / compliance documents</strong> — align first access with a
                contractual or filing date.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              How Delayed reveal works on PrivateNote
            </h2>
            <p>
              On Starter and Business, open <strong>Delivery &amp; verification</strong> when
              creating a note. Turn on <strong>Delayed reveal</strong>, then pick{" "}
              <strong>Do not allow opening before</strong>. The time is stored as UTC policy on the
              note metadata — separate from the message ciphertext.
            </p>
            <p>
              Until that time, the reveal page shows that the note is not available yet, with the
              scheduled open time. Afterward, normal rules apply: password (if any), open limits,
              and lifetime expiry.
            </p>
            <p>
              The open time must be in the future and <strong>before</strong> the note expires. A
              note that opens after it expires would never be readable — PrivateNote rejects that
              combination at create time.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What stays the same</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Encryption still happens in the browser before upload.</li>
              <li>The server still cannot read the plaintext.</li>
              <li>
                Burn-after-read, passwords, recipient verification, and email alerts still work
                once the note becomes openable.
              </li>
            </ul>
            <p>
              Delayed reveal is an access policy, not a second encryption layer. Anyone with the
              link and key can open the note after the scheduled time — share the URL the same
              careful way you would for any one-time secret.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">A simple workflow</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <Link href={createHref} className="font-medium text-primary hover:underline">
                  Create a private note
                </Link>{" "}
                and encrypt your secret in the browser.
              </li>
              <li>Set note lifetime long enough to cover the embargo window plus a margin.</li>
              <li>Enable Delayed reveal and choose the earliest open time.</li>
              <li>Optionally email the link or require a one-time recipient code.</li>
              <li>Send the link early; recipients wait until the scheduled open.</li>
            </ol>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Related reading</h2>
            <p>
              For the broader pattern of ephemeral sharing, see{" "}
              <Link href={oneTimeHref} className="font-medium text-primary hover:underline">
                one-time secret links
              </Link>{" "}
              and{" "}
              <Link href={makeNoteHref} className="font-medium text-primary hover:underline">
                how to make a private note
              </Link>
              .
            </p>
          </section>
        </div>

        <BlogPostCrossLinks slug={SLUG} />
      </article>
    </BlogGuideArticle>
  );
};
