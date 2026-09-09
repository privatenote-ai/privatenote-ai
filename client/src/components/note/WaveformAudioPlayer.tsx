import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { createAudioContext, formatRecordingDuration } from "@/utils/voiceMessageRecording";
import {
  downsamplePeaks,
  extractWaveformPeaks,
  peaksFromFrequencyBins,
  placeholderPeaks,
  WAVEFORM_PEAK_RESOLUTION,
} from "@/utils/audioWaveform";

const SKIP_SECONDS = 10;
const MIN_BARS = 36;
const MAX_BARS = 120;

type WaveformAudioPlayerProps = {
  src: string;
  blob?: Blob | null;
  onError?: () => void;
  className?: string;
  size?: "default" | "compact";
};

export function WaveformAudioPlayer({
  src,
  blob = null,
  onError,
  className,
  size = "default",
}: WaveformAudioPlayerProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [barCount, setBarCount] = useState(64);
  const [decodedPeaks, setDecodedPeaks] = useState<number[] | null>(null);
  const [dragging, setDragging] = useState(false);

  const compact = size === "compact";
  const labelPlay = t.audioPlayerPlay ?? "Play";
  const labelPause = t.audioPlayerPause ?? "Pause";
  const labelSkipBack = t.audioPlayerSkipBack ?? "Back 10 seconds";
  const labelSkipForward = t.audioPlayerSkipForward ?? "Forward 10 seconds";
  const labelMute = t.audioPlayerMute ?? "Mute";
  const labelUnmute = t.audioPlayerUnmute ?? "Unmute";
  const labelSeek = t.audioPlayerSeek ?? "Seek";

  useEffect(() => {
    const node = waveformRef.current;
    if (!node) return;
    const update = () => {
      const width = node.getBoundingClientRect().width;
      setBarCount(Math.max(MIN_BARS, Math.min(MAX_BARS, Math.round(width / 3.25))));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    setDecodedPeaks(null);
    void extractWaveformPeaks(blob ?? src, WAVEFORM_PEAK_RESOLUTION)
      .then((peaks) => {
        if (!cancelled) setDecodedPeaks(peaks);
      })
      .catch(() => {
        if (!cancelled) setDecodedPeaks(null);
      });
    return () => {
      cancelled = true;
    };
  }, [blob, src]);

  const bars = useMemo(
    () => downsamplePeaks(decodedPeaks ?? placeholderPeaks(WAVEFORM_PEAK_RESOLUTION), barCount),
    [barCount, decodedPeaks],
  );

  const syncFromAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    setIsPlaying(!audio.paused && !audio.ended);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    audio.load();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", syncFromAudio);
    audio.addEventListener("loadedmetadata", syncFromAudio);
    audio.addEventListener("durationchange", syncFromAudio);
    const handleError = () => onErrorRef.current?.();
    audio.addEventListener("error", handleError);
    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", syncFromAudio);
      audio.removeEventListener("loadedmetadata", syncFromAudio);
      audio.removeEventListener("durationchange", syncFromAudio);
      audio.removeEventListener("error", handleError);
    };
  }, [src, syncFromAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!isPlaying || dragging) return;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) setCurrentTime(audio.currentTime);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [dragging, isPlaying]);

  const seekToRatio = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const next = Math.min(Math.max(ratio, 0), 1) * audio.duration;
    audio.currentTime = next;
    setCurrentTime(next);
  }, []);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const node = waveformRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.width <= 0) return;
      seekToRatio((clientX - rect.left) / rect.width);
    },
    [seekToRatio],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => seekFromClientX(event.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, seekFromClientX]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        if (audio.ended || (duration > 0 && audio.currentTime >= duration - 0.05)) {
          audio.currentTime = 0;
        }
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      onErrorRef.current?.();
    }
  };

  const skip = (delta: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), audio.duration || 0);
    syncFromAudio();
  };

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const knownDuration = duration > 0 && Number.isFinite(duration);

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2.5 rounded-2xl border border-gray-200/90 bg-gradient-to-b from-white to-gray-50/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-gray-700 dark:from-gray-900 dark:to-gray-950",
        compact ? "px-2.5 py-2" : "px-3 py-2.5 sm:gap-3 sm:px-3.5 sm:py-3",
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        controlsList="nodownload noplaybackrate noremoteplayback"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />

      <IconRoundButton
        label={isPlaying ? labelPause : labelPlay}
        onClick={() => void togglePlay()}
        emphasis
        size="md"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" fill="currentColor" aria-hidden />
        ) : (
          <Play className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden />
        )}
      </IconRoundButton>

      {compact ? null : (
        <IconRoundButton
          label={labelSkipBack}
          onClick={() => skip(-SKIP_SECONDS)}
          className="hidden sm:inline-flex"
          size="sm"
        >
          <SkipBack className="h-3.5 w-3.5" aria-hidden />
        </IconRoundButton>
      )}

      <div
        ref={waveformRef}
        role="slider"
        tabIndex={0}
        aria-label={labelSeek}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration || 0)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${formatRecordingDuration(currentTime)} / ${
          knownDuration ? formatRecordingDuration(duration) : "—"
        }`}
        className={cn(
          "relative flex min-w-0 flex-1 cursor-pointer items-center touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2",
          compact ? "h-10" : "h-12 sm:h-14",
        )}
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging(true);
          seekFromClientX(event.clientX);
        }}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            void togglePlay();
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            skip(-5);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            skip(5);
          } else if (event.key === "Home") {
            event.preventDefault();
            seekToRatio(0);
          } else if (event.key === "End") {
            event.preventDefault();
            seekToRatio(1);
          }
        }}
      >
        <AmplitudeBars peaks={bars} progress={progress} />
      </div>

      {compact ? null : (
        <IconRoundButton
          label={labelSkipForward}
          onClick={() => skip(SKIP_SECONDS)}
          className="hidden sm:inline-flex"
          size="sm"
        >
          <SkipForward className="h-3.5 w-3.5" aria-hidden />
        </IconRoundButton>
      )}

      <p
        className={cn(
          "shrink-0 tabular-nums text-gray-500 dark:text-gray-400",
          compact ? "text-[11px]" : "text-xs sm:text-[13px]",
        )}
      >
        <span className="text-gray-800 dark:text-gray-100">
          {formatRecordingDuration(currentTime)}
        </span>
        <span className="mx-0.5 text-gray-300 dark:text-gray-600">/</span>
        <span>{knownDuration ? formatRecordingDuration(duration) : "—:—"}</span>
      </p>

      {compact ? null : (
        <IconRoundButton
          label={isMuted ? labelUnmute : labelMute}
          onClick={() => setIsMuted((value) => !value)}
          className="hidden sm:inline-flex"
          size="sm"
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Volume2 className="h-3.5 w-3.5" aria-hidden />
          )}
        </IconRoundButton>
      )}
    </div>
  );
}

export function LiveAmplitudeMeter({
  stream,
  active,
  className,
}: {
  stream: MediaStream | null;
  active: boolean;
  className?: string;
}) {
  const meterId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const barCountRef = useRef(48);
  const [peaks, setPeaks] = useState<number[]>(() => placeholderPeaks(48));

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => {
      const width = node.getBoundingClientRect().width;
      barCountRef.current = Math.max(28, Math.min(80, Math.round(width / 4)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !stream) {
      setPeaks(placeholderPeaks(barCountRef.current).map((value) => value * 0.35));
      return;
    }

    let cancelled = false;
    let context: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let frame = 0;

    const start = async () => {
      try {
        context = createAudioContext();
        if (context.state === "suspended") await context.resume();
        if (cancelled) return;
        source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;
        source.connect(analyser);
        const bins = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(bins);
          setPeaks(peaksFromFrequencyBins(bins, barCountRef.current));
          frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setPeaks(placeholderPeaks(barCountRef.current));
      }
    };

    void start();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      try {
        source?.disconnect();
      } catch {
        // ignore
      }
      void context?.close();
    };
  }, [active, stream]);

  return (
    <div
      ref={containerRef}
      id={meterId}
      className={cn(
        "flex h-[3.75rem] w-full items-center rounded-xl px-2",
        active
          ? "bg-red-500/[0.06] dark:bg-red-500/10"
          : "bg-gray-100/90 dark:bg-gray-800/70",
        className,
      )}
      aria-hidden
    >
      <AmplitudeBars peaks={peaks} progress={active ? 1 : 0} playingTone={active} />
    </div>
  );
}

function AmplitudeBars({
  peaks,
  progress,
  playingTone = false,
}: {
  peaks: number[];
  progress: number;
  playingTone?: boolean;
}) {
  return (
    <div className="flex h-full w-full items-center gap-px">
      {peaks.map((peak, index) => {
        const played = (index + 0.5) / peaks.length <= progress;
        return (
          <span
            key={index}
            className={cn(
              "inline-block min-w-[2px] flex-1 rounded-full",
              played
                ? playingTone
                  ? "bg-red-500"
                  : "bg-primary"
                : "bg-gray-300 dark:bg-gray-600",
            )}
            style={{ height: `${10 + peak * 90}%` }}
          />
        );
      })}
    </div>
  );
}

function IconRoundButton({
  label,
  onClick,
  children,
  emphasis = false,
  size = "md",
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  emphasis?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        size === "md" ? "h-11 w-11" : "h-8 w-8",
        emphasis
          ? "bg-primary text-white shadow-sm hover:bg-primary/90"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        className,
      )}
    >
      {children}
    </button>
  );
}
