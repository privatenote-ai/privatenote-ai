import React from 'react';
import { Link } from 'wouter';
import { Shield, Eye, Lock, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">Last updated: March 25, 2025</p>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <Shield className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Our Commitment to Privacy</h2>
              <p>
                At privateNote.ai, privacy isn't just a feature—it's our foundation. 
                We've built our service with end-to-end encryption to ensure your notes 
                remain private and secure.
              </p>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <Lock className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">Data Collection</h2>
              <p className="mb-3">
                We collect minimal information to provide our service:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Encrypted notes</strong>: Your notes are encrypted in your browser 
                  before being stored. We cannot access the content.
                </li>
                <li>
                  <strong>Access statistics</strong>: We track how many times a note has been viewed 
                  (without identifying who viewed it).
                </li>
                <li>
                  <strong>Basic usage information</strong>: Anonymous metrics to improve our service.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <Eye className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">How We Use Your Information</h2>
              <p className="mb-3">
                We use the limited information we collect solely to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide and maintain our service</li>
                <li>Delete notes after they expire or reach their view limit</li>
                <li>Improve the user experience</li>
                <li>Protect against security threats and abuse</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-2">Privacy Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Client-side encryption</strong>: All encryption happens in your browser
            </li>
            <li>
              <strong>Auto-deletion</strong>: Notes are permanently deleted after being viewed or after they expire
            </li>
            <li>
              <strong>No account required</strong>: Use our service without providing personal information
            </li>
            <li>
              <strong>No tracking cookies</strong>: We don't use third-party analytics or tracking cookies
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}