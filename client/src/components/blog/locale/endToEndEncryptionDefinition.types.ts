export type E2eeDefinitionSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type E2eeDefinitionReference = { label: string; href: string };

export type E2eeDefinitionTableRow = {
  model: string;
  happens: string;
  plaintext: string;
  keys: string;
};

export type E2eeDefinitionFlowNode = { title: string; body: string };

export type E2eeDefinitionArticleCopy = {
  intro: string[];
  definitionTitle: string;
  definitionBody: string;
  tableHeaders: [string, string, string, string];
  tableRows: E2eeDefinitionTableRow[];
  flowNodes: E2eeDefinitionFlowNode[];
  sections: E2eeDefinitionSection[];
  continueReadingTitle: string;
  referencesTitle: string;
  references: E2eeDefinitionReference[];
};
