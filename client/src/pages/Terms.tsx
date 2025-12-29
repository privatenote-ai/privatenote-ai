import React from 'react';
import { Link } from 'wouter';
import { FileText, ArrowLeft, AlertTriangle, Shield, Scale } from 'lucide-react';

export default function Terms() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
        <p className="text-gray-600 dark:text-gray-400">Last updated: March 25, 2025</p>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <FileText className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Service Agreement</h2>
              <p>
                By using privateNote.ai, you agree to these Terms of Use. 
                Our service provides encrypted, temporary note sharing with no 
                guarantees of permanent availability. We reserve the right to 
                modify these terms at any time.
              </p>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <Shield className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Acceptable Use</h2>
              <p className="mb-3">
                You agree not to use privateNote.ai for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Any illegal activities</li>
                <li>Sharing harmful content or malware</li>
                <li>Harassing others or sending unsolicited messages</li>
                <li>Attempting to bypass security measures</li>
                <li>Any activities that could disrupt our service</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <AlertTriangle className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Limitations of Liability</h2>
              <p>
                privateNote.ai provides this service "as is" with no warranties or guarantees. 
                We are not liable for any damages resulting from your use of our service, 
                including but not limited to data loss, service interruptions, or security breaches. 
                While we implement strong encryption, no digital system can guarantee 100% security.
              </p>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <Scale className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law principles. You agree to submit to the personal 
                and exclusive jurisdiction of the courts located within the applicable jurisdiction.
              </p>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-2">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <a href="mailto:support@privatenote.ai" className="text-primary hover:underline ml-1">
              support@privatenote.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}