/**
 * Prepended to generic AI user messages (server fallback and non-template local turns).
 * Template-based Write-with-AI uses {@link BASE_INSTRUCTION} inside `buildPromptFromTemplate`.
 */
import { BASE_INSTRUCTION as SHARED_BASE_INSTRUCTION } from "@/components/note/promptTemplates";

export const BASE_INSTRUCTION = SHARED_BASE_INSTRUCTION;

/** Prefix {@link BASE_INSTRUCTION} before the task-specific user prompt. */
export function prependBaseInstruction(userContent: string): string {
  const body = userContent.trim();
  if (!body) return BASE_INSTRUCTION;
  return `${BASE_INSTRUCTION}\n\n${body}`;
}
