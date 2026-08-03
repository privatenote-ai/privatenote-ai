import type { LucideIcon } from "lucide-react";
import type { EnglishOnlyDeveloperIntegration } from "@shared/englishOnlyDeveloperIntegrations";

export type DevIntegrationStatus = "stable" | "beta";

export type DevRefRow = {
  name: string;
  description: string;
};

export type DevIntegrationCta = {
  label: string;
  href: string;
  external?: boolean;
};

export type DevIntegrationContent = {
  id: EnglishOnlyDeveloperIntegration;
  icon: LucideIcon;
  status: DevIntegrationStatus;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  hubPreview: string;
  whyTitle: string;
  whyBody: string[];
  quickStartTitle: string;
  quickStartCode: string;
  quickStartNote?: string;
  securityTitle: string;
  securityBody: string[];
  securityBullets?: string[];
  refTitle: string;
  refRows: DevRefRow[];
  primaryCta: DevIntegrationCta;
  secondaryCta?: DevIntegrationCta;
  blogLink?: { label: string; slug: string };
  npmPackage?: string;
  playground?: "cli" | "mcp";
  screenshot?: {
    src: string;
    alt: string;
    caption?: string;
  };
};
