export const SEND_CHANNELS = ["email", "slack", "discord", "teams", "whatsapp"] as const;
export type SendChannel = (typeof SEND_CHANNELS)[number];

export function isSendChannel(value: string): value is SendChannel {
  return (SEND_CHANNELS as readonly string[]).includes(value);
}

export type BoundSendAuthorization =
  | { requested: false }
  | { requested: true; channel: SendChannel; recipient: string };
