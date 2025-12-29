import React from 'react';
import { SecurityEducation } from '@/components/features/SecurityEducation';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';
import { AffiliateLinks } from '@/components/features/AffiliateLinks';
import { 
  Shield, 
  Lock, 
  ExternalLink 
} from 'lucide-react';

const SecurityResources: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Privacy & Security Tools</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Protect your digital life with recommended tools for maintaining privacy and security online.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Essential Privacy Tools</h2>
        <AffiliateLinks />
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-bold">Why Privacy Matters</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          In today's digital world, your personal data is constantly being collected, analyzed, and sold. 
          Taking steps to protect your privacy isn't about having something to hide—it's about maintaining 
          control over your personal information and digital identity.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Privacy Education</h2>
        <SecurityEducation />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <ExternalLink className="h-5 w-5 mr-2 text-primary" />
          Additional Resources
        </h3>
        <ul className="space-y-2">
          <li>
            <a 
              href="https://www.eff.org/issues/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              Electronic Frontier Foundation - Privacy Resources
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </li>
          <li>
            <a 
              href="https://privacytools.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              Privacy Tools - Encryption Against Global Mass Surveillance
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          The privacy tools listed on this page are recommendations based on our research.
          We may earn a commission from affiliate links, which helps support this free privacy tool.
        </p>
      </div>
    </div>
  );
};

export default SecurityResources;