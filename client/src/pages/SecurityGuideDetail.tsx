import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { joinPublicPath, localizedPath } from '@/utils/localizedPath';
import { buildDocumentTitle, setDocumentMeta } from '@/utils/documentMeta';
import { VpnServicesGuide } from '@/components/security-guides/VpnServicesGuide';
import { PasswordManagersGuide } from '@/components/security-guides/PasswordManagersGuide';
import {
  ExternalLink,
  Shield,
  Lock,
  Globe,
  Smartphone,
  Mail,
  Search,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

type GuideProvider = {
  name: string;
  tagline: string;
  description: string;
  link: string;
  highlights: string[];
};

type GuideSection = {
  title: string;
  content: string;
  bullets?: string[];
  providers?: GuideProvider[];
  callout?: { tone: 'info' | 'warning'; text: string };
  link?: string;
  linkText?: string;
  plain?: boolean;
};

type GuideContent = {
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: GuideSection[];
  showTitleIcon?: boolean;
  showBackLink?: boolean;
};

const SecurityGuideDetail: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [, params] = useRoute('/security-guides/:topicId');
  const topicId = params?.topicId || '';

  useEffect(() => {
    if (topicId === 'vpn' || topicId === 'password') return;
    if (language !== "en") {
      setLanguage("en");
    }
  }, [language, setLanguage, topicId]);

  const guides: Record<string, GuideContent> = {
    vpn: {
      title: 'VPN Services Guide',
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      description:
        'A practical guide to choosing a reputable VPN: what they protect, what they cannot fix, and why providers like Proton VPN, Mullvad, and NymVPN stand out.',
      sections: [],
    },
    password: {
      title: 'Password Managers Guide',
      icon: <Lock className="h-8 w-8 text-indigo-500" />,
      description:
        'Create, store, and share passwords securely with KeePass, Bitwarden, Apple Passwords, Google Password Manager, Passwords.lu, and PrivateNote.',
      sections: [],
    },
    messenger: {
      title: 'Secure Messaging Guide',
      icon: <Smartphone className="h-8 w-8 text-green-500" />,
      description: 'Protect private conversations with end-to-end encrypted messaging apps, safer defaults, disappearing messages, and reduced metadata exposure.',
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
      description: 'Protect email communications from scanning, surveillance, account takeover, and data mining with encrypted providers and safer handling habits.',
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
      description: 'Browse with less tracking by choosing privacy-focused browsers, blocking invasive trackers, limiting fingerprinting, and controlling cookies.',
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

  const rawGuide = guides[topicId];
  const guide = rawGuide || {
    title: 'Guide Not Found',
    icon: <Shield className="h-8 w-8 text-gray-500" />,
    description: 'The requested guide could not be found.',
    sections: [{
      title: 'Error',
      content: 'Sorry, we couldn\'t find information on this security topic. Please check the URL or return to the security resources page.'
    }]
  };

  useEffect(() => {
    if (topicId === 'vpn' || topicId === 'password') return;
    const g = guides[topicId];
    if (g) {
      setDocumentMeta(buildDocumentTitle(g.title), g.description);
      return;
    }
    setDocumentMeta(
      buildDocumentTitle(t.documentMetaNotFoundTitle),
      t.documentMetaNotFoundDescription,
    );
  }, [topicId, t]);

  const renderSectionBody = (section: GuideSection) => (
    <>
      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{section.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{section.content}</p>

      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-2 mb-5">
          {section.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.callout && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 mb-5 ${
            section.callout.tone === 'warning'
              ? 'border-amber-200/80 bg-amber-50/80 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100'
              : 'border-blue-200/80 bg-blue-50/80 text-blue-950 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100'
          }`}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{section.callout.text}</p>
        </div>
      )}

      {section.providers && section.providers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-1">
          {section.providers.map((provider) => (
            <div
              key={provider.name}
              className="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-950/40 p-5 md:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{provider.tagline}</p>
                </div>
                <a
                  href={provider.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shrink-0"
                >
                  Visit {provider.name}
                  <ExternalLink className="h-4 w-4 ml-1.5" />
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{provider.description}</p>
              <ul className="space-y-2">
                {provider.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.link && (
        section.link.startsWith('http') ? (
          <a
            href={section.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            {section.linkText || 'Learn more'}
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        ) : (
          <Link
            href={localizedPath(section.link, language)}
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            {section.linkText || 'Learn more'}
          </Link>
        )
      )}
    </>
  );

  const showTitleIcon = rawGuide?.showTitleIcon !== false;
  const showBackLink = rawGuide?.showBackLink !== false;

  if (topicId === 'vpn') {
    return <VpnServicesGuide />;
  }

  if (topicId === 'password') {
    return <PasswordManagersGuide />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-12">
        {showBackLink && (
          <Link
            href={localizedPath('/security-resources', language)}
            className="inline-flex items-center text-sm font-semibold text-primary hover:gap-2 transition-all mb-8 group"
          >
            Back to Security Resources
          </Link>
        )}

        <div className="flex items-center justify-center mb-4">
          {showTitleIcon && guide.icon}
          <h1 className={`page-title text-gray-900 dark:text-white ${showTitleIcon ? 'ml-3' : ''}`}>
            {guide.title}
          </h1>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {guide.description}
        </p>
      </div>

      <div className="space-y-10 mb-16">
        {guide.sections.map((section, index) =>
          section.plain ? (
            <div key={index} className="max-w-3xl mx-auto">
              {renderSectionBody(section)}
            </div>
          ) : (
            <div
              key={index}
              className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-gray-200/40 dark:shadow-none p-6 md:p-8"
            >
              {renderSectionBody(section)}
            </div>
          ),
        )}
      </div>

      <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 p-6 md:p-8 mb-12">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Explore Other Security Topics</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(guides).map(([id, content]) => (
            id !== topicId && (
              <Link
                key={id}
                href={joinPublicPath("security-guides", id)}
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
