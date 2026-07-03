import type { LucideIcon } from "lucide-react";

export type PasswordPostCardCopy = { title: string; body: string; icon: LucideIcon };
export type PasswordPostSectionCopy = {
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  notes?: { title: string; body: string }[];
  bullets?: { title: string; body: string }[];
};
export type PasswordPostCopy = {
  intro: string;
  lead: string;
  cards: PasswordPostCardCopy[];
  sections: PasswordPostSectionCopy[];
  bestPracticesTitle: string;
  bestPractices: { title: string; body: string }[];
};
