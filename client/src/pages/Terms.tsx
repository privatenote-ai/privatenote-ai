import React from "react";
import {
  AlertTriangle,
  Shield,
  Scale,
  UserX,
  Lock,
  Gavel,
  Globe,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-10 pb-2 leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-blue-500 dark:from-blue-300 dark:to-blue-500 relative z-10">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          Last updated: January 20, 2026 • Luxembourg, EU
        </p>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
        {/* 0. Age Requirement */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <UserX className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                0. Age Requirement
              </h2>
              <p>
                This service is intended for users who are at least{" "}
                <strong>16 years old</strong>. By using PrivateNote.ai, you confirm
                that you meet the minimum age requirement under applicable EU data
                protection laws.
              </p>
            </div>
          </div>
        </section>

        {/* 1. Client-side Encryption & Security */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                1. Service Description & Encryption
              </h2>
              <p className="mb-3">
                PrivateNote.ai provides a tool for end-to-end encrypted, temporary
                data sharing. <strong>Client-side encrypted:</strong> Encryption occurs
                locally in your browser. We never receive your unencrypted data or
                your decryption keys.
              </p>
              <p className="text-sm border-l-2 border-amber-500 pl-4 bg-amber-50/50 dark:bg-amber-900/10 py-2 rounded-r-md">
                <strong>Warning:</strong> If you lose the link or the password, the
                data is mathematically irrecoverable. Under no circumstances can we
                restore access to an encrypted note.
              </p>
            </div>
          </div>
        </section>

        {/* 2. GDPR & Data Protection */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg shrink-0">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                2. Data Protection (GDPR)
              </h2>
              <p className="mb-3">
                In accordance with the{" "}
                <strong>EU General Data Protection Regulation (GDPR)</strong>, we
                minimize data collection. While note content is encrypted and
                anonymous to us, technical metadata (e.g., IP addresses) may be
                processed for security and rate-limiting purposes.
              </p>
              <p>
                Please refer to our <strong>Privacy Policy</strong> for details on
                your rights to access, rectification, and erasure of any personal
                data we may hold.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Acceptable Use & DSA */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg shrink-0">
              <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                3. Prohibited Content & DSA
              </h2>
              <p className="mb-4">
                Pursuant to the <strong>EU Digital Services Act (DSA)</strong>, you
                are prohibited from using this service to share illegal content,
                including but not limited to:
              </p>
              <ul className="grid md:grid-cols-2 gap-2 pl-2 mb-4">
                {[
                  "Child Sexual Abuse Material (CSAM)",
                  "Terrorist content or propaganda",
                  "Hate speech or illegal defamation",
                  "Unauthorized sharing of private data",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm italic">
                We act as a neutral technical intermediary (“mere conduit”) within
                the meaning of applicable EU law. While we cannot monitor encrypted
                content, we will comply with valid legal orders from EU authorities
                to block access to specific resources.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Right of Withdrawal */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                4. Right of Withdrawal (EU Consumers)
              </h2>
              <p>
                By using our Service to create a Note, you expressly request the
                immediate performance of the service. You acknowledge that you lose
                your right of withdrawal once the digital content has been fully
                rendered or the Note has been created and shared.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Service Availability */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                5. Service Availability
              </h2>
              <p className="mb-3">
                We strive to keep PrivateNote.ai available at all times, but the
                service is provided on an <strong>“as is”</strong> and{" "}
                <strong>“as available”</strong> basis.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue parts of
                the service at any time for security, legal, or operational reasons.
              </p>
            </div>
          </div>
        </section>

        {/* 6. AI Features */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg shrink-0">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                6. AI Features
              </h2>
              <p className="mb-3">
                Optional AI-powered features are provided for convenience only. Any
                output generated by AI does not constitute legal, medical, or
                professional advice.
              </p>
              <p className="text-sm">
                You remain solely responsible for the content you submit to AI
                features and for how you use any generated output.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                7. Liability Limits
              </h2>
              <p className="mb-3">
                Under Luxembourg law, we are liable for damages resulting from gross
                negligence or willful misconduct.
              </p>
              <p className="text-sm">
                However, to the extent permitted by law, PrivateNote.ai is not liable
                for any indirect losses, loss of data caused by user error, or
                unauthorized access to your devices. We do not guarantee 100% uptime.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Governing Law & Dispute Resolution */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                8. Governing Law & Jurisdiction
              </h2>
              <p className="mb-4">
                These terms are governed by the laws of the{" "}
                <strong>Grand Duchy of Luxembourg</strong>. Any disputes shall be
                subject to the exclusive jurisdiction of the competent courts in
                Luxembourg City.
              </p>

              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-bold mb-2 uppercase flex items-center gap-2">
                  Online Dispute Resolution (ODR)
                </h3>
                <p className="text-sm mb-3">
                  The Online Dispute Resolution (ODR) platform is now closed.
                  For consumer assistance, please visit:
                </p>
                <a
                  href="https://consumer-redress.ec.europa.eu/index_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium flex items-center hover:underline"
                >
                  https://consumer-redress.ec.europa.eu/index_en{" "}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 mb-2 font-medium">
            Pupin Labs
          </p>
          <p className="text-sm text-gray-500 mb-2">
            62 Rue Marie-Adelaide, 2128, Luxembourg, Luxembourg
          </p>
          <a
            href="mailto:legal@privatenote.ai"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            <Gavel className="h-4 w-4 mr-2" />
            legal@privatenote.ai
          </a>
        </div>
      </div>
    </div>
  );
}
