/**
 * Decide whether enabling on-device AI should preload the model immediately or ask first.
 * Uses the Network Information API when available; unknown → optimistic auto (typical desktop).
 */

export type LocalAiPreloadNetworkPolicy = "auto" | "confirm";

type Conn = NetworkInformation & { type?: string };

function getConnection(): Conn | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: Conn }).connection;
}

/**
 * - Wi‑Fi / ethernet → preload as soon as the user turns on Private AI.
 * - Cellular (`type`), Data Saver (`saveData`), or slow effectiveType (2G/3G) → confirm first.
 */
export function getLocalAiPreloadNetworkPolicy(): LocalAiPreloadNetworkPolicy {
  const conn = getConnection();
  if (!conn) return "auto";

  const type = conn.type;
  if (type === "wifi" || type === "ethernet") return "auto";
  if (type === "cellular") return "confirm";

  if (conn.saveData === true) return "confirm";

  const et = conn.effectiveType;
  if (et === "slow-2g" || et === "2g" || et === "3g") return "confirm";

  return "auto";
}
