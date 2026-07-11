import React from "react";
import { KeyRound, Laptop, Lock, Shield, Smartphone } from "lucide-react";

const INCOMING = [0, 0.7, 1.4, 2.1];
const SYNC = [0.3, 1.0, 1.7];

export function PasswordVaultAnimation() {
  return (
    <div className="password-vault-stage" aria-hidden>
      <p className="password-vault-stage__caption">Encrypted vault in action</p>

      <div className="password-vault-diagram">
        <div className="password-vault-node">
          <span className="password-vault-node__icon">
            <KeyRound className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="password-vault-node__label">Master password</span>
          <span className="password-vault-node__meta">Derives vault keys</span>
        </div>

        <div className="password-vault-path">
          <div className="password-vault-path__beam" />
          {INCOMING.map((delay, i) => (
            <span
              key={i}
              className="password-vault-token password-vault-token--in"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <div className="password-vault-core">
          <div className="password-vault-core__shell">
            <div className="password-vault-core__shimmer" />
            <Lock className="password-vault-core__lock h-7 w-7" strokeWidth={1.75} />
            <span className="password-vault-core__badge">AES-256 vault</span>
            {INCOMING.map((delay, i) => (
              <span
                key={`store-${i}`}
                className="password-vault-chip"
                style={{ animationDelay: `${delay + 0.35}s` }}
              />
            ))}
          </div>
          <span className="password-vault-core__label">Encrypted vault</span>
        </div>

        <div className="password-vault-path password-vault-path--sync">
          <div className="password-vault-path__beam password-vault-path__beam--sync" />
          {SYNC.map((delay, i) => (
            <span
              key={i}
              className="password-vault-token password-vault-token--sync"
              style={{ animationDelay: `${delay + 1.2}s` }}
            />
          ))}
        </div>

        <div className="password-vault-devices">
          <div className="password-vault-device">
            <Laptop className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="password-vault-device">
            <Smartphone className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <span className="password-vault-devices__label">Synced devices</span>
        </div>
      </div>

      <div className="password-vault-legend">
        <div className="password-vault-legend__item">
          <Shield className="h-4 w-4 text-primary" />
          <span>Unique passwords stored encrypted — provider cannot read them</span>
        </div>
      </div>
    </div>
  );
}
