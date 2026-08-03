import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { isLocalizedSecurityGuideTopic } from '@shared/localizedSecurityGuides';
import { buildDocumentTitle, setDocumentMeta } from '@/utils/documentMeta';
import { VpnServicesGuide } from '@/components/security-guides/VpnServicesGuide';
import { PasswordManagersGuide } from '@/components/security-guides/PasswordManagersGuide';
import { StubSecurityGuide } from '@/components/security-guides/StubSecurityGuide';
import { stubSecurityGuides } from '@/components/security-guides/stubSecurityGuides';

const STUB_GUIDE_IDS = ['messenger', 'email', 'browser'] as const;
type StubGuideId = (typeof STUB_GUIDE_IDS)[number];

function isStubGuideId(topicId: string): topicId is StubGuideId {
  return (STUB_GUIDE_IDS as readonly string[]).includes(topicId);
}

const SecurityGuideDetail: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [, enParams] = useRoute('/security-guides/:topicId');
  const [, localizedParams] = useRoute('/:lang/security-guides/:topicId');
  const topicId = localizedParams?.topicId || enParams?.topicId || '';

  useEffect(() => {
    if (isLocalizedSecurityGuideTopic(topicId)) return;
    if (language !== "en") {
      setLanguage("en");
    }
  }, [language, setLanguage, topicId]);

  useEffect(() => {
    if (topicId === 'vpn' || topicId === 'password') return;
    const guide = isStubGuideId(topicId) ? stubSecurityGuides[topicId] : undefined;
    if (guide) {
      setDocumentMeta(buildDocumentTitle(guide.title), guide.description);
      return;
    }
    setDocumentMeta(
      buildDocumentTitle(t.documentMetaNotFoundTitle),
      t.documentMetaNotFoundDescription,
    );
  }, [topicId, t]);

  if (topicId === 'vpn') {
    return <VpnServicesGuide />;
  }

  if (topicId === 'password') {
    return <PasswordManagersGuide />;
  }

  if (isStubGuideId(topicId)) {
    return <StubSecurityGuide guideId={topicId} copy={stubSecurityGuides[topicId]} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 text-center sm:px-6 lg:px-8">
      <h1 className="page-title text-gray-900 dark:text-white">{t.documentMetaNotFoundTitle}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{t.documentMetaNotFoundDescription}</p>
    </div>
  );
};

export default SecurityGuideDetail;
