import React from "react";
import { Link } from "wouter";
import { Shield, Eye, Lock, Cookie, Server, Trash2, HelpCircle, ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">Last updated: January 4, 2026</p>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        {/* Commitment */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Our Commitment to Privacy</h2>
              <p>
                PrivateNote.ai is designed to minimize the data we collect, store, and process while enabling secure,
                single-use note sharing.
              </p>
              <p className="mt-3">
                Notes are encrypted in your browser before transmission. Under normal operation, we are intentionally
                unable to read note contents.
              </p>
            </div>
          </div>
        </section>

        {/* Data collection */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">What Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Encrypted notes:</strong> Note content is encrypted client-side before being sent to our
                  servers. We store only encrypted data plus minimal metadata required to enforce expiration and read
                  limits.
                </li>
                <li>
                  <strong>Note metadata:</strong> Expiration time, remaining view count, and internal identifiers needed
                  to enforce one-time access.
                </li>
                <li>
                  <strong>Technical and security data:</strong> We may temporarily process IP addresses, request headers,
                  and timestamps for abuse prevention, rate limiting, service reliability, and security monitoring. This
                  data is not used for tracking or profiling.
                </li>
                <li>
                  <strong>Anonymous usage metrics:</strong> Aggregated metrics to improve reliability and user
                  experience. These metrics are not intended to identify individual users.
                </li>
              </ul>

              <div className="mt-5 flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">What We Do Not Collect</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>No user accounts</li>
                    <li>No names or email addresses</li>
                    <li>No advertising identifiers</li>
                    <li>No tracking cookies</li>
                    <li>No third-party analytics scripts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">How We Use Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deliver encrypted notes</li>
                <li>Enforce expiration and read-once rules</li>
                <li>Automatically render notes inaccessible after consumption and delete as soon as technically feasible</li>
                <li>Protect the service against abuse and automated attacks</li>
                <li>Maintain reliability and performance</li>
              </ul>
              <p className="mt-4">We do not sell, rent, or share personal data for advertising purposes.</p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Encryption &amp; Security</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Client-side encryption:</strong> Encryption happens in your browser before transmission.
                </li>
                <li>
                  <strong>Authenticated encryption:</strong> The encryption scheme is designed to detect tampering with
                  stored data.
                </li>
                <li>
                  <strong>Automatic deletion:</strong> Notes are rendered inaccessible after they are read or expire and
                  are deleted as soon as technically feasible.
                </li>
                <li>
                  <strong>Human verification (when required):</strong> In certain situations (e.g., abuse prevention or
                  AI-assisted features), we may require a human verification step using Cloudflare Turnstile.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Cookie className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Cookies &amp; Tracking</h2>
              <p>
                PrivateNote.ai does not use tracking cookies, advertising cookies, or cross-site tracking technologies.
              </p>
              <p className="mt-3">
                Essential technical cookies may be used only where required for basic site functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Third-party infra */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Server className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Third-Party Infrastructure</h2>
              <p>
                PrivateNote.ai is hosted on Cloudflare’s global network. Encrypted note data and limited technical
                metadata are processed through Cloudflare infrastructure in accordance with their security and privacy
                practices.
              </p>
            </div>
          </div>
        </section>

        {/* Retention */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Trash2 className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Data Retention</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Encrypted notes:</strong> retained only until they are consumed or expire.
                </li>
                <li>
                  <strong>Technical logs:</strong> retained only as long as necessary for security and operational
                  purposes.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rights + contact */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-3">Your Rights &amp; Contact</h2>
          <p>
            Because we do not require accounts and do not store personal profiles, most data is not directly
            attributable to an individual user.
          </p>
          <p className="mt-3">
            If you have privacy questions or concerns, contact us at{" "}
            <a className="text-primary hover:underline" href="mailto:support@privatenote.ai">
              support@privatenote.ai
            </a>
            .
          </p>
        </section>

        {/* Client-Side Security */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Client-Side Security & Limitations</h2>
              <p className="mb-3">
                PrivateNote.ai uses end-to-end encryption where encryption and decryption happen entirely in your browser. 
                However, like all client-side encryption systems, there are inherent security considerations:
              </p>
              
              <h3 className="font-medium mb-2 mt-4">Security Measures We Implement</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong>Content Security Policy (CSP):</strong> Strict CSP headers prevent unauthorized script execution 
                  and reduce XSS attack surface
                </li>
                <li>
                  <strong>Subresource Integrity (SRI):</strong> External resources are verified with cryptographic hashes 
                  to ensure they haven't been tampered with
                </li>
                <li>
                  <strong>No third-party analytics:</strong> Note viewing pages load no tracking scripts or analytics
                </li>
                <li>
                  <strong>Fragment-based keys:</strong> Encryption keys are passed via URL fragments (never sent to server) 
                  and immediately removed from browser history
                </li>
                <li>
                  <strong>Rate limiting:</strong> API endpoints are protected against abuse and automated attacks
                </li>
                <li>
                  <strong>CORS restrictions:</strong> Only approved origins can access the API
                </li>
              </ul>

              <h3 className="font-medium mb-2 mt-4">Inherent Limitations</h3>
              <p className="mb-3">
                Even with perfect cryptography, client-side encryption is vulnerable to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong>Compromised JavaScript delivery:</strong> If our JavaScript is compromised (supply chain attack, 
                  CDN compromise, XSS), malicious code could potentially read encryption keys from URL fragments
                </li>
                <li>
                  <strong>Browser extensions:</strong> Malicious browser extensions could intercept or modify page content
                </li>
                <li>
                  <strong>Compromised device:</strong> Malware on your device could read keys from memory or screen
                </li>
              </ul>

              <h3 className="font-medium mb-2 mt-4">Best Practices for Maximum Security</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use password-protected notes for highly sensitive content (adds an additional encryption layer)</li>
                <li>Verify the URL matches <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">privatenote.ai</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">privatenote-ai.pages.dev</code></li>
                <li>Check browser console for unexpected errors or warnings</li>
                <li>Use a privacy-focused browser with script blocking capabilities</li>
                <li>Avoid accessing notes on shared or untrusted devices</li>
                <li>Keep your browser and operating system updated</li>
                <li>Consider reviewing our source code if it becomes open-source</li>
              </ul>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> For maximum security, we recommend using password-protected notes and verifying 
                the website URL before entering sensitive information.
              </p>
            </div>
          </div>
        </section>

        {/* Changes */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-3">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in the service or legal requirements. The "Last
            updated" date will indicate the latest revision.
          </p>
        </section>
      </div>
    </div>
  );
}