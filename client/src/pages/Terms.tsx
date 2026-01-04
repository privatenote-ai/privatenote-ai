import React from "react";
import { Link } from "wouter";
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  Shield,
  Scale,
  UserX,
  RefreshCcw,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Last updated: January 4, 2026
        </p>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        {/* Service Agreement */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Service Agreement</h2>
              <p>
                By accessing or using PrivateNote.ai, you agree to these Terms of
                Use. If you do not agree, you must not use the service.
              </p>
              <p className="mt-3">
                PrivateNote.ai provides encrypted, temporary note-sharing
                functionality. Notes are designed to be ephemeral and may become
                inaccessible after expiration or consumption.
              </p>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Acceptable Use</h2>
              <p className="mb-3">You agree not to use PrivateNote.ai to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Engage in illegal, unlawful, or fraudulent activities</li>
                <li>Transmit malware, harmful code, or exploit attempts</li>
                <li>Harass, threaten, or abuse others</li>
                <li>Attempt to bypass security or abuse service limits</li>
                <li>Interfere with or disrupt service availability</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Responsibility */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <UserX className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">User Responsibility</h2>
              <p>
                You are solely responsible for the content you create, encrypt,
                share, and transmit using the service.
              </p>
              <p className="mt-3">
                PrivateNote.ai does not review, moderate, or access note
                contents. You are responsible for ensuring that your use of the
                service complies with applicable laws and regulations.
              </p>
            </div>
          </div>
        </section>

        {/* Availability & Changes */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <RefreshCcw className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">
                Service Availability & Changes
              </h2>
              <p>
                The service is provided on a best-effort basis and may be
                modified, suspended, or discontinued at any time without prior
                notice.
              </p>
              <p className="mt-3">
                We do not guarantee uninterrupted availability, data retention,
                or recovery of expired or consumed notes.
              </p>
            </div>
          </div>
        </section>

        {/* Liability */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">
                Disclaimer & Limitation of Liability
              </h2>
              <p>
                PrivateNote.ai is provided “as is” and “as available,” without
                warranties of any kind, whether express or implied.
              </p>
              <p className="mt-3">
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages, including data loss, service interruption, or
                unauthorized access.
              </p>
              <p className="mt-3">
                While we use modern cryptographic techniques, no digital system
                can guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Scale className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with
                applicable laws, without regard to conflict of law principles.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-2">Contact</h2>
          <p>
            If you have questions about these Terms, contact us at{" "}
            <a
              href="mailto:support@privatenote.ai"
              className="text-primary hover:underline"
            >
              support@privatenote.ai
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}