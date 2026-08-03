import React, { useEffect } from "react";
import { useRoute } from "wouter";
import { DeveloperIntegrationPage } from "@/components/developers/DeveloperIntegrationPage";
import { getDeveloperIntegration } from "@/pages/developers/integrationContent";
import { useLanguage } from "@/context/LanguageContext";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import NotFound from "@/pages/not-found";
import { isEnglishOnlyDeveloperIntegration } from "@shared/englishOnlyDeveloperIntegrations";

export default function DeveloperIntegrationDetail() {
  const { t } = useLanguage();
  const [, enParams] = useRoute("/developers/:integrationId");
  const [, localizedParams] = useRoute("/:lang/developers/:integrationId");
  const integrationId = localizedParams?.integrationId || enParams?.integrationId || "";

  const content = getDeveloperIntegration(integrationId);
  const statusLabel = content?.status === "beta" ? t.devStatusBeta : t.devStatusStable;

  useEffect(() => {
    if (!content) return;
    setDocumentMeta(
      buildDocumentTitle(content.metaTitle),
      content.metaDescription,
    );
  }, [content]);

  if (!isEnglishOnlyDeveloperIntegration(integrationId) || !content) {
    return <NotFound />;
  }

  return <DeveloperIntegrationPage content={content} statusLabel={statusLabel} />;
}
