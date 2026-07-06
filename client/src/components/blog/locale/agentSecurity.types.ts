export type AgentSecurityBullet = { label: string; body: string };

export type AgentSecuritySection = {
  title: string;
  paragraphs: string[];
  callout?: string;
  emphasisBlock?: string[];
  bullets?: AgentSecurityBullet[];
  afterBullets?: string[];
};

export type AgentSecurityArticleCopy = {
  intro: string[];
  introCallout?: string;
  sections: AgentSecuritySection[];
  closingCallout?: { title: string; body: string };
};
