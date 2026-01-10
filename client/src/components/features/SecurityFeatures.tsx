import React from 'react';
import { Lock, Timer, Shield, DollarSign, Zap } from 'lucide-react';

// Define the feature data for reuse
const features = [
  {
    title: "Authenticated Encryption",
    description: "AES-GCM in the browser. The server never sees the key or plaintext.",
    icon: <Lock className="h-6 w-6 text-primary" />
  },
  {
    title: "Self-Destructing Notes",
    description: "Read-once by default, with expiry you control: minutes, hours, or days.",
    icon: <Timer className="h-6 w-6 text-primary" />
  },
  {
    title: "One Link, No Accounts",
    description: "Create a note, share the link, done. No sign‑ups, no friction.",
    icon: <Shield className="h-6 w-6 text-primary" />
  },
  {
    title: "Privacy, Not Paywalls",
    description: "Core security is free. No subscriptions needed to keep notes protected.",
    icon: <DollarSign className="h-6 w-6 text-primary" />
  },
  {
    title: "Password‑Protected (Optional)",
    description: "Add a password to lock the encryption key with a second layer.",
    icon: <Zap className="h-6 w-6 text-primary" />
  },
  {
    title: "Post‑Quantum by Design",
    description: "Notes are protected by symmetric encryption; only the key matters.",
    icon: <Shield className="h-6 w-6 text-primary" />
  }
];

export const SecurityFeatures: React.FC = () => {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Key Features</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Practical security, explained plainly.
        </p>
      </div>
      
      {/* Card grid for medium+ screens, hidden on extra small screens */}
      <div className="hidden sm:grid grid-cols-2 gap-5 md:grid-cols-3 xl:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-xl shadow-md p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      
      {/* List view for extra small screens only */}
      <div className="sm:hidden space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start p-4 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-lg shadow-sm transition-transform duration-200 active:scale-[0.99]">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
        Built for privacy-first sharing — no tracking, no ads, no data resale.
      </div>
    </section>
  );
};
