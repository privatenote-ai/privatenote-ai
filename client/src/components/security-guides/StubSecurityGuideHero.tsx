import React from "react";
import { Globe, Lock, Mail, MessageCircle, Monitor, Shield, type LucideIcon } from "lucide-react";

type StubGuideId = "messenger" | "email" | "browser";

function HeroNode({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-background/85 text-primary shadow-lg shadow-primary/10">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <span className="text-xs font-bold text-foreground">{label}</span>
    </div>
  );
}

export function StubSecurityGuideHero({ guideId }: { guideId: StubGuideId }) {
  const caption =
    guideId === "messenger"
      ? "End-to-end encrypted by default"
      : guideId === "email"
        ? "Zero-access encryption at rest"
        : "Trackers blocked · fingerprint resisted";

  const [left, right]: [{ icon: LucideIcon; label: string }, { icon: LucideIcon; label: string }] =
    guideId === "messenger"
      ? [
          { icon: MessageCircle, label: "You" },
          { icon: MessageCircle, label: "Recipient" },
        ]
      : guideId === "email"
        ? [
            { icon: Mail, label: "Inbox" },
            { icon: Lock, label: "Provider blind" },
          ]
        : [
            { icon: Monitor, label: "Browser" },
            { icon: Globe, label: "Web" },
          ];

  const tunnelLabel =
    guideId === "messenger" ? "Signal Protocol" : guideId === "email" ? "Encrypted vault" : "Shields on";

  const TunnelIcon = guideId === "browser" ? Shield : Lock;

  return (
    <div
      className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/[0.09] via-blue-500/[0.05] to-background/40 px-4 py-6 shadow-[0_22px_48px_-36px_hsl(var(--primary)/0.45)] sm:px-8 sm:py-8"
      aria-hidden
    >
      <p className="mb-6 text-center text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{caption}</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <HeroNode icon={left.icon} label={left.label} />

        <div className="relative flex min-w-[7rem] flex-col items-center gap-2 sm:min-w-[10rem]">
          <div className="relative h-11 w-full overflow-hidden rounded-full border-2 border-primary/45 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 shadow-[0_0_18px_hsl(var(--primary)/0.12)]">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-[vpn-tunnel-packet-flow_2.4s_ease-in-out_infinite] rounded-full bg-primary/50 blur-sm" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">
            <TunnelIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
            {tunnelLabel}
          </div>
        </div>

        <HeroNode icon={right.icon} label={right.label} />
      </div>
    </div>
  );
}
