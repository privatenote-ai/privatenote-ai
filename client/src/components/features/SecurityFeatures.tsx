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
      title: t.featurePostQuantumTitle,
      description: t.featurePostQuantumDescription,
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
      <div className="hidden sm:grid grid-cols-2 gap-5 md:grid-cols-3 xl:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700/70 rounded-xl shadow-md p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
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
          <div
            key={index}
            className="group relative overflow-hidden flex items-start p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700/70 rounded-lg shadow-sm transition-transform duration-200 active:scale-[0.99]"
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
