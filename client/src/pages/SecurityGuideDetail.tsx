import React from 'react';
import { useRoute } from 'wouter';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';
import { 
  ChevronLeft, 
  ExternalLink, 
  Shield, 
  Lock, 
  Globe, 
  Smartphone, 
  Mail,
  Search
} from 'lucide-react';

const SecurityGuideDetail: React.FC = () => {
  const { language } = useLanguage();
  const [, params] = useRoute('/security-guides/:topicId');
  const topicId = params?.topicId || '';

  // Mock content for each guide topic
  const guides: Record<string, {
    title: string;
    icon: React.ReactNode;
    description: string;
    sections: Array<{
      title: string;
      content: string;
      link?: string;
      linkText?: string;
    }>;
  }> = {
    vpn: {
      title: 'VPN Services Guide',
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      description: 'Learn how to protect your internet browsing with a Virtual Private Network (VPN).',
      sections: [
        {
          title: 'What is a VPN?',
          content: 'A Virtual Private Network (VPN) encrypts your internet connection, hiding your IP address and protecting your online activity from ISPs, hackers, and other third parties.',
        },
        {
          title: 'Why Use a VPN?',
          content: 'VPNs help protect your privacy on public Wi-Fi, prevent tracking by websites and advertisers, bypass geographical restrictions, and reduce the risk of data theft.',
        },
        {
          title: 'Recommended VPN Providers',
          content: 'We recommend privacy-focused VPN services that have been independently audited, maintain a strict no-logs policy, and offer strong encryption.',
          link: 'https://protonvpn.com/',
          linkText: 'ProtonVPN - Swiss-based privacy-focused VPN',
        }
      ],
    },
    password: {
      title: 'Password Managers Guide',
      icon: <Lock className="h-8 w-8 text-indigo-500" />,
      description: 'Learn how to securely store and generate strong passwords.',
      sections: [
        {
          title: 'Why Password Managers are Essential',
          content: 'Password managers help you create unique, complex passwords for every site, remember them for you, and automatically fill them in when needed, drastically improving your security.',
        },
        {
          title: 'How Password Managers Work',
          content: 'Password managers encrypt your password vault with a master password. They can sync across devices, generate random passwords, and autofill credentials on websites and apps.',
        },
        {
          title: 'Recommended Password Managers',
          content: 'Look for open-source options with robust security features, cross-platform compatibility, and regular security audits.',
          link: 'https://bitwarden.com/',
          linkText: 'Bitwarden - Open-source password management',
        }
      ],
    },
    messenger: {
      title: 'Secure Messaging Guide',
      icon: <Smartphone className="h-8 w-8 text-green-500" />,
      description: 'Protect your conversations with end-to-end encrypted messaging apps.',
      sections: [
        {
          title: 'Why Secure Messaging Matters',
          content: 'Standard SMS and many popular messaging apps don\'t provide adequate privacy. Secure messaging apps use end-to-end encryption to ensure only you and your recipient can read messages.',
        },
        {
          title: 'Features to Look For',
          content: 'The best secure messaging apps offer end-to-end encryption by default, minimal metadata collection, open-source code for verification, and security features like disappearing messages.',
        },
        {
          title: 'Recommended Messaging Apps',
          content: 'Choose apps with a proven track record, independent security audits, and strong encryption protocols.',
          link: 'https://signal.org/',
          linkText: 'Signal - Secure messaging with privacy focus',
        }
      ],
    },
    email: {
      title: 'Secure Email Guide',
      icon: <Mail className="h-8 w-8 text-purple-500" />,
      description: 'Protect your email communications from surveillance and data mining.',
      sections: [
        {
          title: 'The Problem with Standard Email',
          content: 'Traditional email services often scan message content for advertising purposes, store emails unencrypted, and may comply with broad surveillance requests.',
        },
        {
          title: 'Encrypted Email Options',
          content: 'Secure email providers offer end-to-end encryption, zero-access encryption (where the provider can\'t read your emails), and minimal data collection.',
        },
        {
          title: 'Recommended Email Providers',
          content: 'Look for providers that prioritize privacy, offer encryption, and ideally have open-source clients.',
          link: 'https://proton.me/mail',
          linkText: 'ProtonMail - Encrypted email service',
        }
      ],
    },
    browser: {
      title: 'Privacy Browsers Guide',
      icon: <Search className="h-8 w-8 text-orange-500" />,
      description: 'Browse the web without being tracked by advertisers and data collectors.',
      sections: [
        {
          title: 'Browser Privacy Concerns',
          content: 'Standard browsers often track your activity, build profiles on your interests, and share data with advertisers and third parties.',
        },
        {
          title: 'Essential Privacy Browser Features',
          content: 'Look for browsers with built-in tracking protection, fingerprinting resistance, HTTPS-only mode, and cookie controls.',
        },
        {
          title: 'Recommended Privacy Browsers',
          content: 'Privacy-focused browsers offer built-in protection from tracking and surveillance.',
          link: 'https://www.torproject.org/',
          linkText: 'Tor Browser - Maximum anonymity browser',
        }
      ],
    },
    // Additional guide content could be added for other topics...
  };

  const guide = guides[topicId] || {
    title: 'Guide Not Found',
    icon: <Shield className="h-8 w-8 text-gray-500" />,
    description: 'The requested guide could not be found.',
    sections: [{
      title: 'Error',
      content: 'Sorry, we couldn\'t find information on this security topic. Please check the URL or return to the security resources page.'
    }]
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-12">
        <Link
          href={localizedPath('/security-resources', language)}
          className="inline-flex items-center text-sm font-semibold text-primary hover:gap-2 transition-all mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Security Resources
        </Link>

        <div className="flex items-center justify-center mb-4">
          {guide.icon}
          <h1 className="page-title ml-3 text-gray-900 dark:text-white">
            {guide.title}
          </h1>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {guide.description}
        </p>
      </div>

      <div className="space-y-10 mb-16">
        {guide.sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-gray-200/40 dark:shadow-none p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{section.content}</p>

            {section.link && (
              <a
                href={section.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline font-medium"
              >
                {section.linkText || 'Learn more'}
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 p-6 md:p-8 mb-12">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Explore Other Security Topics</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(guides).map(([id, content]) => (
            id !== topicId && (
              <Link
                key={id}
                href={`/security-guides/${id}`}
                className="px-4 py-2 bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {content.title}
              </Link>
            )
          ))}
          <Link
            href={localizedPath('/security-resources', language)}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
          >
            View All Resources
          </Link>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This guide is provided for educational purposes. We may earn a commission from affiliate links
          when you use our recommended services, which helps support this free privacy resource.
        </p>
      </div>
    </div>
  );
};

export default SecurityGuideDetail;
