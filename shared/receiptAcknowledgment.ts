export const RECEIPT_ACK_STATEMENT_MAX_LENGTH = 180;

export const BUSINESS_RECEIPT_ACK_PRESETS = [
  { id: "received", label: "I confirm I received this secure message." },
  { id: "credentials", label: "I confirm I received these credentials securely." },
  { id: "review", label: "I confirm I received and reviewed this information." },
] as const;

export type ReceiptAckPresetId = (typeof BUSINESS_RECEIPT_ACK_PRESETS)[number]["id"] | "custom";

export function normalizeReceiptAckStatement(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized || normalized.length > RECEIPT_ACK_STATEMENT_MAX_LENGTH) return null;
  return normalized;
}

export function receiptAckStatementId(statement: string): string {
  const preset = BUSINESS_RECEIPT_ACK_PRESETS.find((item) => item.label === statement);
  return preset?.id ?? "custom";
}
