import React from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Globe,
  Lock,
  Cloud,
  Database,
  Key,
  Code,
  Server,
  Cpu,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const SecurityResources: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 mt-12 mb-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-3">Security Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Architecture, cryptography, and operational controls that keep notes private.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3 mb-4">
            <Globe className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Architecture Overview</h2>
              <p className="mb-4">
                PrivateNote.ai runs on Cloudflare&apos;s edge network. Notes are encrypted in the browser and stored as ciphertext.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Client-Side Encryption</h3>
                  </div>
                  <p className="text-sm">All encryption happens before data leaves your device.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center mb-2">
                    <Cloud className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Cloudflare Edge</h3>
                  </div>
                  <p className="text-sm">Global edge network for low latency and availability.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center mb-2">
                    <Database className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Durable Objects</h3>
                  </div>
                  <p className="text-sm">Strong consistency for read limits and expiration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3 mb-4">
            <Key className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Encryption Flow</h2>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <strong>Key generation:</strong> Browser generates a random 256-bit AES-GCM key (Web Crypto).
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <strong>Encrypt locally:</strong> Note content is encrypted with a random 12-byte IV.
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <strong>Store ciphertext:</strong> Only encrypted data and IV are sent to the server; the key stays in the URL fragment.
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <strong>Decrypt locally:</strong> The recipient decrypts in the browser with the fragment key.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3 mb-4">
            <Code className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Cryptography Specifications</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Encryption Algorithm</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>AES-GCM</strong> authenticated encryption</li>
                    <li>Key size: <strong>256-bit</strong></li>
                    <li>IV size: <strong>12 bytes</strong> per encryption</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Password Protection (Optional)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>PBKDF2</strong> with SHA-256</li>
                    <li>Iterations: <strong>310,000</strong></li>
                    <li>Salt: <strong>16 bytes</strong> random per note</li>
                    <li>Key wrapped with AES-GCM</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Key Handling</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Keys encoded in <strong>Base58</strong> for URL safety</li>
                    <li>Keys sent via <strong>URL fragment</strong> only</li>
                    <li>Fragment removed from history after extraction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3 mb-4">
            <Server className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Cloudflare Infrastructure</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Cpu className="h-5 w-5 text-primary mr-2" />
                    Durable Objects
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm ml-7">
                    <li>Metadata stored in SQLite</li>
                    <li>Strong consistency for read limits</li>
                    <li>Prevents race conditions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Database className="h-5 w-5 text-primary mr-2" />
                    KV Storage
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm ml-7">
                    <li>Ciphertext stored with TTL</li>
                    <li>Opaque to Cloudflare</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    Workers API
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm ml-7">
                    <li>Rate limiting: 10 requests per minute per IP</li>
                    <li>CORS allowlist</li>
                    <li>Turnstile for AI endpoints</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Client-Side Protections</h2>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Content Security Policy
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Strict CSP blocks inline scripts and limits resource origins.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Self-Hosted Fonts
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Fonts are served locally; no external font CDNs on note pages.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    No Third-Party Analytics
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    No client-side tracking scripts. Server metrics are aggregate only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Security Limitations</h2>
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <XCircle className="h-5 w-5 mr-2" />
                    Compromised JavaScript Delivery
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    If the client bundle is compromised, an attacker could read fragments or plaintext in memory.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <XCircle className="h-5 w-5 mr-2" />
                    Browser Extensions
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Extensions can observe or modify page content.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <XCircle className="h-5 w-5 mr-2" />
                    Compromised Device
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Malware can access keys from memory, screen, or clipboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityResources;
