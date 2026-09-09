import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useAccountEntitlements } from "@/context/AccountEntitlementsContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, apiUploadRequest, ApiRequestError } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import {
  Monitor,
  Smartphone,
  ImageIcon,
  Upload,
  Trash2,
  Unlock,
  Lock,
  Copy,
  Crown,
} from "lucide-react";
import {
  BRANDING_BANNER_ASPECT_RATIO,
  BRANDING_BANNER_MAX_BYTES,
  BRANDING_BANNER_RECOMMENDED_PX,
  BRANDING_BANNER_SIZE_LABEL,
  BRANDING_CARD_BANNER_MAX_BYTES,
  BRANDING_CARD_BANNER_RECOMMENDED_PX,
  BRANDING_CARD_BANNER_SIZE_LABEL,
  BRANDING_LOGO_MAX_BYTES,
  BRANDING_LOGO_RECOMMENDED_PX,
  BRANDING_BACKGROUND_ZOOM_DEFAULT,
  BRANDING_BACKGROUND_ZOOM_MAX,
  BRANDING_BACKGROUND_ZOOM_MIN,
  brandingBackgroundFilter,
  brandingBackgroundStyleForPage,
  brandingCardMarkUrl,
  brandingCtaStyle,
  brandingNoteTextBorderColor,
  brandingIsPrivateNoteCanvas,
  brandingMobileLane,
  brandingPageBackground,
  brandingPageMode,
  brandingPositionFromMobileLane,
  brandingRevealLogoClassName,
  brandingUsesPortalSurface,
  brandingCardPercentFromPosition,
  brandingCardPositionFromPercent,
  contrastingTextOn,
  DEFAULT_BRANDING_PORTAL_LAYOUT,
  DEFAULT_OPENED_NOTE_BRANDING,
  parseBrandingHexColor,
  parseStoredPortalLayoutJson,
  parseOpenedNoteBrandingSettings,
  brandingPortalLayout,
  applyOpenedNoteBranding,
  type BrandingBackgroundFilter,
  type BrandingBackgroundStyle,
  type BrandingCardPosition,
  type BrandingMobileLane,
  type BrandingOverlay,
  type BrandingPortalLayout,
  type OpenedNoteBrandingSettings,
  type RevealBranding,
} from "@shared/businessBranding";
import { BrandFilterAtmosphere, RecipientPortal, RevealHandoffStack } from "@/components/note/RecipientPortal";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_BRAND_COLOR = "#2563eb";
const BRANDING_AUTOSAVE_MS = 650;

type BrandingAutosavePayload = {
  businessDisplayName: string;
  businessAccentColor: string;
  businessBackgroundColor: string;
  businessTextColor: string;
  businessSenderName: string;
  businessSenderRole: string;
  businessTrustMessage: string;
  businessBackgroundStyle: BrandingBackgroundStyle;
  businessPortalLayout: BrandingPortalLayout;
  businessOpenedBranding: OpenedNoteBrandingSettings;
};

function brandingAutosaveKey(payload: BrandingAutosavePayload): string {
  return JSON.stringify(payload);
}

/** `#rgb` / `#rrggbb`, or the same digits without `#`. */
function normalizeBrandColorInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const parsed = parseBrandingHexColor(withHash);
  return parsed.ok && parsed.value ? parsed.value : null;
}

/** `<input type="color">` throws if the value is not `#rrggbb`. */
function hexColorForInput(raw: string | null | undefined, fallback: string): string {
  return normalizeBrandColorInput(raw ?? "") ?? fallback;
}

function ColorField({
  id,
  label,
  value,
  draft,
  onValue,
  onDraft,
}: {
  id: string;
  label: string;
  value: string;
  draft: string;
  onValue: (next: string) => void;
  onDraft: (next: string) => void;
}) {
  const valid = normalizeBrandColorInput(draft) != null;
  return (
    <div>
      <Label htmlFor={`${id}-hex`} className="mb-2 block text-sm">
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={hexColorForInput(value, DEFAULT_BRAND_COLOR)}
          aria-label={label}
          onChange={(event) => {
            const next = event.target.value;
            onValue(next);
            onDraft(next);
          }}
          className="h-10 w-12 shrink-0 cursor-pointer rounded border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
        />
        <input
          id={`${id}-hex`}
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            onDraft(next);
            const parsed = normalizeBrandColorInput(next);
            if (parsed) onValue(parsed);
          }}
          onBlur={() => onDraft(value)}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          inputMode="text"
          maxLength={7}
          aria-invalid={!valid}
          className={`w-32 rounded-md border bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900 ${
            valid ? "border-gray-300 dark:border-gray-700" : "border-red-400 dark:border-red-500"
          }`}
        />
      </div>
    </div>
  );
}

function filterSwatchWash(
  filter: BrandingBackgroundFilter,
  accentColor: string,
  backgroundColor: string,
): string {
  const page = brandingPageBackground({
    accentColor,
    backgroundColor,
    backgroundStyle: filter,
  });
  if (page.kind === "gradient" || page.kind === "color") return page.backgroundColor;
  return brandingIsPrivateNoteCanvas(backgroundColor) ? "#ffffff" : backgroundColor;
}

function BackgroundFilterPicker({
  id,
  value,
  onChange,
  accentColor,
  backgroundColor,
}: {
  id: string;
  value: BrandingBackgroundFilter;
  onChange: (next: BrandingBackgroundFilter) => void;
  accentColor: string;
  backgroundColor: string;
}) {
  const options: Array<{ id: BrandingBackgroundFilter; label: string }> = [
    { id: "neutral", label: "None" },
    { id: "gradient", label: "Soft wash" },
    { id: "vignette", label: "Vignette" },
    { id: "glow", label: "Soft glow" },
    { id: "mesh", label: "Mesh" },
  ];
  return (
    <div>
      <Label className="mb-2 block text-sm">Background filter</Label>
      <div id={id} className="grid grid-cols-5 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`overflow-hidden rounded-md border text-left ${
              value === option.id
                ? "border-primary ring-1 ring-primary"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
            }`}
          >
            <span className="relative block h-16 w-full overflow-hidden" aria-hidden>
              <BrandFilterAtmosphere
                filter={option.id}
                accent={accentColor}
                wash={filterSwatchWash(option.id, accentColor, backgroundColor)}
                compact
              />
            </span>
            <span
              className={`block px-1.5 py-1 text-[10px] font-medium leading-tight ${
                value === option.id ? "text-primary" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
        Tints the Default page around the card. Custom photography ignores these.
      </p>
    </div>
  );
}

const PREVIEW_DESKTOP = { width: 1280, height: 800 };
const PREVIEW_PHONE = { width: 390, height: 844 };

function ScaledViewport({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const next = el.clientWidth / width;
      setScale(Number.isFinite(next) && next > 0 ? Math.min(1, next) : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={outerRef}
      className="flex w-full justify-center"
      style={{ height: height * scale }}
    >
      <div style={{ width: width * scale, height: height * scale }}>
        <div
          className="origin-top-left"
          style={{ width, height, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const BrandingPreview: React.FC<{
  branding: RevealBranding;
  viewport: "desktop" | "mobile";
  onCardPlace?: (x: number, y: number) => void;
}> = ({ branding, viewport, onCardPlace }) => {
  const usesCard = brandingUsesPortalSurface(branding);
  const buttonStyle = brandingCtaStyle(branding);
  const markUrl = brandingCardMarkUrl(branding);
  const logo = markUrl ? (
    <img src={markUrl} alt="" className={brandingRevealLogoClassName(branding, { preview: true })} />
  ) : null;
  const sender = branding.senderName?.trim();
  const company = branding.companyName?.trim();
  const brandingLine = sender && company
    ? `${sender} from ${company} shared a private note`
    : sender
      ? `Shared by ${sender}`
      : company
        ? `Shared by ${company}`
        : null;
  const action = (
    <div className="flex w-full justify-center">
      <button
        type="button"
        className="inline-flex w-full max-w-[12.5rem] items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
        style={buttonStyle}
      >
        <Unlock className="mr-1.5 h-3.5 w-3.5" />
        Reveal Note
      </button>
    </div>
  );

  return (
    <RecipientPortal
      preview
      previewViewport={viewport}
      branding={branding}
      language="en"
      t={{
        revealTrustEncrypted: "End-to-end encrypted",
        revealTrustNoAccount: "No account required",
        revealSecuredByPrivateNote: "Secured by PrivateNote",
        language: "Language",
      }}
      surface={usesCard ? "card" : "plain"}
      onCardPlace={onCardPlace}
    >
      {usesCard ? (
        <RevealHandoffStack
          compact
          branding={branding}
          brandingLine={brandingLine}
          logo={logo}
          action={action}
          footnote={
            <>
              <span className="sm:hidden">Deleted after opening</span>
              <span className="hidden sm:inline">This note will be deleted after opening</span>
            </>
          }
        />
      ) : (
        <section className="mx-auto w-full max-w-5xl">
          <section className="relative isolate px-4 pb-2 text-center sm:px-6 sm:pb-4 lg:px-8">
            <RevealHandoffStack
              branding={branding}
              brandingLine={brandingLine}
              logo={logo}
              title={
                <>
                  Reveal <span className="text-primary">Private Note</span>
                </>
              }
              subtitle="For your privacy, this note is deleted after it's opened."
              action={action}
              footnote="Open only when you're ready — this cannot be undone."
            />
          </section>
        </section>
      )}
    </RecipientPortal>
  );
};

function PreviewDeviceFrame({
  viewport,
  onViewportChange,
  hint,
  children,
  showViewportToggle = true,
  label = "Recipient preview",
}: {
  viewport: "desktop" | "mobile";
  onViewportChange: (viewport: "desktop" | "mobile") => void;
  hint?: string;
  children: ReactNode;
  showViewportToggle?: boolean;
  label?: string;
}) {
  const phoneOuterWidth = PREVIEW_PHONE.width + 32;
  const phoneOuterHeight = PREVIEW_PHONE.height + 32;

  return (
    <div className="space-y-3">
      {showViewportToggle ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
            {([
              { id: "desktop" as const, label: "Desktop", Icon: Monitor },
              { id: "mobile" as const, label: "Phone", Icon: Smartphone },
            ]).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onViewportChange(option.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                  viewport === option.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
              >
                <option.Icon className="h-3.5 w-3.5" aria-hidden />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      )}
      {viewport === "desktop" ? (
        <ScaledViewport width={PREVIEW_DESKTOP.width} height={PREVIEW_DESKTOP.height + 44}>
          <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-neutral-300 bg-neutral-200 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex h-11 shrink-0 items-center gap-3 border-b border-neutral-300 bg-neutral-100 px-3 dark:border-neutral-700 dark:bg-neutral-900">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-center">
                <div className="flex h-7 w-full max-w-xl items-center gap-2 rounded-md bg-white px-3 text-[13px] text-neutral-500 shadow-sm dark:bg-neutral-800 dark:text-neutral-400">
                  <Lock className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden />
                  <span className="truncate">privatenote.ai/n/k7w9…</span>
                </div>
              </div>
              <span className="w-14" aria-hidden />
            </div>
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 overflow-hidden">{children}</div>
            </div>
          </div>
        </ScaledViewport>
      ) : (
        <ScaledViewport width={phoneOuterWidth} height={phoneOuterHeight}>
          <div
            className="rounded-[2.75rem] border-[12px] border-neutral-900 bg-neutral-900 p-1 shadow-2xl"
            style={{ width: phoneOuterWidth, height: phoneOuterHeight }}
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] bg-black">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-11 bg-gradient-to-b from-black/55 to-transparent">
                <div className="flex h-full items-center justify-between px-6 text-[12px] font-semibold text-white">
                  <span>9:41</span>
                  <span className="absolute left-1/2 top-1.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />
                  <span className="tracking-tight">••••</span>
                </div>
              </div>
              <div className="relative min-h-0 flex-1 pt-11">
                <div className="absolute inset-x-0 bottom-0 top-11 overflow-hidden">{children}</div>
              </div>
              <div className="relative z-20 flex shrink-0 flex-col items-center gap-2 bg-black/40 px-4 pb-2 pt-1 backdrop-blur-md">
                <div className="flex h-11 w-full items-center justify-center rounded-2xl bg-white/15 text-[13px] text-white">
                  <Lock className="mr-1.5 h-3 w-3 text-white/80" aria-hidden />
                  privatenote.ai
                </div>
                <span className="mb-0.5 h-1 w-28 rounded-full bg-white/80" aria-hidden />
              </div>
            </div>
          </div>
        </ScaledViewport>
      )}
      {hint ? <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

const OpenedNoteBrandingPreview: React.FC<{
  branding: RevealBranding | undefined;
  viewport: "desktop" | "mobile";
}> = ({ branding, viewport }) => {
  const usesPortal = brandingUsesPortalSurface(branding);
  const sender = branding?.senderName?.trim();
  const role = branding?.senderRole?.trim();
  const company = branding?.companyName?.trim();
  const meta = [role, company].filter(Boolean).join(" · ");
  const markUrl = brandingCardMarkUrl(branding);
  const buttonStyle = brandingCtaStyle(branding);
  const hasIdentity = Boolean(markUrl || sender || company || branding?.trustMessage);

  return (
    <RecipientPortal
      preview
      previewViewport={viewport}
      branding={branding}
      language="en"
      t={{
        revealTrustEncrypted: "End-to-end encrypted",
        revealTrustNoAccount: "No account required",
        revealSecuredByPrivateNote: "Secured by PrivateNote",
        language: "Language",
      }}
      surface={usesPortal ? "wide" : "plain"}
    >
      <div className="text-center">
        <div
          className="overflow-hidden rounded-2xl border border-gray-200/90 bg-[rgb(252,251,248)] text-left shadow-sm"
          style={
            branding?.accentColor
              ? { borderTopColor: branding.accentColor, borderTopWidth: 3 }
              : undefined
          }
        >
          {hasIdentity ? (
            <div className="flex flex-col items-center gap-2 border-b border-black/[0.06] px-5 py-5 text-center">
              {markUrl ? (
                <img
                  src={markUrl}
                  alt=""
                  className={brandingRevealLogoClassName(branding, { preview: true })}
                />
              ) : null}
              {sender ? (
                <p className="m-0 text-sm font-semibold text-gray-900">{sender}</p>
              ) : null}
              {meta ? <p className="m-0 text-xs text-gray-500">{meta}</p> : null}
              {!sender && company ? (
                <p className="m-0 text-sm font-medium text-gray-700">{company}</p>
              ) : null}
              {branding?.trustMessage ? (
                <p className="m-0 max-w-sm text-sm leading-relaxed text-gray-600">
                  {branding.trustMessage}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-3">
              <p className="m-0 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                Private Note
              </p>
              <p className="m-0 text-[11px] text-gray-400">Self-destructs after opening</p>
            </div>
          )}
          <div className="px-4 py-4 sm:px-5">
            <div
              className="overflow-hidden rounded-xl bg-white text-left"
              style={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: brandingNoteTextBorderColor(branding) || "rgba(15, 23, 42, 0.08)",
              }}
            >
              <div className="min-h-[5.5rem] px-6 py-5 text-base leading-relaxed text-gray-900">
                Secret content
              </div>
            </div>
          </div>
          <div className="border-t border-black/[0.06] px-5 py-5">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex min-w-[170px] items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                style={buttonStyle}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Note
              </button>
              <button
                type="button"
                className="inline-flex min-w-[170px] items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800"
              >
                Create new note
              </button>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="m-0 inline-flex max-w-lg items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-medium leading-snug text-amber-900">
                <span aria-hidden>⚠️</span>
                This note will be deleted after you leave
              </p>
              <p className="m-0 text-xs text-gray-500">Make sure to save this note securely.</p>
            </div>
          </div>
        </div>
      </div>
    </RecipientPortal>
  );
};

function BrandingPageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {actions}
    </div>
  );
}

function ChoiceRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      <div className="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              value === option.id
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const CARD_POSITION_CELLS: Array<{ id: BrandingCardPosition; label: string }> = [
  { id: "top-left", label: "Top left" },
  { id: "top", label: "Top" },
  { id: "top-right", label: "Top right" },
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom", label: "Bottom" },
  { id: "bottom-right", label: "Bottom right" },
];

function CardPositionPad({
  label,
  x,
  y,
  onChange,
}: {
  label: string;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}) {
  const selected = brandingCardPositionFromPercent(x, y);
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      <div
        className="grid w-[6.75rem] grid-cols-3 gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700"
        role="radiogroup"
        aria-label={label}
      >
        {CARD_POSITION_CELLS.map((cell) => {
          const active = selected === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={cell.label}
              title={cell.label}
              onClick={() => {
                const next = brandingCardPercentFromPosition(cell.id);
                onChange(next.x, next.y);
              }}
              className={`h-7 rounded-md ${
                active
                  ? "bg-primary shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function MobileLanePad({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BrandingCardPosition;
  onChange: (id: BrandingCardPosition) => void;
}) {
  const lane = brandingMobileLane(value);
  const cells: Array<{ id: BrandingMobileLane; label: string }> = [
    { id: "top", label: "Top" },
    { id: "center", label: "Center" },
    { id: "bottom", label: "Bottom" },
  ];
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      <div
        className="grid w-[2.25rem] grid-rows-3 gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700"
        role="radiogroup"
        aria-label={label}
      >
        {cells.map((cell) => {
          const selected = lane === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={cell.label}
              title={cell.label}
              onClick={() => onChange(brandingPositionFromMobileLane(cell.id))}
              className={`h-7 w-7 rounded-md ${
                selected
                  ? "bg-primary shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function describeApiPreferenceError(error: unknown): string {
  if (!(error instanceof ApiRequestError)) return "Something went wrong.";
  try {
    const parsed = JSON.parse(error.bodyText) as { message?: unknown };
    if (typeof parsed.message === "string" && parsed.message.trim() !== "") {
      return parsed.message;
    }
  } catch {
    /* ignore */
  }
  if (error.bodyText.includes("migrations")) return "Server may need updates.";
  return `Error ${error.status}. Try again in a moment.`;
}


export default function AccountBranding() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const {
    entitlements: accountEntitlements,
    refreshEntitlements,
  } = useAccountEntitlements();
  const { t } = useLanguage();
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [businessDisplayName, setBusinessDisplayName] = useState("");
  const [businessAccentColor, setBusinessAccentColor] = useState(DEFAULT_BRAND_COLOR);
  const [businessAccentColorDraft, setBusinessAccentColorDraft] = useState(DEFAULT_BRAND_COLOR);
  const [businessBackgroundColor, setBusinessBackgroundColor] = useState("#ffffff");
  const [businessBackgroundColorDraft, setBusinessBackgroundColorDraft] = useState("#ffffff");
  const [businessTextColor, setBusinessTextColor] = useState("#ffffff");
  const [businessTextColorDraft, setBusinessTextColorDraft] = useState("#ffffff");
  const [businessLogoUrl, setBusinessLogoUrl] = useState<string | null>(null);
  const [businessSenderName, setBusinessSenderName] = useState("");
  const [businessSenderRole, setBusinessSenderRole] = useState("");
  const [businessTrustMessage, setBusinessTrustMessage] = useState("");
  const [businessBannerUrl, setBusinessBannerUrl] = useState<string | null>(null);
  const [businessBackgroundStyle, setBusinessBackgroundStyle] =
    useState<BrandingBackgroundStyle>("neutral");
  const [portalLayout, setPortalLayout] = useState<BrandingPortalLayout>({
    ...DEFAULT_BRANDING_PORTAL_LAYOUT,
  });
  const [brandingPreviewViewport, setBrandingPreviewViewport] =
    useState<"desktop" | "mobile">("desktop");
  const [openedNoteBranding, setOpenedNoteBranding] =
    useState<OpenedNoteBrandingSettings>({ ...DEFAULT_OPENED_NOTE_BRANDING });
  const [openedAccentDraft, setOpenedAccentDraft] = useState(DEFAULT_BRAND_COLOR);
  const [openedTextDraft, setOpenedTextDraft] = useState("#ffffff");
  const [openedPageColorDraft, setOpenedPageColorDraft] = useState("#e2e8f0");
  const [openedNoteBorderDraft, setOpenedNoteBorderDraft] = useState(DEFAULT_BRAND_COLOR);
  // A null opened scale inherits the reveal page's, so the slider starts where that left off.
  const openedBackgroundZoom =
    openedNoteBranding.backgroundZoom ?? portalLayout.backgroundZoom ?? BRANDING_BACKGROUND_ZOOM_DEFAULT;
  const openedPageIsDefault =
    openedNoteBranding.background !== "banner";
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [removingLogo, setRemovingLogo] = useState(false);
  const [savedBrandingIndicator, setSavedBrandingIndicator] = useState(false);
  const brandingHydratedRef = useRef(false);
  const skipBrandingAutosaveRef = useRef(false);
  const brandingSaveTimerRef = useRef<number | null>(null);
  const savedBrandingTimeoutRef = useRef<number | null>(null);
  const lastSavedBrandingKeyRef = useRef("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const cardBannerInputRef = useRef<HTMLInputElement>(null);
  const openedBannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingCardBanner, setUploadingCardBanner] = useState(false);
  const [uploadingOpenedBanner, setUploadingOpenedBanner] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const data = await apiRequest<{
        ok: boolean;
        businessDisplayName?: string | null;
        businessLogoUrl?: string | null;
        businessAccentColor?: string | null;
        businessBackgroundColor?: string | null;
        businessTextColor?: string | null;
        businessSenderName?: string | null;
        businessSenderRole?: string | null;
        businessTrustMessage?: string | null;
        businessBannerUrl?: string | null;
        businessBackgroundStyle?: BrandingBackgroundStyle;
        businessPortalLayout?: BrandingPortalLayout | string | null;
        businessOpenedBranding?: OpenedNoteBrandingSettings | string | null;
      }>("/api/auth/account/summary", "GET");
      if (data.ok) {
        setBusinessDisplayName(data.businessDisplayName ?? "");
        setBusinessLogoUrl(data.businessLogoUrl ?? null);
        const accent = hexColorForInput(data.businessAccentColor, DEFAULT_BRAND_COLOR);
        setBusinessAccentColor(accent);
        setBusinessAccentColorDraft(accent);
        const background = hexColorForInput(data.businessBackgroundColor, "#ffffff");
        setBusinessBackgroundColor(background);
        setBusinessBackgroundColorDraft(background);
        const text = hexColorForInput(data.businessTextColor, contrastingTextOn(accent));
        setBusinessTextColor(text);
        setBusinessTextColorDraft(text);
        setBusinessSenderName(data.businessSenderName ?? "");
        setBusinessSenderRole(data.businessSenderRole ?? "");
        setBusinessTrustMessage(data.businessTrustMessage ?? "");
        setBusinessBannerUrl(data.businessBannerUrl ?? null);
        setBusinessBackgroundStyle(data.businessBackgroundStyle ?? "neutral");
        setPortalLayout(
          typeof data.businessPortalLayout === "string"
            ? parseStoredPortalLayoutJson(data.businessPortalLayout)
            : brandingPortalLayout(data.businessPortalLayout ?? undefined),
        );
        const parsedOpened = parseOpenedNoteBrandingSettings(data.businessOpenedBranding);
        setOpenedNoteBranding({
          ...parsedOpened,
          background: parsedOpened.background === "banner" ? "banner" : "neutral",
        });
        setOpenedAccentDraft(hexColorForInput(parsedOpened.accentColor, accent));
        setOpenedTextDraft(hexColorForInput(parsedOpened.textColor, text));
        setOpenedNoteBorderDraft(
          hexColorForInput(parsedOpened.noteBorderColor, accent),
        );
        setOpenedPageColorDraft(
          hexColorForInput(
            parsedOpened.backgroundColor,
            brandingIsPrivateNoteCanvas(background) ? "#e2e8f0" : background,
          ),
        );
      }
    } catch {
      /* non-critical */
    } finally {
      setPrefsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setPrefsLoading(false); return; }
    void loadSummary();
  }, [authLoading, user, loadSummary]);

  const saveBrandingDefaults = useCallback(async (payload: BrandingAutosavePayload) => {
    const key = brandingAutosaveKey(payload);
    if (!user) return;
    if (key === lastSavedBrandingKeyRef.current) return;
    setSavingBranding(true);
    try {
      const response = await apiRequest<{
        businessDisplayName: string | null;
        businessAccentColor: string | null;
        businessBackgroundColor: string | null;
        businessTextColor: string | null;
        businessPortalLayout?: BrandingPortalLayout;
      }>("/api/auth/account/preferences", "PATCH", payload);
      skipBrandingAutosaveRef.current = true;
      lastSavedBrandingKeyRef.current = key;
      setBusinessDisplayName(response.businessDisplayName ?? "");
      const accent = hexColorForInput(response.businessAccentColor, DEFAULT_BRAND_COLOR);
      setBusinessAccentColor(accent);
      setBusinessAccentColorDraft(accent);
      const background = hexColorForInput(response.businessBackgroundColor, "#ffffff");
      setBusinessBackgroundColor(background);
      setBusinessBackgroundColorDraft(background);
      const text = hexColorForInput(response.businessTextColor, contrastingTextOn(accent));
      setBusinessTextColor(text);
      setBusinessTextColorDraft(text);
      if (response.businessPortalLayout) {
        setPortalLayout(brandingPortalLayout(response.businessPortalLayout));
      }
      if (savedBrandingTimeoutRef.current) {
        window.clearTimeout(savedBrandingTimeoutRef.current);
      }
      setSavedBrandingIndicator(true);
      savedBrandingTimeoutRef.current = window.setTimeout(() => {
        setSavedBrandingIndicator(false);
      }, 2000);
      await refreshEntitlements();
    } catch (error) {
      toast({
        title: "Could not save branding",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setSavingBranding(false);
    }
  }, [refreshEntitlements, toast, user]);

  useEffect(() => {
    if (prefsLoading || authLoading || !user) return;
    if (!accountEntitlements.capabilities.revealBranding) {
      brandingHydratedRef.current = false;
      return;
    }
    const payload: BrandingAutosavePayload = {
      businessDisplayName,
      businessAccentColor,
      businessBackgroundColor,
      businessTextColor,
      businessSenderName,
      businessSenderRole,
      businessTrustMessage,
      businessBackgroundStyle,
      businessPortalLayout: portalLayout,
      businessOpenedBranding: openedNoteBranding,
    };
    const key = brandingAutosaveKey(payload);
    if (!brandingHydratedRef.current) {
      lastSavedBrandingKeyRef.current = key;
      brandingHydratedRef.current = true;
      return;
    }
    if (skipBrandingAutosaveRef.current) {
      skipBrandingAutosaveRef.current = false;
      lastSavedBrandingKeyRef.current = key;
      return;
    }
    if (key === lastSavedBrandingKeyRef.current) return;
    if (brandingSaveTimerRef.current) window.clearTimeout(brandingSaveTimerRef.current);
    brandingSaveTimerRef.current = window.setTimeout(() => {
      void saveBrandingDefaults(payload);
    }, BRANDING_AUTOSAVE_MS);
    return () => {
      if (brandingSaveTimerRef.current) {
        window.clearTimeout(brandingSaveTimerRef.current);
        brandingSaveTimerRef.current = null;
      }
    };
  }, [
    accountEntitlements.capabilities.revealBranding,
    authLoading,
    businessAccentColor,
    businessBackgroundColor,
    businessBackgroundStyle,
    businessDisplayName,
    businessSenderName,
    businessSenderRole,
    businessTextColor,
    businessTrustMessage,
    openedNoteBranding,
    portalLayout,
    prefsLoading,
    saveBrandingDefaults,
    user,
  ]);

  useEffect(() => {
    return () => {
      if (savedBrandingTimeoutRef.current) {
        window.clearTimeout(savedBrandingTimeoutRef.current);
      }
    };
  }, []);

  const uploadBusinessBanner = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > BRANDING_BANNER_MAX_BYTES) {
      toast({
        title: "Unsupported photograph",
        description: `Use a PNG, JPEG, or WebP image, ${BRANDING_BANNER_SIZE_LABEL} px, under ${Math.round(BRANDING_BANNER_MAX_BYTES / (1024 * 1024))} MB.`,
        variant: "destructive",
      });
      return;
    }
    setUploadingBanner(true);
    try {
      const response = await apiUploadRequest<{ bannerUrl: string }>("/api/auth/account/branding/banner", file);
      setBusinessBannerUrl(response.bannerUrl);
      setBusinessBackgroundStyle("banner");
      await refreshEntitlements();
      toast({ title: "Background photograph uploaded" });
    } catch (error) {
      toast({ title: "Could not upload photograph", description: describeApiPreferenceError(error), variant: "destructive" });
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const removeBusinessBanner = async () => {
    setUploadingBanner(true);
    try {
      await apiRequest("/api/auth/account/branding/banner", "DELETE");
      setBusinessBannerUrl(null);
      if (businessBackgroundStyle === "banner") setBusinessBackgroundStyle("neutral");
      await refreshEntitlements();
    } finally {
      setUploadingBanner(false);
    }
  };

  const uploadCardBanner = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > BRANDING_CARD_BANNER_MAX_BYTES) {
      toast({
        title: "Unsupported banner",
        description: `Use a PNG, JPEG, or WebP image under ${Math.round(BRANDING_CARD_BANNER_MAX_BYTES / (1024 * 1024))} MB. About ${BRANDING_CARD_BANNER_SIZE_LABEL}.`,
        variant: "destructive",
      });
      return;
    }
    setUploadingCardBanner(true);
    try {
      const response = await apiUploadRequest<{ cardBannerUrl: string }>(
        "/api/auth/account/branding/card-banner",
        file,
      );
      setPortalLayout((prev) => ({ ...prev, cardImage: "banner", cardBannerUrl: response.cardBannerUrl }));
      toast({ title: "Card banner uploaded" });
    } catch (error) {
      toast({
        title: "Could not upload banner",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setUploadingCardBanner(false);
      if (cardBannerInputRef.current) cardBannerInputRef.current.value = "";
    }
  };

  const removeCardBanner = () => {
    setPortalLayout((prev) => ({ ...prev, cardBannerUrl: null }));
  };

  const uploadOpenedBanner = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > BRANDING_BANNER_MAX_BYTES) {
      toast({
        title: "Unsupported photograph",
        description: `Use a PNG, JPEG, or WebP image, ${BRANDING_BANNER_SIZE_LABEL} px, under ${Math.round(BRANDING_BANNER_MAX_BYTES / (1024 * 1024))} MB.`,
        variant: "destructive",
      });
      return;
    }
    setUploadingOpenedBanner(true);
    try {
      const response = await apiUploadRequest<{ bannerUrl: string }>(
        "/api/auth/account/branding/opened-banner",
        file,
      );
      setOpenedNoteBranding((prev) => ({
        ...prev,
        background: "banner",
        bannerUrl: response.bannerUrl,
      }));
      toast({ title: "Opened-note photograph uploaded" });
    } catch (error) {
      toast({
        title: "Could not upload photograph",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setUploadingOpenedBanner(false);
      if (openedBannerInputRef.current) openedBannerInputRef.current.value = "";
    }
  };

  const uploadBusinessLogo = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast({
        title: "Unsupported logo",
        description: "Choose a PNG, JPEG, or WebP image.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > BRANDING_LOGO_MAX_BYTES) {
      toast({
        title: "Logo is too large",
        description: "Choose an image smaller than 1 MB.",
        variant: "destructive",
      });
      return;
    }
    setUploadingLogo(true);
    try {
      const response = await apiUploadRequest<{ ok: boolean; logoUrl: string }>(
        "/api/auth/account/branding/logo",
        file,
      );
      setBusinessLogoUrl(response.logoUrl);
      await refreshEntitlements();
      toast({
        title: "Logo uploaded",
        description: "It will be prefilled on new Business notes.",
      });
    } catch (error) {
      toast({
        title: "Could not upload logo",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const removeBusinessLogo = async () => {
    setRemovingLogo(true);
    try {
      await apiRequest("/api/auth/account/branding/logo", "DELETE");
      setBusinessLogoUrl(null);
      await refreshEntitlements();
      toast({ title: "Logo removed" });
    } catch (error) {
      toast({
        title: "Could not remove logo",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setRemovingLogo(false);
    }
  };

  const saveStatus = savingBranding ? (
    <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
      Saving…
    </span>
  ) : savedBrandingIndicator ? (
    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
      Saved
    </span>
  ) : null;

  if (authLoading || (user && prefsLoading)) {
    return (
      <AccountSettingsShell wide>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
          <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
        </div>
      </AccountSettingsShell>
    );
  }

  if (!user) {
    return (
      <AccountSettingsShell wide>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.authNavBranding || "Branding"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authBrandingGuestSubtitle || "Sign in to set the page recipients see when they open a note."}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-5 py-6 text-center dark:border-gray-800">
            <Button asChild size="sm">
              <a href="/auth/sign-in">{t.signIn || "Sign in"}</a>
            </Button>
          </div>
        </div>
      </AccountSettingsShell>
    );
  }

  return (
    <AccountSettingsShell wide>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.authNavBranding || "Branding"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authBrandingSubtitle || "How recipients recognise you on secure delivery pages. PrivateNote stays the trust layer."}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {saveStatus}
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
              Business
            </span>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-violet-200 dark:border-violet-900/60">
          {accountEntitlements.capabilities.revealBranding ? (
            <div className="space-y-5 px-5 py-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Label htmlFor="business-display-name" className="text-sm">
                    Display name
                  </Label>
                  <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Switch
                      checked={portalLayout.showCompanyName}
                      onCheckedChange={(checked) =>
                        setPortalLayout((prev) => ({ ...prev, showCompanyName: checked }))
                      }
                      aria-label="Show company name on the reveal card"
                    />
                    Show on card
                  </label>
                </div>
                <input
                  id="business-display-name"
                  value={businessDisplayName}
                  onChange={(event) => setBusinessDisplayName(event.target.value)}
                  maxLength={120}
                  placeholder="Company or team name"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 ${
                    portalLayout.showCompanyName ? "" : "opacity-50"
                  }`}
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Shown as the company name on branded reveal pages.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label htmlFor="business-sender-name" className="text-sm">Sender name</Label>
                    <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Switch
                        checked={portalLayout.showSenderName}
                        onCheckedChange={(checked) =>
                          setPortalLayout((prev) => ({ ...prev, showSenderName: checked }))
                        }
                        aria-label="Show sender name on the reveal card"
                      />
                      Show on card
                    </label>
                  </div>
                  <input id="business-sender-name" value={businessSenderName}
                    onChange={(event) => setBusinessSenderName(event.target.value)} maxLength={80}
                    placeholder="Marjan Skrobot"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 ${
                      portalLayout.showSenderName ? "" : "opacity-50"
                    }`} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label htmlFor="business-sender-role" className="text-sm">Role or department</Label>
                    <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Switch
                        checked={portalLayout.showSenderRole}
                        onCheckedChange={(checked) =>
                          setPortalLayout((prev) => ({ ...prev, showSenderRole: checked }))
                        }
                        aria-label="Show role on the reveal card"
                      />
                      Show on card
                    </label>
                  </div>
                  <input id="business-sender-role" value={businessSenderRole}
                    onChange={(event) => setBusinessSenderRole(event.target.value)} maxLength={80}
                    placeholder="Security Operations"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 ${
                      portalLayout.showSenderRole ? "" : "opacity-50"
                    }`} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Label htmlFor="business-trust-message" className="text-sm">Recipient trust message</Label>
                  <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Switch
                      checked={portalLayout.showTrustMessage}
                      onCheckedChange={(checked) =>
                        setPortalLayout((prev) => ({ ...prev, showTrustMessage: checked }))
                      }
                      aria-label="Show trust message on the reveal card"
                    />
                    Show on card
                  </label>
                </div>
                <textarea id="business-trust-message" value={businessTrustMessage}
                  onChange={(event) => setBusinessTrustMessage(event.target.value)} maxLength={160} rows={2}
                  placeholder="We use PrivateNote to deliver sensitive information securely."
                  className={`w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 ${
                    portalLayout.showTrustMessage ? "" : "opacity-50"
                  }`} />
                <p className="mt-1 text-right text-xs text-gray-500">{businessTrustMessage.length}/160</p>
              </div>

              <div>
                <Label className="mb-2 block text-sm">Show on the reveal card</Label>
                <div className="mb-4 grid gap-2 sm:grid-cols-2">
                  {([
                    {
                      id: "logo" as const,
                      label: "Logo",
                      hint: "Square mark. Optional name, role, and company sit with it.",
                    },
                    {
                      id: "banner" as const,
                      label: "Banner",
                      hint: "Wider lockup. Name, role, company, and trust message still show.",
                    },
                  ]).map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      aria-pressed={portalLayout.cardImage === choice.id}
                      onClick={() => setPortalLayout((prev) => ({ ...prev, cardImage: choice.id }))}
                      className={`rounded-lg border px-3 py-3 text-left ${
                        portalLayout.cardImage === choice.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <span className="block text-sm font-medium">{choice.label}</span>
                      <span className="mt-0.5 block text-[11px] font-normal text-gray-500 dark:text-gray-400">
                        {choice.hint}
                      </span>
                      {portalLayout.cardImage === choice.id ? (
                        <span className="mt-2 block text-[11px] font-medium">Selected</span>
                      ) : null}
                    </button>
                  ))}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadBusinessLogo(file);
                  }}
                />
                <input
                  ref={cardBannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadCardBanner(file);
                  }}
                />
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadBusinessBanner(file);
                  }}
                />
                <input
                  ref={openedBannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadOpenedBanner(file);
                  }}
                />
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 block text-sm">
                      Logo
                      {businessLogoUrl ? (
                        <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">Loaded</span>
                      ) : null}
                    </Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700">
                        {businessLogoUrl ? (
                          <img src={businessLogoUrl} alt="Current reveal logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingLogo || removingLogo}
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingLogo ? "Uploading…" : businessLogoUrl ? "Replace" : "Upload"}
                      </Button>
                      {businessLogoUrl ? (
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={uploadingLogo || removingLogo}
                          onClick={() => void removeBusinessLogo()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {removingLogo ? "Removing…" : "Remove"}
                        </Button>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Square mark. PNG, JPEG, or WebP; maximum {Math.round(BRANDING_LOGO_MAX_BYTES / (1024 * 1024))} MB. Recommended {BRANDING_LOGO_RECOMMENDED_PX.width}×{BRANDING_LOGO_RECOMMENDED_PX.height}.
                    </p>
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm">
                      Banner image
                      {portalLayout.cardBannerUrl ? (
                        <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">Loaded</span>
                      ) : null}
                    </Label>
                    <div
                      className="relative mb-3 w-full max-w-xl overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700"
                      style={{ aspectRatio: `${BRANDING_CARD_BANNER_RECOMMENDED_PX.width} / ${BRANDING_CARD_BANNER_RECOMMENDED_PX.height}` }}
                    >
                      {portalLayout.cardBannerUrl ? (
                        <img
                          src={portalLayout.cardBannerUrl}
                          alt="Current reveal banner"
                          className="absolute inset-0 h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                          <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                          <span className="text-xs">No banner yet</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingCardBanner}
                        onClick={() => cardBannerInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingCardBanner ? "Uploading…" : portalLayout.cardBannerUrl ? "Replace" : "Upload"}
                      </Button>
                      {portalLayout.cardBannerUrl ? (
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={uploadingCardBanner}
                          onClick={() => removeCardBanner()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Wide lockup, about {BRANDING_CARD_BANNER_SIZE_LABEL}; maximum {Math.round(BRANDING_CARD_BANNER_MAX_BYTES / (1024 * 1024))} MB. Names and trust message stay on the card.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-violet-100 pt-6 dark:border-violet-900/40">
                <BrandingPageHeading
                  eyebrow="Page"
                  title="Reveal page"
                  description="Default is a centered card on PrivateNote. Custom is a photograph you pan and scale."
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm">Page</Label>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {([
                    { id: "default" as const, label: "Default", hint: "Centered card, your colours" },
                    { id: "custom" as const, label: "Custom", hint: "Photograph behind the card" },
                  ]).map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => {
                        if (choice.id === "custom") {
                          setBusinessBackgroundStyle("banner");
                          return;
                        }
                        setBusinessBackgroundStyle(
                          brandingBackgroundStyleForPage(
                            "default",
                            brandingBackgroundFilter(businessBackgroundStyle),
                          ),
                        );
                      }}
                      className={`rounded-lg border px-3 py-2 text-left ${
                        brandingPageMode(businessBackgroundStyle) === choice.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <span className="block text-sm font-medium">{choice.label}</span>
                      <span className="mt-0.5 block text-[11px] font-normal text-gray-500 dark:text-gray-400">
                        {choice.hint}
                      </span>
                    </button>
                  ))}
                </div>

                {brandingPageMode(businessBackgroundStyle) === "default" ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block text-sm">Background</Label>
                      <div className="mb-3 inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => {
                            setBusinessBackgroundColor("#ffffff");
                            setBusinessBackgroundColorDraft("#ffffff");
                          }}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            brandingIsPrivateNoteCanvas(businessBackgroundColor)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          PrivateNote
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (brandingIsPrivateNoteCanvas(businessBackgroundColor)) {
                              setBusinessBackgroundColor("#e2e8f0");
                              setBusinessBackgroundColorDraft("#e2e8f0");
                            }
                          }}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            !brandingIsPrivateNoteCanvas(businessBackgroundColor)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          Color
                        </button>
                      </div>
                      <div className="space-y-4">
                        {!brandingIsPrivateNoteCanvas(businessBackgroundColor) ? (
                          <ColorField
                            id="business-background-color"
                            label="Page color"
                            value={businessBackgroundColor}
                            draft={businessBackgroundColorDraft}
                            onValue={setBusinessBackgroundColor}
                            onDraft={setBusinessBackgroundColorDraft}
                          />
                        ) : null}
                        <BackgroundFilterPicker
                          id="business-background-filter"
                          value={brandingBackgroundFilter(businessBackgroundStyle)}
                          accentColor={businessAccentColor}
                          backgroundColor={businessBackgroundColor}
                          onChange={(filter) =>
                            setBusinessBackgroundStyle(
                              brandingBackgroundStyleForPage("default", filter),
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorField
                        id="business-accent-color"
                        label="Reveal button"
                        value={businessAccentColor}
                        draft={businessAccentColorDraft}
                        onValue={(next) => {
                          setBusinessAccentColor(next);
                          setBusinessAccentColorDraft(next);
                        }}
                        onDraft={setBusinessAccentColorDraft}
                      />
                      <ColorField
                        id="business-text-color"
                        label="Button text"
                        value={businessTextColor}
                        draft={businessTextColorDraft}
                        onValue={(next) => {
                          setBusinessTextColor(next);
                          setBusinessTextColorDraft(next);
                        }}
                        onDraft={setBusinessTextColorDraft}
                      />
                    </div>
                    {brandingCtaStyle({
                      accentColor: businessAccentColor,
                      textColor: businessTextColor,
                    })?.color.toLowerCase() !== businessTextColor.toLowerCase() ? (
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        Button text will use a higher-contrast colour so it stays readable.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {brandingPageMode(businessBackgroundStyle) === "custom" ? (
                  <>
                    <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                      {businessBannerUrl
                        ? "One photograph. Click to set the focal point, then scale. The reveal card stays inset from the edges."
                        : "Upload one landscape photograph to use behind the reveal card."}
                    </p>
                <div
                  className="mb-3 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-slate-950 dark:border-gray-700"
                  style={{ aspectRatio: BRANDING_BANNER_ASPECT_RATIO }}
                >
                  {businessBannerUrl ? (
                    <button
                      type="button"
                      className="relative block h-full w-full cursor-crosshair"
                      aria-label="Set image focal point"
                      onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
                        setPortalLayout((prev) => ({
                          ...prev,
                          focalX: Math.min(100, Math.max(0, x)),
                          focalY: Math.min(100, Math.max(0, y)),
                        }));
                        if (businessBackgroundStyle !== "banner") {
                          setBusinessBackgroundStyle("banner");
                        }
                      }}
                    >
                      <img
                        src={businessBannerUrl}
                        alt="Custom recipient background"
                        className="h-full w-full object-contain"
                        style={{
                          transform: `scale(${(portalLayout.backgroundZoom ?? 100) / 100})`,
                          transformOrigin: `${portalLayout.focalX}% ${portalLayout.focalY}%`,
                        }}
                      />
                      <span
                        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow"
                        style={{
                          left: `${portalLayout.focalX}%`,
                          top: `${portalLayout.focalY}%`,
                        }}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center"
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <p className="m-0 text-sm font-semibold text-gray-200">
                        Upload a background photograph
                      </p>
                      <p className="m-0 text-xs text-gray-400">
                        {BRANDING_BANNER_RECOMMENDED_PX.width} × {BRANDING_BANNER_RECOMMENDED_PX.height} px · landscape
                      </p>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingBanner}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingBanner ? "Uploading…" : businessBannerUrl ? "Replace photograph" : "Upload photograph"}
                  </Button>
                  {businessBannerUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={uploadingBanner}
                      onClick={() => void removeBusinessBanner()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Recommended {BRANDING_BANNER_SIZE_LABEL} (16:9). Maximum{" "}
                  {Math.round(BRANDING_BANNER_MAX_BYTES / (1024 * 1024))} MB.
                  {businessBannerUrl
                    ? " Click the photo to set the focal point. Recipients cannot move the image."
                    : ""}
                </p>
                {businessBannerUrl ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="business-background-zoom" className="mb-2 block text-sm">
                        Scale {portalLayout.backgroundZoom ?? 100}%
                      </Label>
                      <input
                        id="business-background-zoom"
                        type="range"
                        min={BRANDING_BACKGROUND_ZOOM_MIN}
                        max={BRANDING_BACKGROUND_ZOOM_MAX}
                        value={portalLayout.backgroundZoom ?? 100}
                        onChange={(event) =>
                          setPortalLayout((prev) => ({
                            ...prev,
                            backgroundZoom: Number(event.target.value),
                          }))
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                    <ChoiceRow<BrandingOverlay>
                      label="Overlay"
                      value={portalLayout.overlay}
                      onChange={(overlay) =>
                        setPortalLayout((prev) => ({ ...prev, overlay }))
                      }
                      options={[
                        { id: "light", label: "Light" },
                        { id: "medium", label: "Medium" },
                        { id: "dark", label: "Dark" },
                      ]}
                    />
                    <div>
                      <div className="mb-3">
                        <Label className="text-sm">Reveal card</Label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Drag the card in the preview, or snap it with the grid. It stays inset from the edges.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-8">
                        <CardPositionPad
                          label="Desktop"
                          x={portalLayout.cardX}
                          y={portalLayout.cardY}
                          onChange={(cardX, cardY) => {
                            setPortalLayout((prev) => ({
                              ...prev,
                              cardX,
                              cardY,
                              cardPosition: brandingCardPositionFromPercent(cardX, cardY),
                            }));
                            setBrandingPreviewViewport("desktop");
                          }}
                        />
                        <MobileLanePad
                          label="Phone"
                          value={portalLayout.cardPositionMobile}
                          onChange={(cardPositionMobile) => {
                            const next = brandingCardPercentFromPosition(cardPositionMobile);
                            setPortalLayout((prev) => ({
                              ...prev,
                              cardPositionMobile,
                              cardXMobile: next.x,
                              cardYMobile: next.y,
                            }));
                            setBrandingPreviewViewport("mobile");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                  </>
                ) : null}
              </div>

              <PreviewDeviceFrame
                viewport={brandingPreviewViewport}
                onViewportChange={setBrandingPreviewViewport}
                hint={
                  brandingPageMode(businessBackgroundStyle) === "custom" && businessBannerUrl
                    ? "Drag the white card to place it. The grid snaps to edges and corners."
                    : "This is the page recipients see before they reveal the note."
                }
              >
                <BrandingPreview
                  viewport={brandingPreviewViewport}
                  onCardPlace={
                    brandingPageMode(businessBackgroundStyle) === "custom"
                      ? (x, y) => {
                          if (brandingPreviewViewport === "mobile") {
                            setPortalLayout((prev) => ({
                              ...prev,
                              cardXMobile: x,
                              cardYMobile: y,
                              cardPositionMobile: brandingCardPositionFromPercent(x, y),
                            }));
                            return;
                          }
                          setPortalLayout((prev) => ({
                            ...prev,
                            cardX: x,
                            cardY: y,
                            cardPosition: brandingCardPositionFromPercent(x, y),
                          }));
                        }
                      : undefined
                  }
                  branding={{
                    companyName: portalLayout.showCompanyName ? businessDisplayName || undefined : undefined,
                    senderName: portalLayout.showSenderName ? businessSenderName || undefined : undefined,
                    senderRole: portalLayout.showSenderRole ? businessSenderRole || undefined : undefined,
                    trustMessage: portalLayout.showTrustMessage ? businessTrustMessage || undefined : undefined,
                    logoUrl: businessLogoUrl ?? undefined,
                    bannerUrl: businessBannerUrl ?? undefined,
                    accentColor: businessAccentColor,
                    backgroundColor: businessBackgroundColor,
                    textColor: businessTextColor,
                    backgroundStyle: businessBackgroundStyle,
                    ...portalLayout,
                  }}
                />
              </PreviewDeviceFrame>

              <div className="space-y-5 border-t border-violet-100 pt-6 dark:border-violet-900/40">
                <BrandingPageHeading
                  eyebrow="Page"
                  title="After the note is opened"
                  description="Off by default so screenshots stay unbranded. When on, the message stays centered — you can change the page behind it."
                />
                <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Label
                        htmlFor="business-show-branding-after-reveal"
                        className="text-sm font-medium text-amber-950 dark:text-amber-50"
                      >
                        Show branding after the note is opened
                      </Label>
                      <p className="mt-1 text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/80">
                        Off by default. When on, the opened note keeps this page’s
                        colours and layout. Logo and sender details are optional below.
                      </p>
                    </div>
                    <Switch
                      id="business-show-branding-after-reveal"
                      checked={openedNoteBranding.show}
                      onCheckedChange={(checked) =>
                        setOpenedNoteBranding((prev) => ({
                          ...prev,
                          show: checked,
                          ...(checked &&
                          (prev.background === "neutral" || prev.background === "same")
                            ? {
                                background: brandingBackgroundFilter(businessBackgroundStyle),
                                ...(prev.backgroundColor
                                  ? {}
                                  : {
                                      backgroundColor: brandingIsPrivateNoteCanvas(
                                        businessBackgroundColor,
                                      )
                                        ? "#e2e8f0"
                                        : businessBackgroundColor,
                                    }),
                              }
                            : {}),
                        }))
                      }
                      aria-label="Show branding after the note is opened"
                    />
                  </div>
                </div>
                <ColorField
                  id="note-border-color"
                  label="Note text border"
                  value={openedNoteBranding.noteBorderColor || businessAccentColor}
                  draft={openedNoteBorderDraft}
                  onValue={(next) => {
                    setOpenedNoteBranding((prev) => ({ ...prev, noteBorderColor: next }));
                    setOpenedNoteBorderDraft(next);
                  }}
                  onDraft={setOpenedNoteBorderDraft}
                />

                {openedNoteBranding.show ? (
                  <>
                    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
                      <div className="min-w-0 flex-1">
                        <Label
                          htmlFor="opened-show-identity"
                          className="text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Show logo and sender details
                        </Label>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                          Logo, sender name, company, and trust message. Turn off to
                          keep the branded page without that identity.
                        </p>
                      </div>
                      <Switch
                        id="opened-show-identity"
                        checked={
                          openedNoteBranding.showLogo ||
                          openedNoteBranding.showSenderName ||
                          openedNoteBranding.showCompanyName ||
                          openedNoteBranding.showTrustMessage
                        }
                        onCheckedChange={(checked) =>
                          setOpenedNoteBranding((prev) => ({
                            ...prev,
                            showLogo: checked,
                            showSenderName: checked,
                            showCompanyName: checked,
                            showTrustMessage: checked,
                          }))
                        }
                        aria-label="Show logo and sender details on the opened note"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm">Opened page</Label>
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        {([
                          { id: "neutral" as const, label: "Default", hint: "Centered note, your colours" },
                          { id: "banner" as const, label: "Custom", hint: "Photograph behind the note" },
                        ]).map((choice) => (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() =>
                              setOpenedNoteBranding((prev) => ({
                                ...prev,
                                background: choice.id,
                                ...(choice.id === "neutral" && !prev.backgroundColor
                                  ? {
                                      backgroundColor: brandingIsPrivateNoteCanvas(businessBackgroundColor)
                                        ? "#e2e8f0"
                                        : businessBackgroundColor,
                                    }
                                  : {}),
                              }))
                            }
                            className={`rounded-lg border px-3 py-2 text-left ${
                              (choice.id === "neutral"
                                ? openedPageIsDefault
                                : openedNoteBranding.background === choice.id)
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <span className="block text-sm font-medium">{choice.label}</span>
                            <span className="mt-0.5 block text-[11px] font-normal text-gray-500 dark:text-gray-400">
                              {choice.hint}
                            </span>
                          </button>
                        ))}
                      </div>
                      {openedPageIsDefault ? (
                        <div className="space-y-4">
                          <ColorField
                            id="opened-page-color"
                            label="Page color"
                            value={openedNoteBranding.backgroundColor || "#e2e8f0"}
                            draft={openedPageColorDraft}
                            onValue={(next) => {
                              setOpenedNoteBranding((prev) => ({ ...prev, backgroundColor: next }));
                              setOpenedPageColorDraft(next);
                            }}
                            onDraft={setOpenedPageColorDraft}
                          />
                        </div>
                      ) : null}
                      {openedNoteBranding.background === "banner" ? (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            The opened message stays centered. This photograph is only the page behind it.
                          </p>
                          <div
                            className="overflow-hidden rounded-lg border border-dashed border-gray-300 bg-slate-950 dark:border-gray-700"
                            style={{ aspectRatio: BRANDING_BANNER_ASPECT_RATIO }}
                          >
                            {openedNoteBranding.bannerUrl ? (
                              <img
                                src={openedNoteBranding.bannerUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                style={{
                                  transform: `scale(${openedBackgroundZoom / 100})`,
                                  transformOrigin: `${portalLayout.focalX}% ${portalLayout.focalY}%`,
                                }}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-white/60">
                                No photograph yet
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingOpenedBanner}
                              onClick={() => openedBannerInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {uploadingOpenedBanner
                                ? "Uploading…"
                                : openedNoteBranding.bannerUrl
                                  ? "Replace photograph"
                                  : "Upload photograph"}
                            </Button>
                            {openedNoteBranding.bannerUrl ? (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                  setOpenedNoteBranding((prev) => ({ ...prev, bannerUrl: null }))
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            ) : null}
                          </div>
                          {openedNoteBranding.bannerUrl ? (
                            <div>
                              <Label htmlFor="opened-background-zoom" className="mb-2 block text-sm">
                                Scale {openedBackgroundZoom}%
                              </Label>
                              <input
                                id="opened-background-zoom"
                                type="range"
                                min={BRANDING_BACKGROUND_ZOOM_MIN}
                                max={BRANDING_BACKGROUND_ZOOM_MAX}
                                value={openedBackgroundZoom}
                                onChange={(event) =>
                                  setOpenedNoteBranding((prev) => ({
                                    ...prev,
                                    backgroundZoom: Number(event.target.value),
                                  }))
                                }
                                className="w-full accent-primary"
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorField
                        id="opened-accent-color"
                        label="Copy Note button"
                        value={openedNoteBranding.accentColor || businessAccentColor}
                        draft={openedAccentDraft}
                        onValue={(next) => {
                          setOpenedNoteBranding((prev) => ({ ...prev, accentColor: next }));
                          setOpenedAccentDraft(next);
                        }}
                        onDraft={setOpenedAccentDraft}
                      />
                      <ColorField
                        id="opened-text-color"
                        label="Button text"
                        value={openedNoteBranding.textColor || businessTextColor}
                        draft={openedTextDraft}
                        onValue={(next) => {
                          setOpenedNoteBranding((prev) => ({ ...prev, textColor: next }));
                          setOpenedTextDraft(next);
                        }}
                        onDraft={setOpenedTextDraft}
                      />
                    </div>
                    <PreviewDeviceFrame
                      viewport={brandingPreviewViewport}
                      onViewportChange={setBrandingPreviewViewport}
                      showViewportToggle={false}
                      label="After the note is opened"
                      hint="Actions stay inside the note card so they stay readable on any page colour."
                    >
                      <OpenedNoteBrandingPreview
                        viewport={brandingPreviewViewport}
                        branding={applyOpenedNoteBranding({
                          companyName: businessDisplayName || undefined,
                          senderName: businessSenderName || undefined,
                          senderRole: businessSenderRole || undefined,
                          trustMessage: businessTrustMessage || undefined,
                          logoUrl: businessLogoUrl ?? undefined,
                          bannerUrl: businessBannerUrl ?? undefined,
                          accentColor: businessAccentColor,
                          backgroundColor: businessBackgroundColor,
                          textColor: businessTextColor,
                          backgroundStyle: businessBackgroundStyle,
                          ...portalLayout,
                          showBrandingAfterReveal: true,
                          openedBackground: openedNoteBranding.background,
                          openedBannerUrl: openedNoteBranding.bannerUrl || undefined,
                          openedAccentColor: openedNoteBranding.accentColor || undefined,
                          openedTextColor: openedNoteBranding.textColor || undefined,
                          openedBackgroundColor: openedNoteBranding.backgroundColor || undefined,
                          openedBackgroundZoom: openedNoteBranding.backgroundZoom || undefined,
                          noteBorderColor: openedNoteBranding.noteBorderColor || undefined,
                          openedShowLogo: openedNoteBranding.showLogo,
                          openedShowSenderName: openedNoteBranding.showSenderName,
                          openedShowCompanyName: openedNoteBranding.showCompanyName,
                          openedShowTrustMessage: openedNoteBranding.showTrustMessage,
                        })}
                      />
                    </PreviewDeviceFrame>
                  </>
                ) : null}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Branding is public reveal metadata only. It never includes note
                content, titles, or previews. After open, branding stays hidden
                unless you opt in above. Changes save automatically.
              </p>
            </div>

          ) : (
            <div className="px-5 py-5">
              <div className="flex items-start gap-3">
                <Crown className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Available with Business
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    Add your logo, colours, and a Default or Custom reveal page.
                    Stored branding remains retained if you downgrade.
                  </p>
                  {(businessDisplayName || businessLogoUrl) ? (
                    <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                      Your saved branding is retained but currently inactive.
                    </p>
                  ) : null}
                  <Button asChild size="sm" className="mt-3">
                    <a href="/account">View account plan</a>
                  </Button>
                </div>
              </div>
            </div>

          )}
        </section>
      </div>
    </AccountSettingsShell>
  );
}
