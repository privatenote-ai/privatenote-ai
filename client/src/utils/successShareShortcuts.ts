export const SUCCESS_SHARE_SHORTCUTS_KEY = "privatenote_success_share_shortcuts.v4";

export const SUCCESS_SHARE_CHANNEL_IDS = [
  "email",
  "signal",
  "qr",
  "whatsapp",
  "slack",
  "device",
  "telegram",
  "discord",
  "teams",
  "sms",
] as const;

export type SuccessShareChannelId = (typeof SUCCESS_SHARE_CHANNEL_IDS)[number];

export const DEFAULT_SUCCESS_SHARE_ORDER: readonly SuccessShareChannelId[] = [
  "email",
  "signal",
  "qr",
  "whatsapp",
  "slack",
  "device",
  "telegram",
  "discord",
  "teams",
  "sms",
];

/** Email, Signal, QR, WhatsApp, Slack, and Share from this device, plus More. */
export const PINNED_SUCCESS_SHARE_COUNT = 6;

export type SuccessShareChannelKind = "link" | "qr" | "copy-app" | "native";

const CHANNEL_KIND: Record<SuccessShareChannelId, SuccessShareChannelKind> = {
  email: "link",
  whatsapp: "link",
  slack: "link",
  qr: "qr",
  telegram: "link",
  signal: "link",
  discord: "copy-app",
  teams: "link",
  sms: "link",
  device: "native",
};

export function shareChannelKind(id: SuccessShareChannelId): SuccessShareChannelKind {
  return CHANNEL_KIND[id];
}

export function shareChannelHref(id: SuccessShareChannelId, url: string): string | null {
  switch (id) {
    case "email":
      return `mailto:?body=${encodeURIComponent(url)}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(url)}`;
    case "slack":
      return `https://slack.com/share?url=${encodeURIComponent(url)}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodeURIComponent(url)}`;
    case "teams":
      return `https://teams.microsoft.com/share?href=${encodeURIComponent(url)}&referrer=privatenote.ai`;
    case "sms":
      return `sms:?&body=${encodeURIComponent(url)}`;
    case "signal":
      return `sgnl://send?text=${encodeURIComponent(url)}`;
    case "qr":
    case "discord":
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

