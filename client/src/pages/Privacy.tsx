import React from "react";
import { Shield, Lock, Cpu, Globe, Scale } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-10 pb-2 leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-blue-500 dark:from-blue-300 dark:to-blue-500 relative z-10">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          Version 2.1 • Last updated: January 20, 2026 • Luxembourg, EU
        </p>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
        {/* 1. Data Controller Identification */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-3">
            <Scale className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                1. Data Controller
              </h2>
              <p className="text-sm">
                For the purposes of the General Data Protection Regulation (GDPR),
                the data controller is:
              </p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm italic">
                Pupin Labs
                <br />
                62 Rue Marie-Adelaide
                <br />
                2128, Luxembourg, Luxembourg
                <br />
                Email:{" "}
                <a
                  href="mailto:legal@privatenote.ai"
                  className="text-primary font-medium hover:underline not-italic"
                >
                  legal@privatenote.ai
                </a>
              </div>

              <p className="text-xs mt-4 text-gray-500 dark:text-gray-400">
                PrivateNote.ai is not intended for users under the age of{" "}
                <strong>16</strong>. We do not knowingly collect personal data
                from children.
              </p>
            </div>
          </div>
        </section>

        {/* 2. AI Disclosure - Critical */}
        <section className="bg-amber-50/50 dark:bg-amber-900/10 backdrop-blur-sm p-6 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
          <div className="flex items-start gap-3">
            <Cpu className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-300">
                2. AI Processing & Third-Party Services
              </h2>
              <p className="mb-3">
                PrivateNote.ai offers optional AI-enhanced features (e.g.,
                summarization, rewriting). <strong>Please read this carefully:</strong>
              </p>

              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong>Temporary Decryption:</strong> To perform AI tasks, note
                  content must be temporarily decrypted on the processing path for
                  the duration of the request. During this window, the content is
                  not end-to-end encrypted with respect to the AI processor.
                </li>
                <li>
                  <strong>Third-Party Processing:</strong> When you use an AI
                  feature, the note content you submit for that feature is
                  transmitted to our AI provider(s) (e.g., OpenAI, Anthropic) to
                  generate a response.
                </li>
                <li>
                  <strong>No Global Model Training:</strong> We configure our API
                  agreements and settings so that your content is <strong>not</strong>{" "}
                  used to train the providers&apos; global models (subject to the
                  provider’s contractual terms).
                </li>
              </ul>

              <p className="text-sm font-medium italic">
                If you do not use AI features, your notes remain client-side
                encrypted and are never shared with AI providers.
              </p>

              <p className="text-sm mt-4 border-l-2 border-amber-400 pl-4">
                <strong>Consent:</strong> AI features are strictly optional and
                are activated only at your explicit request. By using an AI
                feature, you expressly consent to the processing of the submitted
                note content by the selected AI provider for the sole purpose of
                fulfilling your request (Art. 6(1)(a) GDPR).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Data Collection */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                3. What Data We Collect & Why
              </h2>

              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Encrypted Notes (Stored Data)
                  </h3>
                  <p className="text-sm">
                    Notes are stored in an encrypted format that we cannot read.
                    Notes are deleted automatically upon expiration or consumption,
                    depending on the settings you choose.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Technical Metadata (Traffic Data)
                  </h3>
                  <p className="text-sm">
                    IP addresses, device and request metadata may be processed by
                    our infrastructure providers (e.g., Cloudflare) for security,
                    DDoS protection, abuse prevention, and rate limiting
                    (Art. 6(1)(f) GDPR).
                  </p>
                  <p className="text-xs italic mt-2 text-gray-600 dark:text-gray-400">
                    Security-related metadata is retained only for as long as
                    necessary to ensure service security and abuse prevention,
                    typically for a limited period of days to weeks, after which it
                    is automatically deleted or anonymized.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Support Communications (If You Contact Us)
                  </h3>
                  <p className="text-sm">
                    If you email our support or legal contacts, we will process
                    the information you provide solely to respond to your request
                    (Art. 6(1)(b) and/or Art. 6(1)(f) GDPR).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Infrastructure & International Transfers */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-3">
            <Globe className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                4. International Data Transfers
              </h2>
              <p className="mb-3 text-sm">
                As a Luxembourg-based service, we prioritize EU-based processing.
                However, depending on your location and infrastructure routing,
                certain technical data may be processed outside the EU:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Cloudflare:</strong> used for global content delivery and
                  security. Data may be processed in Cloudflare’s global network.
                </li>
                <li>
                  <strong>AI Providers:</strong> if you use AI features, processing
                  may occur in the <strong>United States</strong> or other regions
                  where the provider operates.
                </li>
              </ul>

              <p className="mt-3 text-sm italic">
                Where required for transfers outside the EEA, we rely on{" "}
                <strong>Standard Contractual Clauses (SCCs)</strong> approved by
                the European Commission and/or other appropriate safeguards to
                ensure a high level of data protection.
              </p>
            </div>
          </div>
        </section>

        {/* 5. User Rights */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                5. Your GDPR Rights
              </h2>
              <p className="mb-3 text-sm">
                Under the GDPR, you have rights including access, rectification,
                erasure, restriction, portability, and the right to object.
              </p>

              <div className="grid md:grid-cols-2 gap-2 text-xs uppercase tracking-wider font-semibold">
                <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                  Right of Access
                </div>
                <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                  Right to Rectification
                </div>
                <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                  Right to Erasure
                </div>
                <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                  Right to Restrict Processing
                </div>
                <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                  Right to Data Portability
                </div>
                <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                  Right to Object
                </div>
              </div>

              <p className="mt-4 text-sm">
                To exercise these rights, contact{" "}
                <a
                  href="mailto:support@privatenote.ai"
                  className="text-primary font-medium hover:underline"
                >
                  support@privatenote.ai
                </a>
                . Because we do not use user accounts, we may require the specific
                note URL (or other information you provide) to identify any data
                related to your request.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Security trade-offs */}
        <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            6. Security Limitations
          </h2>
          <p className="text-sm leading-relaxed">
            We use modern cryptography (e.g., AES-GCM) and security controls (e.g.,
            strict Content Security Policy headers) to protect the service.
            However, no system is 100% secure. The use of AI features introduces a
            third-party processor into the lifecycle of your note content for the
            duration of the request. Users requiring maximum confidentiality
            should avoid AI-enhanced features and use the standard client-side
            encrypted note functionality.
          </p>
        </section>

        {/* Contact */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 mb-4">
            You have the right to lodge a complaint with the Luxembourgish data
            protection authority (CNPD — Commission Nationale pour la Protection
            des Données).
          </p>
          <a
            href="mailto:support@privatenote.ai"
            className="text-primary font-medium hover:underline"
          >
            support@privatenote.ai
          </a>
        </div>
      </div>
    </div>
  );
}
