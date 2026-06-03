import React from 'react';
import { Lock, Timer, Shield, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type SecurityFeaturesProps = {
  className?: string;
};

export const SecurityFeatures: React.FC<SecurityFeaturesProps> = ({ className }) => {
  const { t } = useLanguage();
  const features = [
    {
      title: t.featurePrivateAiTitle,
      description: t.featurePrivateAiDescription,
      icon: <Lock className="h-6 w-6 text-primary" />
    },
    {
      title: t.featureSelfDestructTitle,
      description: t.featureSelfDestructDescription,
      icon: <Timer className="h-6 w-6 text-primary" />
    },
    {
      title: t.featureOneLinkTitle,
      description: t.featureOneLinkDescription,
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      title: t.featurePrivacyNotPaywallsTitle,
      description: t.featurePrivacyNotPaywallsDescription,
      icon: <DollarSign className="h-6 w-6 text-primary" />
    },
    {
      title: t.featureZeroTrackingTitle,
      description: t.featureZeroTrackingDescription,
      icon: <Zap className="h-6 w-6 text-primary" />
    },
    {
      title: t.featureEuStorageTitle,
      description: t.featureEuStorageDescription,
      icon: <Shield className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className={cn('relative px-4 py-10 sm:px-6 sm:py-12 lg:px-8', className)}>
      <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t.keyFeatures}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {t.keyFeaturesSubtitle}
        </p>
      </div>
      
      {/* Card grid for medium+ screens, hidden on extra small screens */}
      <div className="hidden sm:grid grid-cols-2 items-stretch gap-5 md:grid-cols-3 xl:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative isolate flex h-full min-h-[204px] transform-gpu flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white p-5 shadow-sm transition-[transform,border-color,background-color] duration-200 ease-out hover:translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.015] dark:border-gray-700/70 dark:bg-gray-900 dark:hover:bg-primary/[0.04]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
              <div className="absolute inset-x-0 top-0 h-px bg-primary/25" />
            </div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      
      {/* List view for extra small screens only */}
      <div className="sm:hidden space-y-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative flex min-h-[112px] items-start overflow-hidden rounded-lg border border-gray-200/70 bg-white p-4 shadow-sm transition-[border-color,box-shadow] duration-200 ease-out active:shadow-md dark:border-gray-700/70 dark:bg-gray-900"
          >
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
        {t.featuresFooter}
      </div>
      </div>
    </div>
  );
};
