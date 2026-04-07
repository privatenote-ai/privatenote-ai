import { Globe, Laptop, Smartphone, type LucideIcon } from "lucide-react";
import type { SessionInfo } from "./types";

export function getSessionDevice(session: SessionInfo): { label: string; icon: LucideIcon } {
  const ua = (session.userAgent ?? "").toLowerCase();
  if (ua.includes("iphone") || ua.includes("android") || ua.includes("mobile")) {
    return { label: "Phone", icon: Smartphone };
  }
  if (ua.includes("electron") || ua.includes("desktop app") || ua.includes("privatenote")) {
    return { label: "Desktop App", icon: Laptop };
  }
  return { label: "Web", icon: Globe };
}
