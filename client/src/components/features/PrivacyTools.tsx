import React from 'react';
import { Link } from 'wouter';
import { Shield, Lock, Eye, Key, BookOpen, ArrowRight, FileText, Download } from 'lucide-react';

// Category card for privacy tools and resources
interface PrivacyCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

// Resources in each category
interface PrivacyResource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

// Privacy tool categories in Cloudflare Learning Center style
const privacyCategories: PrivacyCategory[] = [
  {
    id: 'encryption',
    title: 'Encryption Basics',
    description: 'Learn how encryption protects your data and communications',
    icon: <Lock className="h-8 w-8" />,
    color: 'bg-orange-500',
    link: '/privacy/encryption'
  },
  {
    id: 'privacy-browsing',
    title: 'Private Browsing',
    description: 'Tools and techniques for maintaining privacy online',
    icon: <Eye className="h-8 w-8" />,
    color: 'bg-blue-500',
    link: '/privacy/browsing'
  },
  {
    id: 'password-security',
    title: 'Password Security',
    description: 'Best practices for creating and managing secure passwords',
    icon: <Key className="h-8 w-8" />,
    color: 'bg-green-500',
    link: '/privacy/passwords'
  },
  {
    id: 'security-glossary',
    title: 'Security Glossary',
    description: 'Common terms and concepts in digital privacy and security',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-purple-500',
    link: '/privacy/glossary'
  },
  {
    id: 'data-protection',
    title: 'Data Protection',
    description: 'How to protect your personal information from breaches',
    icon: <Shield className="h-8 w-8" />,
    color: 'bg-red-500',
    link: '/privacy/data-protection'
  },
  {
    id: 'privacy-guides',
    title: 'Privacy Guides',
    description: 'Step-by-step guides for enhancing your digital privacy',
    icon: <FileText className="h-8 w-8" />,
    color: 'bg-teal-500',
    link: '/privacy/guides'
  }
];

// Featured and latest privacy resources
const privacyResources: PrivacyResource[] = [
  {
    id: 'encryption-1',
    title: 'How End-to-End Encryption Works',
    description: 'A visual guide to understanding how E2EE protects your messages',
    category: 'encryption',
    link: '/privacy/encryption/e2ee'
  },
  {
    id: 'encryption-2',
    title: 'Symmetric vs. Asymmetric Encryption',
    description: 'Understanding the two main types of encryption algorithms',
    category: 'encryption',
    link: '/privacy/encryption/types'
  },
  {
    id: 'privacy-browsing-1',
    title: 'VPN vs. Proxy: Which to Choose',
    description: 'Compare different tools for anonymous browsing',
    category: 'privacy-browsing',
    link: '/privacy/browsing/vpn-proxy'
  },
  {
    id: 'privacy-browsing-2',
    title: 'Browser Fingerprinting Protection',
    description: 'How to prevent websites from uniquely identifying your browser',
    category: 'privacy-browsing',
    link: '/privacy/browsing/fingerprinting'
  },
  {
    id: 'password-security-1',
    title: 'Password Managers Explained',
    description: 'How password managers work and why you should use one',
    category: 'password-security',
    link: '/privacy/passwords/managers'
  },
  {
    id: 'password-security-2',
    title: 'Creating Strong Memorable Passwords',
    description: 'Techniques for creating passwords that are both secure and memorable',
    category: 'password-security',
    link: '/privacy/passwords/creation'
  },
  {
    id: 'data-protection-1',
    title: 'Data Breach Response Plan',
    description: 'Steps to take if your personal information is compromised',
    category: 'data-protection',
    link: '/privacy/data-protection/breach-response'
  },
  {
    id: 'data-protection-2',
    title: 'Secure Deletion of Data',
    description: 'Ensuring your deleted files stay deleted',
    category: 'data-protection',
    link: '/privacy/data-protection/secure-deletion'
  },
];

// Free digital privacy tools list
interface PrivacyTool {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
}

const freePrivacyTools: PrivacyTool[] = [
  {
    id: 'tool-1',
    name: 'Signal',
    description: 'Encrypted messaging app for secure communications',
    category: 'messaging',
    link: 'https://signal.org/'
  },
  {
    id: 'tool-2',
    name: 'Bitwarden',
    description: 'Free, open-source password manager',
    category: 'password',
    link: 'https://bitwarden.com/'
  },
  {
    id: 'tool-3',
    name: 'Brave Browser',
    description: 'Privacy-focused web browser with built-in ad blocking',
    category: 'browser',
    link: 'https://brave.com/'
  },
  {
    id: 'tool-4',
    name: 'ProtonMail',
    description: 'Encrypted email service with end-to-end encryption',
    category: 'email',
    link: 'https://proton.me/mail'
  },
  {
    id: 'tool-5',
    name: 'VeraCrypt',
    description: 'Disk encryption software for securing files and folders',
    category: 'storage',
    link: 'https://www.veracrypt.fr/'
  },
  {
    id: 'tool-6',
    name: 'DuckDuckGo',
    description: 'Private search engine that doesn\'t track your searches',
    category: 'search',
    link: 'https://duckduckgo.com/'
  },
];

export const PrivacyTools: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary/80 to-primary text-white rounded-xl p-8 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Tools & Resources</h1>
          <p className="text-xl opacity-90 mb-6">
            Explore our curated collection of guides, tools, and resources to enhance your digital privacy and security
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#categories" 
              className="inline-flex items-center px-5 py-2.5 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Categories <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="#tools" 
              className="inline-flex items-center px-5 py-2.5 bg-primary-dark text-white font-medium rounded-lg hover:bg-primary-dark/90 transition-colors border border-white/20"
            >
              Free Privacy Tools <Download className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main categories section - Cloudflare Learning Center style */}
      <div id="categories" className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Categories</h2>
          <Link href="/privacy" className="text-primary hover:underline font-medium flex items-center">
            View all categories <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {privacyCategories.map(category => (
            <div 
              key={category.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex p-6">
                <div className={`${category.color} rounded-full p-3 mr-4 text-white flex-shrink-0`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <Link 
                    href={category.link} 
                    className="inline-flex items-center text-primary font-medium hover:underline"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured resources section */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Resources</h2>
          <Link href="/privacy/resources" className="text-primary hover:underline font-medium flex items-center">
            View all resources <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyResources.slice(0, 4).map(resource => (
            <div 
              key={resource.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                  {privacyCategories.find(cat => cat.id === resource.category)?.title}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{resource.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{resource.description}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <Link 
                  href={resource.link} 
                  className="inline-flex items-center text-primary font-medium hover:underline text-sm"
                >
                  Read article <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free tools section */}
      <div id="tools" className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Free Privacy Tools</h2>
          <Link href="/privacy/tools" className="text-primary hover:underline font-medium flex items-center">
            View all tools <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tool
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {freePrivacyTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {tool.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a 
                        href={tool.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary-dark"
                      >
                        Visit website
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Newsletter signup section */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated on Privacy Best Practices</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Subscribe to our privacy newsletter for the latest tools, guides, and security updates
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
            />
            <button 
              type="button" 
              className="px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};