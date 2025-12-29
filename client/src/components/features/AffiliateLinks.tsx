import React from 'react';
import { Link } from 'wouter';
import { 
  ExternalLink, 
  Shield, 
  Lock, 
  Globe, 
  Smartphone, 
  Mail, 
  Cloud, 
  FileKey, 
  EyeOff,
  HardDrive,
  Search,
  BookOpen
} from 'lucide-react';

interface SecurityCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  link: string;
  color: string;
}

const securityCategories: SecurityCategory[] = [
  {
    id: 'vpn',
    name: 'VPN Services',
    icon: <Globe className="h-4 w-4 text-blue-600" />,
    description: 'Private & secure internet browsing',
    link: 'https://protonvpn.com/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'password',
    name: 'Password Managers',
    icon: <Lock className="h-4 w-4 text-indigo-600" />,
    description: 'Store and generate strong passwords',
    link: 'https://bitwarden.com/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'messenger',
    name: 'Secure Messaging',
    icon: <Smartphone className="h-4 w-4 text-green-600" />,
    description: 'End-to-end encrypted communications',
    link: 'https://signal.org/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'email',
    name: 'Secure Email',
    icon: <Mail className="h-4 w-4 text-purple-600" />,
    description: 'Private email with encryption',
    link: 'https://proton.me/mail',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'browser',
    name: 'Privacy Browsers',
    icon: <Search className="h-4 w-4 text-orange-600" />,
    description: 'Browse without being tracked',
    link: 'https://www.torproject.org/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'cloud',
    name: 'Secure Cloud Storage',
    icon: <Cloud className="h-4 w-4 text-teal-600" />,
    description: 'End-to-end encrypted file storage',
    link: 'https://proton.me/drive',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'encryption',
    name: 'File Encryption',
    icon: <FileKey className="h-4 w-4 text-red-600" />,
    description: 'Protect sensitive documents',
    link: 'https://cryptomator.org/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'anonymity',
    name: 'Anonymity Tools',
    icon: <EyeOff className="h-4 w-4 text-gray-800" />,
    description: 'Maximum privacy protection',
    link: 'https://tails.boum.org/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'backup',
    name: 'Secure Backups',
    icon: <HardDrive className="h-4 w-4 text-yellow-600" />,
    description: 'Encrypted backup solutions',
    link: 'https://cryptomator.org/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
  {
    id: 'identity',
    name: 'Identity Protection',
    icon: <Shield className="h-4 w-4 text-cyan-600" />,
    description: 'Prevent identity theft',
    link: 'https://haveibeenpwned.com/',
    color: 'bg-white border border-gray-300 hover:bg-gray-50',
  },
];

// Main full-sized affiliate links component
export const AffiliateLinks: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {securityCategories.map((category) => (
          <a
            key={category.id}
            href={category.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-1.5 px-3 rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="mr-2 flex items-center justify-center w-5 h-5">{category.icon}</div>
            <h3 className="font-medium text-xs">{category.name}</h3>
          </a>
        ))}
      </div>
      
      <p className="mt-5 mb-2 text-center text-gray-700 dark:text-gray-300 text-xs">
        <Link href="/security-resources" className="inline-flex items-center text-primary hover:underline">
          <BookOpen className="h-3 w-3 mr-1" />
          View our complete security resources
        </Link>
      </p>

      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          The privacy tools listed here are recommendations based on our research. We may earn a commission
          when you sign up for paid services through our links, which helps support this free privacy tool.
        </p>
      </div>
    </div>
  );
};

// Compact version for between navbar and hero
export const CompactAffiliateLinks: React.FC = () => {
  // Only show top 5 most important security tools
  const topTools = securityCategories.slice(0, 5);
  
  return (
    <div className="py-1 px-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mr-1">
            RECOMMENDED:
          </span>
          {topTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center h-5 px-1.5 rounded-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors group"
            >
              <div className="mr-1 flex items-center justify-center">{tool.icon}</div>
              <span className="text-[10px] font-medium group-hover:text-primary transition-colors">{tool.name}</span>
            </a>
          ))}
          <Link 
            href="/security-resources"
            className="text-[10px] font-medium text-primary hover:underline ml-1 flex items-center"
          >
            <span>More</span>
            <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Medium-sized version for below hero text
export const MidSizeAffiliateLinks: React.FC = () => {
  // Show top 5 tools
  const topTools = securityCategories.slice(0, 5);
  
  return (
    <div className="py-3 px-4">
      <h3 className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
        Recommended Privacy Tools
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-3">
        {topTools.map((tool) => (
          <a
            key={tool.id}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            {/* Make the icon larger */}
            <div className="mr-2 flex items-center justify-center">
              {React.cloneElement(tool.icon as React.ReactElement, { className: "h-5 w-5" })}
            </div>
            <span className="text-sm font-medium group-hover:text-primary">{tool.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};