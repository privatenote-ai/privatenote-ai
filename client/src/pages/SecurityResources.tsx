import React from 'react';
import { Link } from 'wouter';
import { motion, MotionConfig } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Database,
  Key,
  Binary,
  Layers,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Check,
} from 'lucide-react';

const SecurityOverview: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="container mx-auto max-w-6xl px-4 py-16 mb-24 relative">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-10 pb-2 leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 relative z-10">
            Security <span className="text-primary italic text-5xl md:text-7xl">Architecture.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
            Technical specifications on our Client-Side Encryption (CSE) protocols and trustless storage infrastructure.
          </p>
        </div>

        <div className="grid gap-20">

          {/* 1. Core Architecture Section */}
          <section className="relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Layers className="h-64 w-64 text-primary" />
            </div>

            <div className="relative z-10 space-y-24">
              <div className="text-center max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">E2EE Model</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We utilize an End-to-End Encrypted (E2EE) model where the server is treated as an untrusted storage medium. Plaintext content is never transmitted.
                </p>
                <p className="mt-3 text-sm text-amber-800/90 dark:text-amber-200/90">
                  AI mode is an exception: your prompt is sent to our AI provider to generate a response.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Client-Side Encryption</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Encryption occurs in your browser's memory using the Web Crypto API. The server only sees the resulting ciphertext blob.
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Atomic State Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Cloudflare Durable Objects provide atomic consistency for read-once logic, preventing race conditions and double-consumption.
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Key className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Key Handling</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Decryption keys are generated locally in your browser using the Web Crypto API’s cryptographically secure random source and encoded in Base58 for safe transmission.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Cryptographic Specifications */}
          <section className=" py-10 max-w-4xl mx-auto">
            <div className="rounded-[2rem] bg-blue-600 text-white p-8 md:p-10 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                  <Binary className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">Cryptographic Primitives</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-white/80 font-bold text-xs uppercase tracking-widest mb-4">Symmetric Encryption</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">AES-256-GCM</span>
                      <span className="text-xs text-blue-100 mt-1 leading-relaxed">Authenticated encryption with 128-bit auth tags. This prevents ciphertext manipulation by the server or middle-men.</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">12-Byte Cryptographic IV</span>
                      <span className="text-xs text-blue-100 mt-1">Unique Initialization Vectors prevent pattern recognition across multiple notes.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white/80 font-bold text-xs uppercase tracking-widest mb-4">Key Derivation (KDF)</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">PBKDF2-HMAC-SHA256</span>
                      <span className="text-xs text-blue-100 mt-1 leading-relaxed">310,000 iterations for password-protected notes, making brute-force attacks computationally expensive.</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">16-Byte Cryptographic Salt</span>
                      <span className="text-xs text-blue-100 mt-1">Unique salt per note ensures protection against rainbow table attacks.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>



          {/* 3. Operational Security Section */}
          <section className="flex flex-col gap-12 py-10">
            <div className="w-full lg:w-1/2 lg:self-start border border-blue-200 dark:border-blue-800 rounded-[2rem]">
              <div className="px-6 sm:px-8 lg:px-10 py-12 md:py-12">
                <motion.h2
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  Infrastructure
                </motion.h2>
                <div className="space-y-5">
                  {[
                    {
                      title: "Strict CSP Policy",
                      body: "Content Security Policy blocks third-party scripts and cross-site injections.",
                    },
                    {
                      title: "No Tracking Cookies",
                      body: "Stateless API. No advertising or tracking pixels ever loaded.",
                    },
                    {
                      title: "Turnstile Verification",
                      body: "Human-only request verification prevents brute-force note enumeration.",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
                    >
                      <h4 className="font-semibold text-base text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{item.body}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[52%] lg:self-end border border-blue-200 dark:border-blue-800 rounded-[2rem] p-6 sm:p-8">
              <motion.h2
                className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Threat Model
              </motion.h2>
              <motion.p
                className="text-base text-gray-600 dark:text-gray-400 mb-6 italic"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              >
                No system is unbreakable. Our architecture addresses server-side threats, but client-side risks remain:
              </motion.p>
              <div className="space-y-4 w-full">
                {[
                  { label: "Device Compromise", sub: "Malware can access browser RAM or screen content." },
                  { label: "Browser Extensions", sub: "Extensions with broad permissions can read page data." },
                  { label: "Bundle Manipulation", sub: "Compromised JS delivery could leak decryption keys." },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="text-base"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + idx * 0.06 }}
                  >
                    <span className="font-semibold block text-gray-900 dark:text-white">{item.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.sub}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Footer & Trust Footer */}
          <div className="p-12 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Technical Integrity</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">We prioritize clarity and measurable security guarantees over marketing claims.</p>
            </div>
            <Link
              href="/"
              className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              Start Secure Session
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default SecurityOverview;
