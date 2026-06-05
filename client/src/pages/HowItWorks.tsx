import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lock,
  PenLine,
  Share2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import {
  HowAiFlowStepGuide,
  HowAiPrivacyTicker,
} from "@/components/features/HowAiFlow";

const FLOW_HEADER_EASE = [0.16, 1, 0.3, 1] as const;
const FLOW_STEP_EASE = [0.22, 1, 0.36, 1] as const;
/** Heading slides in from the left. */
const FLOW_HEADER_MS = 1250;
const FLOW_SUBTITLE_MS = 1100;
const FLOW_SUBTITLE_DELAY_S = 0.45;
/** Write appears soon after the title finishes (subtitle still easing in). */
const FLOW_WRITE_AFTER_HEADER_MS = FLOW_HEADER_MS + 260;
/** Card / arrow enter transitions. */
const FLOW_CARD_REVEAL_MS = 560;
const FLOW_WRITE_CARD_MS = 720;
const FLOW_ARROW_REVEAL_MS = 480;
const FLOW_SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;
/** Infrastructure / manual reveal entrance (subtle). */
const FLOW_INFRA_MS = 420;
const FLOW_INFRA_AFTER_COMPLETE_DELAY_MS = 520;
const HOW_SECTION_REVEAL_Y = 18;
const HOW_SECTION_TITLE_CLASS =
  "text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl";
const HOW_INFRA_SECTION_TITLE_CLASS =
  "text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl";
const HOW_SECTION_SUBTEXT_CLASS =
  "text-xl leading-relaxed text-gray-600 dark:text-gray-400 md:text-2xl";
const HOW_SUBSECTION_TITLE_CLASS =
  "text-2xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-3xl";
const HOW_SUBSECTION_HELPER_CLASS =
  "text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl";
const HOW_SUBSECTION_BODY_CLASS =
  "text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl";
const HOW_AI_DETAIL_TRANSITION_CLASS =
  "text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl";
const HOW_AI_CHOICE_CARD_REVEAL_MS = 560;
const HOW_AI_CHOICE_CLOUD_DELAY_S = 0.22;
const howAiChoiceCardTransition = {
  duration: HOW_AI_CHOICE_CARD_REVEAL_MS / 1000,
  ease: FLOW_SMOOTH_EASE,
} as const;
const HOW_VISUAL_REVEAL_Y = 8;
const HOW_VISUAL_MAX_CLASS = "w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px]";
const HOW_VISUAL_REVEAL_MS = 400;
const howVisualRevealTransition = {
  duration: HOW_VISUAL_REVEAL_MS / 1000,
  ease: FLOW_SMOOTH_EASE,
} as const;
/** Phases: write → arrow → encrypt → arrow → share (neutral) → all blue. */
const FLOW_PHASE_SHARE = 4;
const FLOW_PHASE_DONE = 5;
const FLOW_WHEEL_COOLDOWN_MS = 520;
/**
 * Idle auto-advance (user not scrolling): pause on each beat so the flow reads naturally.
 * Write → arrow → Encrypt → arrow → Share (neutral) → all cards blue.
 */
const FLOW_AUTO_AFTER_WRITE_MS = 1200;
const FLOW_AUTO_ARROW_MS = 900;
const FLOW_AUTO_AFTER_CARD_MS = 1150;
const FLOW_AUTO_BEFORE_HIGHLIGHT_MS = 1050;

function flowAutoAdvanceDelay(phase: number) {
  if (phase === 0) return FLOW_AUTO_AFTER_WRITE_MS;
  if (phase === 1 || phase === 3) return FLOW_AUTO_ARROW_MS;
  if (phase === 2) return FLOW_AUTO_AFTER_CARD_MS;
  if (phase === FLOW_PHASE_SHARE) return FLOW_AUTO_BEFORE_HIGHLIGHT_MS;
  return 0;
}

function useFlowSequence(
  sectionRef: React.RefObject<HTMLElement | null>,
  writeReady: boolean,
  headingReady: boolean,
  skip: boolean,
) {
  const [engaged, setEngaged] = useState(false);
  const [phase, setPhase] = useState(0);
  const cooldownRef = useRef(false);

  const complete = skip || phase >= FLOW_PHASE_DONE;

  useEffect(() => {
    if (skip) {
      setPhase(FLOW_PHASE_DONE);
      return;
    }
    if (engaged || !headingReady) return;

    const el = sectionRef.current;
    if (!el) return;

    const tryEngage = () => {
      const top = el.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.48) {
        setEngaged(true);
      }
    };

    tryEngage();
    window.addEventListener("scroll", tryEngage, { passive: true });
    return () => window.removeEventListener("scroll", tryEngage);
  }, [engaged, headingReady, sectionRef, skip]);

  useEffect(() => {
    if (!engaged || complete || !writeReady) return;

    const advance = (direction: 1 | -1) => {
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setPhase((p) =>
        direction > 0
          ? Math.min(FLOW_PHASE_DONE, p + 1)
          : Math.max(0, p - 1),
      );
      window.setTimeout(() => {
        cooldownRef.current = false;
      }, FLOW_WHEEL_COOLDOWN_MS);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 4) advance(1);
      else if (e.deltaY < -4) advance(-1);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      const delta = touchY - y;
      if (Math.abs(delta) < 28) return;
      e.preventDefault();
      advance(delta > 0 ? 1 : -1);
      touchY = y;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [engaged, complete, writeReady, sectionRef]);

  useEffect(() => {
    if (!engaged || complete || !writeReady) return;

    const delay = flowAutoAdvanceDelay(phase);
    if (delay <= 0) return;

    const id = window.setTimeout(() => {
      setPhase((p) => Math.min(FLOW_PHASE_DONE, p + 1));
    }, delay);

    return () => window.clearTimeout(id);
  }, [engaged, complete, writeReady, phase]);

  return { phase, complete, engaged };
}

type PrivacyFlowStep = {
  title: string;
  detail: string;
  icon: React.ReactNode;
};

function FlowConnectorArrow({
  pointing,
  visible,
  vertical = false,
  className = "hidden shrink-0 items-center justify-center md:flex",
}: {
  pointing: boolean;
  visible: boolean;
  vertical?: boolean;
  className?: string;
}) {
  const Icon = vertical ? ArrowDown : ArrowRight;
  const soft = { duration: FLOW_ARROW_REVEAL_MS / 1000, ease: FLOW_SMOOTH_EASE };

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          key={vertical ? "arrow-v" : "arrow-h"}
          className={className}
          initial={{ opacity: 0, scale: 0.9, x: vertical ? 0 : -8, y: vertical ? -8 : 0 }}
          animate={{
            opacity: pointing ? 1 : 0.4,
            scale: pointing ? 1.05 : 1,
            x: pointing && !vertical ? [0, 4, 0] : 0,
            y: pointing && vertical ? [0, 4, 0] : 0,
          }}
          exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.35, ease: FLOW_SMOOTH_EASE } }}
          transition={{
            opacity: { ...soft },
            scale: { ...soft },
            x:
              pointing && !vertical
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { ...soft },
            y:
              pointing && vertical
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { ...soft },
          }}
          aria-hidden
        >
          <Icon
            className={`h-5 w-5 transition-colors duration-500 ease-out ${pointing ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
            strokeWidth={pointing ? 2.25 : 2}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PrivacyFlowSteps({
  steps,
  phase,
  writeReady,
  allHighlighted,
  instant,
}: {
  steps: PrivacyFlowStep[];
  phase: number;
  writeReady: boolean;
  allHighlighted: boolean;
  instant?: boolean;
}) {
  const cardTransition = { duration: FLOW_CARD_REVEAL_MS / 1000, ease: FLOW_SMOOTH_EASE };
  const writeCardTransition = { duration: FLOW_WRITE_CARD_MS / 1000, ease: FLOW_SMOOTH_EASE };
  const colorTransition = "transition-colors duration-500 ease-out";

  const writeRevealed = instant || writeReady;
  const encryptRevealed = instant || phase >= 2;
  const shareRevealed = instant || phase >= FLOW_PHASE_SHARE;

  const arrowToEncryptPointing = !instant && phase === 1;
  const arrowToSharePointing = !instant && phase === 3;

  const cardNeutral =
    "border-gray-200/80 bg-white/80 shadow-sm dark:border-gray-800/90 dark:bg-gray-950/60";
  const cardHighlighted =
    "border-primary/35 bg-primary/[0.05] shadow-md shadow-primary/10 dark:border-primary/40 dark:bg-primary/10";

  const cardSlotClass =
    "w-full min-h-[168px] shrink-0 md:w-[220px] md:max-w-[220px] lg:w-[240px] lg:max-w-[260px]";
  const arrowSlotClass = "hidden h-9 w-9 shrink-0 items-center justify-center md:flex md:self-center";
  const arrowSlotMobileClass =
    "flex h-9 w-full shrink-0 items-center justify-center md:hidden";

  return (
    <div
      className="mt-10 flex min-h-[min(560px,72vh)] flex-col items-center gap-4 md:mt-12 md:min-h-[188px] md:flex-row md:items-stretch md:justify-center md:gap-3 lg:gap-5"
      aria-label="Privacy flow steps"
    >
      {steps.map((step, i) => {
        const stepRevealed =
          i === 0 ? writeRevealed : i === 1 ? encryptRevealed : shareRevealed;
        const arrowVisible = i === 0 ? writeRevealed : encryptRevealed;
        const arrowPointing =
          i === 0 ? arrowToEncryptPointing : i === 1 ? arrowToSharePointing : false;

        return (
          <React.Fragment key={step.title}>
            <div className={cardSlotClass}>
              <motion.div
                className={
                  `h-full rounded-2xl border p-5 ` +
                  (stepRevealed
                    ? `${allHighlighted ? cardHighlighted : cardNeutral} ${colorTransition}`
                    : `pointer-events-none border-transparent bg-transparent shadow-none ${colorTransition}`)
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: stepRevealed ? 1 : 0 }}
                transition={i === 0 ? writeCardTransition : cardTransition}
                aria-hidden={!stepRevealed}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      allHighlighted && stepRevealed
                        ? `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 ${colorTransition}`
                        : `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 ring-1 ring-gray-200/90 dark:bg-gray-800/80 dark:text-gray-200 dark:ring-gray-700/80 ${colorTransition}`
                    }
                  >
                    {step.icon}
                  </span>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{step.title}</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{step.detail}</p>
              </motion.div>
            </div>
            {i < steps.length - 1 ? (
              <>
                <div className={arrowSlotClass} aria-hidden={!arrowVisible}>
                  <FlowConnectorArrow visible={arrowVisible} pointing={arrowPointing} />
                </div>
                <div className={arrowSlotMobileClass} aria-hidden={!arrowVisible}>
                  <FlowConnectorArrow visible={arrowVisible} pointing={arrowPointing} vertical />
                </div>
              </>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function HowItWorks() {
  const { t, language } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const pinSectionRef = useRef<HTMLElement>(null);
  const [flowHeadingSeen, setFlowHeadingSeen] = useState(false);
  const [writeReady, setWriteReady] = useState(false);
  const skipSequence = prefersReducedMotion === true;
  const { phase, complete: flowSequenceComplete } = useFlowSequence(
    pinSectionRef,
    writeReady,
    flowHeadingSeen,
    skipSequence,
  );
  const allStepsHighlighted = skipSequence || phase >= FLOW_PHASE_DONE;

  useEffect(() => {
    if (!flowHeadingSeen || writeReady || prefersReducedMotion === true) return;
    const id = window.setTimeout(() => setWriteReady(true), FLOW_WRITE_AFTER_HEADER_MS);
    return () => window.clearTimeout(id);
  }, [flowHeadingSeen, writeReady, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion === true) {
      setFlowHeadingSeen(true);
      setWriteReady(true);
    }
  }, [prefersReducedMotion]);

  const flowSteps = [
    {
      title: t.write,
      detail: t.writeStepDetail,
      icon: <PenLine className="h-5 w-5" />,
    },
    {
      title: t.encrypt,
      detail: t.howEncryptStepDetail,
      icon: <Lock className="h-5 w-5" />,
    },
    {
      title: t.share,
      detail: t.shareStepDetail,
      icon: <Share2 className="h-5 w-5" />,
    },
  ];
  const infrastructureItems = [
    t.howInfrastructureItemCiphertext,
    t.howInfrastructureItemMinimizedData,
    t.howInfrastructureItemEuStorage,
  ];

  return (
    <MotionConfig reducedMotion="user">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 mb-20 relative">
      {/* Reduced background glows (less noise) */}
      <div className="absolute top-[-80px] right-1/4 w-80 h-80 bg-primary/10 blur-[130px] -z-10" />
      <div className="absolute bottom-[120px] left-1/4 w-56 h-56 bg-blue-500/10 blur-[120px] -z-10" />

      <div className="space-y-8">
        {/* Hero + privacy flow share one scroll pin; infra unlocks after all three steps */}
        <section ref={pinSectionRef} className="relative">
          <div className="space-y-8 pb-8 md:space-y-10 lg:space-y-11">
            <div className="text-center">
              <h1 className="page-title relative z-10 mb-6 bg-clip-text pb-2 leading-[1.05] text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 md:mb-8">
                {t.howHeroPrefix} <span className="text-primary italic">{t.howHeroAccent}</span>
              </h1>
              <p className="relative z-10 mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
                {t.howHeroSubtitle}
              </p>
            </div>

            <div className="pt-12 text-center md:pt-16 md:text-left lg:pt-20">
              <motion.h2
                className={`text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl`}
                initial={{ opacity: 0, x: -44 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: FLOW_HEADER_MS / 1000, ease: FLOW_HEADER_EASE }}
                onViewportEnter={() => setFlowHeadingSeen(true)}
              >
                {t.simplePrivacyFlow}
              </motion.h2>
              <motion.p
                className={`mx-auto mt-4 max-w-2xl md:mx-0 ${HOW_SECTION_SUBTEXT_CLASS}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: FLOW_SUBTITLE_MS / 1000,
                  delay: FLOW_SUBTITLE_DELAY_S,
                  ease: FLOW_HEADER_EASE,
                }}
              >
                {t.clearSteps}
              </motion.p>
            </div>

            <PrivacyFlowSteps
              steps={flowSteps}
              phase={phase}
              writeReady={writeReady}
              allHighlighted={allStepsHighlighted}
              instant={skipSequence}
            />
          </div>
        </section>

        {/* Infrastructure & Manual Reveal */}
        <motion.section
          className="relative isolate -mt-2 space-y-24 border-t border-gray-200/70 pt-12 md:space-y-32 md:pt-14 lg:space-y-40 lg:pt-16 dark:border-gray-800/70"
          initial={{ opacity: 0, y: HOW_SECTION_REVEAL_Y }}
          animate={
            flowSequenceComplete
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: HOW_SECTION_REVEAL_Y }
          }
          transition={{
            duration: FLOW_INFRA_MS / 1000,
            delay: flowSequenceComplete ? FLOW_INFRA_AFTER_COMPLETE_DELAY_MS / 1000 : 0,
            ease: FLOW_STEP_EASE,
          }}
        >
          <div className="how-section-ambient -z-10" aria-hidden>
            <div className="how-section-ambient__blob how-section-ambient__blob--primary" />
            <div className="how-section-ambient__blob how-section-ambient__blob--blue" />
          </div>

          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-2xl">
              <h2 className={`mb-4 ${HOW_INFRA_SECTION_TITLE_CLASS}`}>
                {t.howInfrastructureTitle}
              </h2>
              <p className={`max-w-xl mb-5 ${HOW_SECTION_SUBTEXT_CLASS}`}>
                {t.howInfrastructureBody}
              </p>

              <div className="space-y-3">
                {infrastructureItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300"
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-w-0 justify-center">
              <motion.div
                className={`how-visual-fade-right ${HOW_VISUAL_MAX_CLASS} mx-auto`}
                initial={{ opacity: 0, y: HOW_VISUAL_REVEAL_Y }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={howVisualRevealTransition}
              >
              <div className="how-visual-stage">
                <div className="how-visual-glow" aria-hidden />
                <svg
                  className="how-visual-float relative z-[1] block h-auto w-full drop-shadow-[0_10px_24px_rgba(37,99,235,0.08)]"
                  viewBox="0 0 360 200"
                  fill="none"
                  role="img"
                  aria-label={t.howInfrastructureIllustration}
                >
                  <defs>
                    <radialGradient id="infraGlow" cx="180" cy="100" r="150" gradientUnits="userSpaceOnUse">
                      <stop stopColor="hsl(var(--primary))" stopOpacity="0.09" />
                      <stop offset="0.5" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
                      <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect x="0" y="0" width="360" height="200" fill="url(#infraGlow)" />
                  <path
                    className="how-visual-dash"
                    d="M78 118 C116 70 144 146 180 92 C218 38 244 128 286 78"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="7 7"
                    opacity="0.32"
                  />
                  <g id="servers">
                    <rect
                      x="100"
                      y="80"
                      width="45"
                      height="70"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect className="how-visual-pulse" x="110" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="110" y="102" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="110" y="112" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="113" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="122" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="132" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />

                    <rect
                      x="157"
                      y="50"
                      width="45"
                      height="100"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect className="how-visual-pulse" x="167" y="62" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="167" y="72" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="167" y="82" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="167" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="170" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="179" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="189" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="170" cy="125" r="3" fill="hsl(var(--primary))" />
                    <circle cx="179" cy="125" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="189" cy="125" r="3" fill="hsl(var(--primary))" opacity="0.5" />

                    <rect
                      x="214"
                      y="80"
                      width="45"
                      height="70"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect className="how-visual-pulse" x="224" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="224" y="102" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="224" y="112" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="227" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="236" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="246" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                  </g>
                </svg>
              </div>
              </motion.div>
            </div>
          </div>

          <div className="grid min-w-0 items-center gap-10 border-t border-gray-200/60 pt-14 lg:grid-cols-2 lg:gap-14 lg:pt-16 dark:border-gray-800/60">
            <div className="flex min-w-0 justify-center">
              <motion.div
                className={`how-visual-fade-left ${HOW_VISUAL_MAX_CLASS} mx-auto`}
                initial={{ opacity: 0, y: HOW_VISUAL_REVEAL_Y }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={howVisualRevealTransition}
              >
              <div className="how-visual-stage">
                <div className="how-visual-glow how-visual-glow--alert" aria-hidden />
                <svg
                  className="how-visual-float relative z-[1] block h-auto w-full drop-shadow-[0_10px_24px_rgba(220,38,38,0.06)]"
                  viewBox="0 0 360 200"
                  fill="none"
                  role="img"
                  aria-label={t.howManualRevealIllustration}
                >
                <defs>
                  <radialGradient id="threatGlow" cx="180" cy="100" r="150" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(var(--primary))" stopOpacity="0.07" />
                    <stop offset="0.5" stopColor="hsl(var(--primary))" stopOpacity="0.025" />
                    <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="360" height="200" fill="url(#threatGlow)" />
                <g id="note">
                  <rect
                    x="130"
                    y="60"
                    width="100"
                    height="80"
                    rx="8"
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                  />
                  <rect x="145" y="80" width="70" height="4" rx="2" fill="hsl(var(--border))" />
                  <rect x="145" y="92" width="60" height="4" rx="2" fill="hsl(var(--border))" opacity="0.7" />
                  <rect x="145" y="104" width="65" height="4" rx="2" fill="hsl(var(--border))" opacity="0.7" />
                </g>

                <g id="bot">
                  <rect
                    x="80"
                    y="140"
                    width="40"
                    height="40"
                    rx="8"
                    fill="hsl(var(--primary))"
                    opacity="0.14"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <circle cx="90" cy="153" r="4" fill="hsl(var(--primary))" />
                  <circle cx="110" cy="153" r="4" fill="hsl(var(--primary))" />
                  <line
                    x1="100"
                    y1="140"
                    x2="100"
                    y2="128"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="125" r="3" fill="hsl(var(--primary))" />
                  <line
                    className="how-visual-dash"
                    x1="120"
                    y1="150"
                    x2="145"
                    y2="110"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                </g>

                <g id="blocked" className="how-visual-pulse">
                  <circle cx="205" cy="105" r="22" fill="hsl(var(--destructive))" opacity="0.08" />
                  <line
                    x1="195"
                    y1="95"
                    x2="215"
                    y2="115"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="215"
                    y1="95"
                    x2="195"
                    y2="115"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
                </svg>
              </div>
              </motion.div>
            </div>

            <div className="max-w-2xl">
              <h2 className={`mb-4 ${HOW_INFRA_SECTION_TITLE_CLASS}`}>
                {t.howManualRevealTitle}
              </h2>
              <p className={`mb-5 ${HOW_SECTION_SUBTEXT_CLASS}`}>
                {t.howManualRevealBody}
              </p>
              <p className={`italic ${HOW_SECTION_SUBTEXT_CLASS}`}>
                “{t.howManualRevealQuote}”
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200/60 pt-16 pb-12 md:pt-22 md:pb-16 lg:pt-28 lg:pb-20 dark:border-gray-800/60">
            <div className="w-full min-w-0">
              <div className="w-full max-w-none">
                <h2 className={HOW_INFRA_SECTION_TITLE_CLASS}>
                  {t.howAiSectionTitle}
                </h2>
                <p className={`mt-6 w-full max-w-none text-pretty md:mt-8 ${HOW_SECTION_SUBTEXT_CLASS}`}>
                  {t.howAiIntro}
                </p>
                <div className="mt-20 grid w-full max-w-none gap-8 md:mt-24 md:grid-cols-2 md:gap-10 lg:mt-28">
                  <motion.div
                    className="flex min-h-[220px] flex-col rounded-2xl border border-primary/25 bg-primary/[0.04] p-5 dark:border-primary/30 dark:bg-primary/10"
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={howAiChoiceCardTransition}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t.howAiFirstChoice}
                    </p>
                    <div className="mt-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t.howPrivateAiTitle}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {t.howPrivateAiHelper}
                    </p>
                    <div className="mt-auto flex justify-end pt-7">
                      <span className="inline-flex max-w-[15rem] rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-center text-xs font-semibold leading-snug text-primary sm:max-w-none sm:text-sm dark:border-primary/35 dark:bg-primary/15 dark:text-primary-foreground">
                        {t.howPrivateAiBadge}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex min-h-[220px] flex-col rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/50"
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      ...howAiChoiceCardTransition,
                      delay: HOW_AI_CHOICE_CLOUD_DELAY_S,
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {t.howAiFallbackChoice}
                    </p>
                    <div className="mt-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t.howCloudAssistTitle}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {t.howCloudAssistHelper}
                    </p>
                    <div className="mt-auto flex justify-end pt-7">
                      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-center text-xs font-semibold leading-snug text-red-700 sm:text-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                        {t.howCloudAssistBadge}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <p className={`mt-20 mb-16 w-full max-w-none text-pretty md:mt-28 md:mb-20 lg:mt-32 lg:mb-24 ${HOW_AI_DETAIL_TRANSITION_CLASS}`}>
                {t.howAiDetailTransition}
              </p>

              <div className="mt-16 space-y-20 md:mt-20 md:space-y-24 lg:space-y-28">
                <div className="lg:min-h-[44vh]">
                  <div className="flex h-full flex-col items-center text-center">
                    <div className="mx-auto mb-12 max-w-2xl border-b border-primary/10 pb-10 text-center md:mb-14 md:pb-12 lg:mb-16">
                      <h3 className={HOW_SUBSECTION_TITLE_CLASS}>{t.howPrivateAiTitle}</h3>
                      <p className={`mx-auto mt-4 max-w-xl ${HOW_SUBSECTION_HELPER_CLASS}`}>
                        {t.howPrivateAiHelper}
                      </p>
                    </div>

                    <div className="mx-auto w-full min-w-0 max-w-4xl">
                      <HowAiFlowStepGuide
                        title={t.howPrivateAiFlowGuideTitle}
                        variant="private"
                        animateMarkers
                        cycleDurationS={18}
                        steps={[
                          {
                            label: t.howAiPrivateStepDownload,
                            detail: t.howPrivateAiFlowStepDownloadDetail,
                          },
                          {
                            label: t.howAiPrivateStepLoad,
                            detail: t.howPrivateAiFlowStepLoadDetail,
                          },
                          {
                            label: t.howAiPrivateStepRequest,
                            detail: t.howPrivateAiFlowStepRequestDetail,
                          },
                          {
                            label: t.howAiPrivateStepAccept,
                            detail: t.howPrivateAiFlowStepAcceptDetail,
                          },
                          { label: t.encrypt, detail: t.howPrivateAiFlowStepEncryptDetail },
                          { label: t.share, detail: t.howPrivateAiFlowStepShareDetail },
                        ]}
                      />
                    </div>
                    <div className="mt-20 w-full md:mt-28 lg:mt-32">
                      <HowAiPrivacyTicker
                        segments={[
                          t.howPrivateAiPrivacyTicker1,
                          t.howPrivateAiPrivacyTicker2,
                        ]}
                        variant="private"
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
                  <p className={HOW_SUBSECTION_BODY_CLASS}>{t.howAiCloudTransition}</p>
                </div>

                <div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mx-auto mb-12 max-w-2xl border-b border-red-200/50 pb-10 text-center md:mb-14 md:pb-12 lg:mb-16 dark:border-red-900/40">
                      <h3 className={HOW_SUBSECTION_TITLE_CLASS}>{t.howCloudAssistTitle}</h3>
                      <p className={`mx-auto mt-4 max-w-xl ${HOW_SUBSECTION_HELPER_CLASS}`}>
                        {t.howCloudAssistHelper}
                      </p>
                    </div>

                    <div className="mx-auto w-full min-w-0 max-w-4xl">
                      <HowAiFlowStepGuide
                        title={t.howCloudAssistFlowGuideTitle}
                        variant="cloud"
                        animateMarkers
                        cycleDurationS={15}
                        steps={[
                          {
                            label: t.howCloudAssistFlowStepTemplate,
                            detail: t.howCloudAssistFlowStepTemplateDetail,
                          },
                          {
                            label: t.howCloudAssistTitle,
                            detail: t.howCloudAssistFlowStepCloudDetail,
                          },
                          {
                            label: t.howAiPrivateStepAccept,
                            detail: t.howCloudAssistFlowStepAcceptDetail,
                          },
                          { label: t.encrypt, detail: t.howCloudAssistFlowStepEncryptDetail },
                          { label: t.share, detail: t.howCloudAssistFlowStepShareDetail },
                        ]}
                      />
                    </div>
                    <div className="mt-20 w-full md:mt-28 lg:mt-32">
                      <HowAiPrivacyTicker
                        segments={[
                          t.howCloudAssistPrivacyTicker1,
                          t.howCloudAssistPrivacyTicker2,
                        ]}
                        variant="cloud"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action — padding-top avoids margin collapse with the section above */}
        <div className="pt-16 sm:pt-20 lg:pt-24 xl:pt-28">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 rounded-[2.5rem] bg-primary p-10 text-white relative overflow-hidden group sm:p-12 lg:gap-12 lg:p-14">
          <Sparkles className="absolute -right-10 -top-10 h-56 w-56 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-3xl font-bold leading-tight sm:text-[2rem]">{t.howCtaTitle}</h3>
            <p className="max-w-md text-base font-medium leading-relaxed text-primary-foreground/85 sm:text-lg">
              {t.howCtaSubtitle}
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link
              href={localizedPath("/", language)}
              className="px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {t.howCtaButton}
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}
