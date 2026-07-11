import React from "react";
import { Globe, Laptop, Lock, Server, Shield } from "lucide-react";

const PACKETS = [0, 0.55, 1.1, 1.65, 2.2];

export function VpnTunnelAnimation() {
  return (
    <div className="vpn-tunnel-stage" aria-hidden>
      <p className="vpn-tunnel-stage__caption">Encrypted tunnel in action</p>

      <div className="vpn-tunnel-diagram">
        <div className="vpn-tunnel-node vpn-tunnel-node--device">
          <span className="vpn-tunnel-node__icon">
            <Laptop className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="vpn-tunnel-node__label">Your device</span>
          <span className="vpn-tunnel-node__meta">Real IP hidden</span>
        </div>

        <div className="vpn-tunnel-path">
          <div className="vpn-tunnel-path__tube">
            <div className="vpn-tunnel-path__glow" />
            <div className="vpn-tunnel-path__mesh" />
            {PACKETS.map((delay, i) => (
              <span
                key={i}
                className="vpn-tunnel-packet"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
          <div className="vpn-tunnel-path__lock">
            <Lock className="h-3.5 w-3.5" strokeWidth={2.25} />
            <span>AES-256 encrypted</span>
          </div>
        </div>

        <div className="vpn-tunnel-node vpn-tunnel-node--server">
          <span className="vpn-tunnel-node__icon vpn-tunnel-node__icon--server">
            <Server className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="vpn-tunnel-node__label">VPN server</span>
          <span className="vpn-tunnel-node__meta">Exit IP shown</span>
        </div>

        <div className="vpn-tunnel-path vpn-tunnel-path--open">
          <div className="vpn-tunnel-path__tube vpn-tunnel-path__tube--open">
            {PACKETS.slice(0, 3).map((delay, i) => (
              <span
                key={i}
                className="vpn-tunnel-packet vpn-tunnel-packet--open"
                style={{ animationDelay: `${delay + 1.1}s` }}
              />
            ))}
          </div>
        </div>

        <div className="vpn-tunnel-node vpn-tunnel-node--web">
          <span className="vpn-tunnel-node__icon vpn-tunnel-node__icon--web">
            <Globe className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="vpn-tunnel-node__label">Website</span>
          <span className="vpn-tunnel-node__meta">Sees VPN IP</span>
        </div>
      </div>

      <div className="vpn-tunnel-legend">
        <div className="vpn-tunnel-legend__item">
          <Shield className="h-4 w-4 text-primary" />
          <span>ISP &amp; Wi‑Fi see encrypted noise — not destinations</span>
        </div>
        <div className="vpn-tunnel-legend__item vpn-tunnel-legend__item--muted">
          <span className="vpn-tunnel-legend__dot" />
          <span>Data packets flow through the tunnel continuously</span>
        </div>
      </div>
    </div>
  );
}
