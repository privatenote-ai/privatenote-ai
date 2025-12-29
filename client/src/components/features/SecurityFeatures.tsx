import React from 'react';
import { Lock, Timer, Shield, DollarSign, Zap } from 'lucide-react';

// Define the feature data for reuse
const features = [
  {
    title: "End-to-End Encryption",
    description: "Your note is encrypted in your browser before being sent to our servers. We never see your unencrypted data.",
    icon: <Lock className="h-6 w-6 text-primary" />
  },
  {
    title: "Self-Destructing",
    description: "Once read, the note is permanently deleted from our servers. Notes automatically expire after 24 hours.",
    icon: <Timer className="h-6 w-6 text-primary" />
  },
  {
    title: "Easy to Use",
    description: "Simple interface makes sharing secure notes quick and intuitive. No technical knowledge required.",
    icon: <Shield className="h-6 w-6 text-primary" />
  },
  {
    title: "Free for All",
    description: "All core security features are completely free. No subscriptions or payment required to keep your data safe.",
    icon: <DollarSign className="h-6 w-6 text-primary" />
  },
  {
    title: "Write with AI",
    description: "Create notes with AI assistance for speed and precision. Improve, summarize, or secure your content with a click.",
    icon: <Zap className="h-6 w-6 text-primary" />
  }
];

export const SecurityFeatures: React.FC = () => {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
        Key Features
      </h2>
      
      {/* Card grid for medium+ screens, hidden on extra small screens */}
      <div className="hidden sm:grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5 xl:gap-6">
        {features.map((feature, index) => (
          <div key={index} className="backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-xl shadow-md p-5">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
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
          <div key={index} className="flex items-start p-4 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-lg shadow-sm">
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
    </section>
  );
};
