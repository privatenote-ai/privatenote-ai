import { Info, X } from "lucide-react";
import { findTrustedPartner } from "@/config/trustedPrefillPartners";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

type Props = {
  visible: boolean;
  referrer: string | null;
  onDismiss: () => void;
};

/**
 * Notice when note body was pre-filled via `#text=…&from=…` (e.g. from passwords.lu).
 * Trusted allowlisted partners can ship branding (logo + Rams palette); others stay neutral amber.
 */
export function PrefillPartnerBanner({ visible, referrer, onDismiss }: Props) {
  const { t } = useLanguage();

  if (!visible) return null;

  const partner = findTrustedPartner(referrer);
  const branded = Boolean(partner?.branding?.logoSrc);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "mb-3 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm",
        branded
          ? "border-rams-beige bg-rams-offWhite text-rams-graphite dark:border-rams-olive dark:bg-rams-darkBg dark:text-rams-offWhite"
          : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200",
      )}
    >
      {partner?.branding?.logoSrc ? (
        <img
          src={partner.branding.logoSrc}
          alt={partner.branding.logoAlt}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-lg border border-rams-beige/80 bg-rams-white object-contain p-1 dark:border-rams-olive/50 dark:bg-rams-graphite/40"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" aria-hidden />
      )}

      <span className="flex-1 min-w-0">
        <span className="block leading-snug">
          {partner ? (
            <>
              {t.prefillPartnerBodyPrefix}{" "}
              <strong className="font-semibold">{partner.displayName}</strong>. {t.prefillPartnerBodySuffix}
            </>
          ) : (
            <>{t.prefillPartnerBodyNeutral}</>
          )}
        </span>
        {branded ? (
          <span className="mt-1.5 block text-xs leading-snug text-rams-concrete dark:text-rams-steel">
            {t.prefillPartnerDeviceHint}
          </span>
        ) : null}
      </span>

      <button
        type="button"
        aria-label={t.prefillDismissAriaLabel}
        onClick={onDismiss}
        className={cn(
          "shrink-0 rounded-md p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
          branded
            ? "text-rams-orange hover:bg-rams-orange/10 focus:ring-rams-orange/40 dark:hover:bg-rams-orange/15 dark:focus:ring-offset-rams-darkBg"
            : "text-amber-600 hover:bg-amber-100 focus:ring-amber-500/50 dark:text-amber-400 dark:hover:bg-amber-900/50",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
