import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Check, ChevronDown, Languages, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  brandingChromeUsesLightText,
  brandingLogoIsSolo,
  brandingCardMarkIsBanner,
  brandingOverlayOpacity,
  brandingPageBackground,
  brandingPortalLayout,
  brandingShowsBanner,
  brandingUsesPortalSurface,
  brandingCardAxis,
  brandingCardPlacePercent,
  BRANDING_CARD_INSET_PX,
  type BrandingCardPosition,
  type RevealBranding,
} from "@shared/businessBranding";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LANGUAGE_OPTIONS,
  type SupportedLanguage,
  type Translations,
} from "@/utils/translation";

export type RecipientPortalSurface = "plain" | "card" | "wide";

type RecipientPortalProps = {
  branding?: RevealBranding;
  children: ReactNode;
  t: Translations;
  language: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
  surface?: RecipientPortalSurface;
  /** Scaled-down live preview in account settings. */
  preview?: boolean;
  previewViewport?: "desktop" | "mobile";
  /** Preview only: free-place the reveal card by dragging. */
  onCardPlace?: (x: number, y: number) => void;
};

function resolveSurface(
  branding: RevealBranding | undefined,
  surface: RecipientPortalSurface | undefined,
): RecipientPortalSurface {
  if (surface) return surface;
  return brandingUsesPortalSurface(branding) ? "card" : "plain";
}

function cardPlacementClassName(
  desktop: BrandingCardPosition,
  mobile: BrandingCardPosition,
  mode: "live" | "desktop" | "mobile",
): string {
  const axisClass = (
    position: BrandingCardPosition,
    breakpoint: "base" | "sm",
  ): string => {
    const { x, y } = brandingCardAxis(position);
    if (breakpoint === "base") {
      const xClass = x === "left" ? "items-start" : x === "right" ? "items-end" : "items-center";
      const yClass = y === "top" ? "justify-start" : y === "bottom" ? "justify-end" : "justify-center";
      return `${xClass} ${yClass}`;
    }
    const xClass = x === "left" ? "sm:items-start" : x === "right" ? "sm:items-end" : "sm:items-center";
    const yClass = y === "top" ? "sm:justify-start" : y === "bottom" ? "sm:justify-end" : "sm:justify-center";
    return `${xClass} ${yClass}`;
  };

  if (mode === "desktop") {
    const { x, y } = brandingCardAxis(desktop);
    const gutter = x === "left" ? "pl-12 pr-10" : x === "right" ? "pr-12 pl-10" : "px-12";
    const stack = y === "top" ? "pt-10 pb-14" : y === "bottom" ? "pt-14 pb-10" : "py-12";
    return `${axisClass(desktop, "base")} ${gutter} ${stack}`;
  }
  if (mode === "mobile") {
    return `${axisClass(mobile, "base")} px-6 py-10`;
  }

  const { x, y } = brandingCardAxis(desktop);
  const gutter =
    x === "left" ? "sm:pl-12 sm:pr-10 lg:pl-16" : x === "right" ? "sm:pr-12 sm:pl-10 lg:pr-16" : "sm:px-12";
  const stack =
    y === "top" ? "sm:pt-10 sm:pb-14" : y === "bottom" ? "sm:pt-14 sm:pb-10" : "sm:py-12";
  return `${axisClass(mobile, "base")} px-6 py-10 ${axisClass(desktop, "sm")} ${gutter} ${stack}`;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function RecipientPortal({
  branding,
  children,
  t,
  language,
  onLanguageChange,
  surface,
  preview = false,
  previewViewport = "desktop",
  onCardPlace,
}: RecipientPortalProps) {
  const page = brandingPageBackground(branding);
  const layout = brandingPortalLayout(branding);
  const overlayOpacity = brandingOverlayOpacity(branding);
  const zoom = layout.backgroundZoom ?? 100;
  const resolvedSurface = resolveSurface(branding, surface);
  const useCard = resolvedSurface === "card" || resolvedSurface === "wide";
  const lightChrome = brandingChromeUsesLightText(branding);
  const languageLabel =
    LANGUAGE_OPTIONS.find((option) => option.code === language)?.nativeName ?? "English";
  const languageControl = Boolean(onLanguageChange) && !preview;
  const placementMode = preview ? previewViewport : "live";
  const [liveNarrow, setLiveNarrow] = useState(false);
  useEffect(() => {
    if (preview) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setLiveNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [preview]);
  const placeViewport: "desktop" | "mobile" = preview
    ? previewViewport
    : liveNarrow
      ? "mobile"
      : "desktop";
  /** Opened note (`wide`) stays centered; Default is always centered; Custom follows sender placement. */
  const honorSenderPlacement = resolvedSurface === "card" && brandingShowsBanner(branding);
  const freePlace = honorSenderPlacement;
  /** Opened note sheet is centered on the full page, not in the leftover strip between chrome. */
  const openedCentered = resolvedSurface === "wide";
  const overlayChrome = openedCentered;
  const cardPlacement = cardPlacementClassName(
    honorSenderPlacement ? layout.cardPosition : "center",
    honorSenderPlacement ? layout.cardPositionMobile : "center",
    placementMode,
  );
  const place = brandingCardPlacePercent(layout, placeViewport);
  const wideCard = brandingLogoIsSolo(branding) || brandingCardMarkIsBanner(branding);
  const previewRevealCard = preview && resolvedSurface === "card";
  const revealCardSize = previewRevealCard
    ? wideCard
      ? "w-[min(100%,20rem)] p-4"
      : "w-[min(100%,18rem)] p-4"
    : wideCard
      ? "w-[min(100%,36rem)] p-5 sm:p-7"
      : "w-[min(100%,24rem)] p-5 sm:p-6";
  const centeredRevealCardSize = previewRevealCard
    ? wideCard
      ? "max-w-[20rem] p-4"
      : "max-w-[18rem] p-4"
    : wideCard
      ? "max-w-md p-5 sm:max-w-xl sm:p-7"
      : "max-w-[20rem] p-5 sm:max-w-sm sm:p-6";
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ grabX: number; grabY: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const canDrag = Boolean(preview && freePlace && onCardPlace);

  const moveCard = useCallback(
    (clientX: number, clientY: number) => {
      if (!onCardPlace || !dragRef.current || !stageRef.current || !cardRef.current) return;
      const stage = stageRef.current.getBoundingClientRect();
      const card = cardRef.current.getBoundingClientRect();
      const availW = Math.max(1, stage.width - card.width);
      const availH = Math.max(1, stage.height - card.height);
      const left = clientX - dragRef.current.grabX - stage.left;
      const top = clientY - dragRef.current.grabY - stage.top;
      onCardPlace(clampPercent((left / availW) * 100), clampPercent((top / availH) * 100));
    },
    [onCardPlace],
  );

  const onCardPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canDrag || !cardRef.current) return;
    if ((event.target as HTMLElement).closest("button, a, input, textarea, select")) return;
    const card = cardRef.current.getBoundingClientRect();
    dragRef.current = { grabX: event.clientX - card.left, grabY: event.clientY - card.top };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const onCardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    moveCard(event.clientX, event.clientY);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const chromeText = lightChrome
    ? "text-white"
    : "text-primary dark:text-blue-300";
  const footerMuted = lightChrome
    ? "text-white/80"
    : "text-gray-600/80 dark:text-gray-300/75";

  const shellClass = preview
    ? "relative flex h-full w-full min-h-0 flex-col overflow-hidden bg-white dark:bg-gray-950"
    : "relative flex min-h-[100dvh] w-full flex-col";

  return (
    <div
      className={shellClass}
      style={
        page.kind === "gradient"
          ? { background: page.background }
          : page.kind === "color"
            ? { backgroundColor: page.backgroundColor }
            : page.kind === "image"
              ? { backgroundColor: "#020617" }
              : undefined
      }
    >
      {page.kind === "image" ? (
        <>
          <img
            src={page.url}
            alt=""
            className={`pointer-events-none absolute inset-0 h-full w-full ${
              layout.backgroundFit === "fit" && zoom === 100
                ? "object-contain"
                : "object-cover"
            }`}
            style={{
              objectPosition: `${layout.focalX}% ${layout.focalY}%`,
              transform:
                zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: `${layout.focalX}% ${layout.focalY}%`,
            }}
            loading={preview ? "lazy" : "eager"}
            referrerPolicy="no-referrer"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: `rgba(15, 23, 42, ${overlayOpacity})` }}
            aria-hidden
          />
        </>
      ) : null}

      <header
        className={`${overlayChrome ? "absolute inset-x-0 top-0" : "relative"} z-20 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 ${
          page.kind === "image" ? "bg-gradient-to-b from-black/55 to-transparent" : ""
        }`}
      >
        <a
          href="/"
          className={`inline-flex items-center gap-2 ${chromeText} ${preview ? "pointer-events-none" : ""}`}
          aria-label="PrivateNote.ai"
          tabIndex={preview ? -1 : undefined}
          onClick={preview ? (event) => event.preventDefault() : undefined}
        >
          <Logo size={28} className="shrink-0" />
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            privateNote
            <span className="ml-0.5 align-super text-[0.65em] font-semibold">.ai</span>
          </span>
        </a>

        {languageControl ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium shadow-none ${
                lightChrome
                  ? "border-white/25 bg-white/10 text-white hover:bg-white/15"
                  : "border-gray-200 bg-white/80 text-gray-800 hover:bg-white dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100"
              }`}
              aria-label={`${t.language ?? "Language"}: ${languageLabel}`}
            >
              <Languages className="h-3.5 w-3.5 opacity-80" aria-hidden />
              <span>{languageLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[11rem]">
              {LANGUAGE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  className="flex items-center justify-between"
                  onSelect={() => onLanguageChange?.(option.code)}
                >
                  <span>{option.nativeName}</span>
                  {language === option.code ? <Check className="h-4 w-4" aria-hidden /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium shadow-none ${
              lightChrome
                ? "border-white/25 bg-white/10 text-white"
                : "border-gray-200 bg-white/80 text-gray-800 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100"
            }`}
          >
            <Languages className="h-3.5 w-3.5 opacity-80" aria-hidden />
            {languageLabel}
            <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </span>
        )}
      </header>

      <div
        className={`relative z-10 min-h-0 flex-1 ${
          freePlace
            ? ""
            : openedCentered
              ? "overflow-y-auto"
              : `flex min-h-0 flex-col overflow-y-auto ${useCard ? cardPlacement : "px-4 pt-4 sm:px-6 sm:pt-6"}`
        }`}
      >
        {useCard ? (
          freePlace ? (
            <div
              ref={stageRef}
              className="absolute"
              style={{
                top: placeViewport === "mobile" ? 24 : BRANDING_CARD_INSET_PX,
                right: placeViewport === "mobile" ? 24 : BRANDING_CARD_INSET_PX,
                bottom: placeViewport === "mobile" ? 24 : BRANDING_CARD_INSET_PX,
                left: placeViewport === "mobile" ? 24 : BRANDING_CARD_INSET_PX,
              }}
            >
              <div
                ref={cardRef}
                onPointerDown={onCardPointerDown}
                onPointerMove={onCardPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={`rounded-2xl bg-white shadow-xl ring-1 ring-black/5 [&_h1.page-title]:text-xl [&_h1.page-title]:sm:text-2xl ${revealCardSize} ${canDrag ? "touch-none select-none" : ""} ${
                  dragging ? "cursor-grabbing" : canDrag ? "cursor-grab" : ""
                }`}
                style={{
                  position: "absolute",
                  left: `${place.x}%`,
                  top: `${place.y}%`,
                  transform: `translate(-${place.x}%, -${place.y}%)`,
                }}
              >
                {children}
              </div>
            </div>
          ) : openedCentered ? (
            <div
              className={`flex w-full items-center justify-center px-6 py-24 sm:px-12 ${
                preview ? "min-h-full" : "min-h-[100dvh]"
              }`}
            >
              <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:p-6 [&_h1.page-title]:text-xl [&_h1.page-title]:sm:text-2xl">
                {children}
              </div>
            </div>
          ) : (
            <div
              className={`mx-auto w-full shrink-0 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 [&_h1.page-title]:text-xl [&_h1.page-title]:sm:text-2xl ${centeredRevealCardSize}`}
            >
              {children}
            </div>
          )
        ) : (
          <div className="w-full max-w-6xl">{children}</div>
        )}
      </div>

      <footer
        className={`${overlayChrome ? "absolute inset-x-0 bottom-0" : "relative"} z-20 px-4 py-4 text-center text-xs sm:px-6 sm:text-sm ${footerMuted} ${
          page.kind === "image" ? "bg-gradient-to-t from-black/50 to-transparent" : ""
        }`}
      >
        <p className="m-0 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <Lock className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          <span>{t.revealTrustEncrypted ?? "End-to-end encrypted"}</span>
          <span aria-hidden>·</span>
          <span>{t.revealTrustNoAccount ?? "No account required"}</span>
          <span aria-hidden>·</span>
          <span>{t.revealSecuredByPrivateNote ?? "Secured by PrivateNote"}</span>
        </p>
      </footer>
    </div>
  );
}

type RevealHandoffCardProps = {
  branding?: RevealBranding;
  brandingLine: string | null;
  logo: ReactNode;
  title?: ReactNode;
  subtitle?: string;
  action: ReactNode;
  footnote?: string;
  compact?: boolean;
};

/** Identity + action that sits inside the recipient card (or the default column). */
export function RevealHandoffStack({
  branding,
  brandingLine,
  logo,
  title,
  subtitle,
  action,
  footnote,
  compact = false,
}: RevealHandoffCardProps) {
  const sender = branding?.senderName?.trim();
  const role = branding?.senderRole?.trim();
  const company = branding?.companyName?.trim();
  const meta = [role, company].filter(Boolean).join(" · ");
  const hasIdentity = Boolean(logo || sender || company || brandingLine);

  return (
    <div className="flex flex-col items-center text-center">
      {logo ? (
        <div className={`flex w-full justify-center ${compact ? "mb-2.5" : "mb-5"}`}>
          {logo}
        </div>
      ) : null}
      {title ? (
        <h1
          className={
            compact
              ? "m-0 text-lg font-bold tracking-tight text-gray-900"
              : "page-title text-gray-900 dark:text-white"
          }
        >
          {title}
        </h1>
      ) : null}
      {subtitle ? (
        <p
          className={
            compact
              ? "m-0 mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500"
              : "m-0 mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-500 dark:text-gray-400 sm:text-xl"
          }
        >
          {subtitle}
        </p>
      ) : null}

      {hasIdentity || branding?.trustMessage ? (
        <div className={compact ? `${title ? "mt-3" : ""} space-y-1` : "mt-8 space-y-1 sm:mt-10"}>
          {sender ? (
            <p className={`m-0 font-semibold text-gray-900 ${compact ? "text-sm" : "text-base"}`}>
              {sender}
            </p>
          ) : brandingLine ? (
            <p className="m-0 text-sm font-medium text-gray-700 dark:text-gray-200">{brandingLine}</p>
          ) : null}
          {meta ? <p className="m-0 text-xs text-gray-500 sm:text-sm">{meta}</p> : null}
          {branding?.trustMessage ? (
            <p className={`m-0 mx-auto max-w-xs text-sm leading-relaxed text-gray-600 ${compact ? "mt-1.5" : "mt-3"}`}>
              {branding.trustMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={`${compact ? "mt-4" : "mt-10 sm:mt-12"} w-full`}>{action}</div>
      {footnote ? (
        <p className={`m-0 ${compact ? "mt-3 text-xs text-gray-500" : "mt-4 text-sm text-gray-600/70 dark:text-gray-300/60 sm:mt-5"}`}>
          {footnote}
        </p>
      ) : null}
    </div>
  );
}
