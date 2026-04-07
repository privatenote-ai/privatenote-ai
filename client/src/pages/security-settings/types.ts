export type SessionInfo = {
  id: string;
  createdAt: string | null;
  lastSeenAt: string | null;
  expiresAt: string | null;
  absoluteExpiresAt: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
  userAgent: string | null;
  ip: string | null;
  city: string | null;
  country: string | null;
  deviceLabel: string | null;
  current: boolean;
};

export type PasskeyInfo = {
  id: string;
  createdAt: string;
  lastUsedAt: string | null;
  transports: string[] | null;
  label: string;
};
