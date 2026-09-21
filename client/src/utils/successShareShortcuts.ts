export const SUCCESS_SHARE_SHORTCUTS_KEY = "privatenote_success_share_shortcuts.v6";

export const SUCCESS_SHARE_CHANNEL_IDS = [
  "email",
  "signal",
  "qr",
  "whatsapp",
  "device",
  "teams",
  "telegram",
  "sms",
] as const;

export type SuccessShareChannelId = (typeof SUCCESS_SHARE_CHANNEL_IDS)[number];

export const DEFAULT_SUCCESS_SHARE_ORDER: readonly SuccessShareChannelId[] = [
  "email",
  "signal",
  "qr",
  "whatsapp",
  "teams",
  "device",
  "telegram",
  "sms",
];

/** Email, Signal, QR, WhatsApp, Teams, and Share from this device, plus More. */
export const PINNED_SUCCESS_SHARE_COUNT = 6;

export type SuccessShareChannelKind = "link" | "qr" | "copy-app" | "native";

const CHANNEL_KIND: Record<SuccessShareChannelId, SuccessShareChannelKind> = {
  email: "link",
  whatsapp: "link",
  qr: "qr",
  telegram: "link",
  signal: "link",
  teams: "link",
  sms: "link",
  device: "native",
};

export function shareChannelKind(id: SuccessShareChannelId): SuccessShareChannelKind {
  return CHANNEL_KIND[id];
}

/** Protocol URLs must not open a new browser tab. */
export function shareChannelOpensInSameWindow(id: SuccessShareChannelId): boolean {
  return (
    id === "email" ||
    id === "sms" ||
    id === "signal" ||
    id === "whatsapp" ||
    id === "telegram" ||
    id === "teams"
  );
}

/** Teams compose can fail silently; copy so the link is still at hand. Signal copies as a fallback. */
export function shareChannelCopiesLink(id: SuccessShareChannelId): boolean {
  return id === "signal" || id === "teams";
}

export function shareChannelHref(id: SuccessShareChannelId, url: string): string | null {
  const text = encodeURIComponent(url);
  switch (id) {
    case "email":
      return `mailto:?body=${text}`;
    case "whatsapp":
      return `whatsapp://send?text=${text}`;
    case "telegram":
      return `tg://msg_url?url=${text}`;
    case "teams":
      return `msteams://teams.microsoft.com/l/chat/0/0?message=${text}`;
    case "sms":
      return `sms:?&body=${text}`;
    case "signal":
      return `sgnl://send?text=${text}`;
    case "qr":
    case "device":
      return null;
  }
}

export function normalizeShareShortcutOrder(raw: unknown): SuccessShareChannelId[] {
  const valid = new Set<string>(SUCCESS_SHARE_CHANNEL_IDS);
  const seen = new Set<string>();
  const out: SuccessShareChannelId[] = [];
  if (Array.isArray(raw)) {
    for (const id of raw) {
      if (typeof id !== "string" || !valid.has(id) || seen.has(id)) continue;
      seen.add(id);
      out.push(id as SuccessShareChannelId);
    }
  }
  for (const id of DEFAULT_SUCCESS_SHARE_ORDER) {
    if (seen.has(id)) continue;
    out.push(id);
  }
  return out;
}

export function readShareShortcutOrder(): SuccessShareChannelId[] {
  try {
    const raw = localStorage.getItem(SUCCESS_SHARE_SHORTCUTS_KEY);
    if (!raw) return [...DEFAULT_SUCCESS_SHARE_ORDER];
    return normalizeShareShortcutOrder(JSON.parse(raw) as unknown);
  } catch {
    return [...DEFAULT_SUCCESS_SHARE_ORDER];
  }
}

export function writeShareShortcutOrder(order: SuccessShareChannelId[]): void {
  try {
    localStorage.setItem(
      SUCCESS_SHARE_SHORTCUTS_KEY,
      JSON.stringify(normalizeShareShortcutOrder(order)),
    );
  } catch {
    /* private mode */
  }
}

export function moveShareShortcut(
  order: readonly SuccessShareChannelId[],
  id: SuccessShareChannelId,
  toIndex: number,
): SuccessShareChannelId[] {
  const from = order.indexOf(id);
  if (from < 0) return [...order];
  const next = order.filter((item) => item !== id);
  const clamped = Math.max(0, Math.min(toIndex, next.length));
  next.splice(clamped, 0, id);
  return next;
}
