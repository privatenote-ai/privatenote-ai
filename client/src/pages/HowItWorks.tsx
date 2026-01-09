import React from 'react';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Key, 
  Server, 
  Globe, 
  Zap, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code,
  Database,
  Cloud,
  Cpu
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">How It Works</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A deep dive into PrivateNote.ai's architecture, encryption, and security model
        </p>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        {/* Overview */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <Globe className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Architecture Overview</h2>
              <p className="mb-4">
                PrivateNote.ai is built on Cloudflare's edge network, combining client-side encryption 
                with serverless infrastructure to provide secure, ephemeral note sharing.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Client-Side Encryption</h3>
                  </div>
                  <p className="text-sm">All encryption happens in your browser before data leaves your device</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Cloud className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Cloudflare Edge</h3>
                  </div>
                  <p className="text-sm">Global edge network for low latency and high availability</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Database className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Durable Objects</h3>
                  </div>
                  <p className="text-sm">Stateful coordination for read limits and expiration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Encryption Flow */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <Key className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Encryption Flow</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                    Key Generation
                  </h3>
                  <p className="text-sm ml-8">
                    Browser generates a random 256-bit AES-GCM encryption key using the Web Crypto API. 
                    The key is encoded in Base58 for URL-friendly sharing.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                    Content Encryption
                  </h3>
                  <p className="text-sm ml-8">
                    Note content is encrypted using AES-GCM with a randomly generated 12-byte IV (initialization vector). 
                    The encrypted data and IV are converted to Base64 for transmission.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                    Server Storage
                  </h3>
                  <p className="text-sm ml-8">
                    Only encrypted data is sent to the server. The encryption key is shared via URL fragment 
                    (never sent to server). Server stores encrypted ciphertext in Cloudflare KV with automatic TTL expiration.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                    Decryption
                  </h3>
                  <p className="text-sm ml-8">
                    Recipient uses the encryption key from the URL fragment to decrypt the content entirely in their browser. 
                    Plaintext never leaves the browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cryptography Details */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <Code className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Cryptography Specifications</h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Encryption Algorithm</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>AES-GCM</strong> (Advanced Encryption Standard - Galois/Counter Mode)</li>
                    <li>Key size: <strong>256-bit</strong> (32 bytes)</li>
                    <li>IV size: <strong>12 bytes</strong> (96 bits) - randomly generated per encryption</li>
                    <li>Mode: <strong>Authenticated encryption</strong> (detects tampering)</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Password Protection (Optional)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>PBKDF2</strong> (Password-Based Key Derivation Function 2)</li>
                    <li>Hash function: <strong>SHA-256</strong></li>
                    <li>Iterations: <strong>310,000</strong> (high iteration count for security)</li>
                    <li>Salt: <strong>16-byte random salt</strong> (generated per note)</li>
                    <li><strong>Double encryption:</strong> Content encrypted with random key, then key encrypted with password-derived key</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Key Sharing</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Keys encoded in <strong>Base58</strong> for URL-friendly representation</li>
                    <li>Keys passed via <strong>URL fragment</strong> (never sent to server)</li>
                    <li>Fragment removed from browser history immediately after extraction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cloudflare Infrastructure */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
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
                  <p className="text-sm mb-2">
                    Stateful coordination for note metadata and access control:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm ml-7">
                    <li>Manages note metadata (expiry, read count) in SQLite database</li>
                    <li>Ensures strong consistency for read limits and expiration checks</li>
                    <li>Prevents race conditions in concurrent access</li>
                    <li>Each note ID maps to a single Durable Object instance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Database className="h-5 w-5 text-primary mr-2" />
                    KV Storage
                  </h3>
                  <p className="text-sm mb-2">
                    Encrypted blob storage for note ciphertext:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm ml-7">
                    <li>Stores encrypted ciphertext (the actual encrypted note content)</li>
                    <li>Automatic expiration via TTL (Time-To-Live)</li>
                    <li>Encrypted data is opaque to Cloudflare (they can't read it)</li>
                    <li>Distributed across Cloudflare's global network</li>
                    <li>Automatic deletion when TTL expires</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    Workers API
                  </h3>
                  <p className="text-sm mb-2">
                    Serverless API layer with security features:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm ml-7">
                    <li><strong>Rate limiting:</strong> 20 requests per minute per IP address</li>
                    <li><strong>CORS restrictions:</strong> Only approved origins can access API</li>
                    <li><strong>Cloudflare Turnstile:</strong> Bot protection for AI features. The script loads globally for convenience, but tokens are only required for AI mode requests.</li>
                    <li>Runs on Cloudflare's global edge network for low latency</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client-Side Security */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Client-Side Security Measures</h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Content Security Policy (CSP)
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Strict CSP headers prevent unauthorized script execution and reduce XSS attack surface. 
                    Blocks inline scripts (except styles needed for React) and restricts resource loading to approved sources.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Subresource Integrity (SRI)
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    We self-host fonts and avoid external CDNs on note pages. The only external script is
                    Cloudflare Turnstile for AI features, which is loaded without SRI due to its dynamic URLs.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    No Third-Party Analytics
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Note viewing pages load no tracking scripts or analytics. Server-side analytics are 
                    admin-only and don't track individual users.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Fragment-Based Keys
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Encryption keys are passed via URL fragments (never sent to server) and immediately 
                    removed from browser history after extraction.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 flex items-center text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    AI Prompt Handling
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    AI mode sends your prompt to our Worker for processing and Turnstile verification. We do not store
                    prompts and avoid logging request bodies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Security Limitations</h2>
              <p className="mb-4">
                Even with perfect cryptography, client-side encryption has inherent limitations:
              </p>
              
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <XCircle className="h-5 w-5 mr-2" />
                    Compromised JavaScript Delivery
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    If our JavaScript is compromised (supply chain attack, CDN compromise, XSS), 
                    malicious code could potentially read encryption keys from URL fragments.
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Mitigations:</strong> CSP, SRI, no third-party analytics, rate limiting, CORS restrictions
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <XCircle className="h-5 w-5 mr-2" />
                    Browser Extensions
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Malicious browser extensions could intercept or modify page content, potentially 
                    reading keys or plaintext from memory.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold mb-2 flex items-center text-yellow-700 dark:text-yellow-300">
                    <XCircle className="h-5 w-5 mr-2" />
                    Compromised Device
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Malware on your device could read keys from memory, screen, or clipboard. 
                    Always use trusted devices for sensitive content.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Use password-protected notes for highly sensitive content</li>
                  <li>Verify the URL matches <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">privatenote.ai</code></li>
                  <li>Check browser console for unexpected errors</li>
                  <li>Use a privacy-focused browser with script blocking</li>
                  <li>Avoid accessing notes on shared or untrusted devices</li>
                  <li>Keep your browser and operating system updated</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Flow Diagram */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <Eye className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-medium mb-3">Data Flow</h2>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">[Browser]</span>
                  <span>Generate 256-bit AES-GCM key</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Encrypt content with key + random IV</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Send encrypted data + IV to server</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">[Cloudflare Worker]</span>
                  <span>Rate limiting check → CORS validation</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Store metadata in Durable Object (SQLite)</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Store encrypted ciphertext in KV (with TTL)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">[Recipient Browser]</span>
                  <span>Extract key from URL fragment</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Fetch encrypted data from server</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Decrypt content in browser (plaintext never leaves browser)</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-400">↓</span>
                  <span>Note consumed → Automatic deletion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learn More */}
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-3">Learn More</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="text-primary hover:underline text-sm"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="text-primary hover:underline text-sm"
            >
              Terms of Use →
            </Link>
            <Link
              href="/security-resources"
              className="text-primary hover:underline text-sm"
            >
              Security Resources →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
