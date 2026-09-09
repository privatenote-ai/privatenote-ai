import { useEffect, useRef, useState } from "react";
import { Mic, Video, Square, RotateCcw, Check, SwitchCamera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { formatNoteFileSize } from "@shared/noteFileLimits";
import {
  VOICE_MESSAGE_MAX_DURATION_SECONDS,
  VOICE_MESSAGE_WAV_SAMPLE_RATE,
  concatFloat32,
  createAudioContext,
  createVoiceMessageFile,
  downsampleToRate,
  encodeWavMonoFloat32,
  formatRecordingDuration,
  isVoiceRecordingSupported,
  pickVoiceRecordingStrategy,
  type VoiceRecordingFormatPreference,
  type VoiceRecordingStrategy,
} from "@/utils/voiceMessageRecording";
import type { CameraFacing } from "@/utils/photoCapture";
import { toggleCameraFacing } from "@/utils/photoCapture";
import {
  createVideoMessageFile,
  isVideoRecordingSupported,
  pickVideoBitsPerSecond,
  pickVideoRecordingStrategy,
  type RecordCaptureMode,
  videoAndAudioConstraints,
  type VideoRecordingStrategy,
} from "@/utils/videoMessageRecording";
import { LiveAmplitudeMeter, WaveformAudioPlayer } from "@/components/note/WaveformAudioPlayer";

type RecorderPhase = "idle" | "recording" | "preview";

type VoiceMessageRecorderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecorded: (file: File) => void;
  maxBytes: number;
  /** Plan-based recording cap; defaults to Free (5 minutes). */
  maxDurationSeconds?: number;
  /** Premium preference: auto / wav / m4a. Free always uses auto. */
  formatPreference?: VoiceRecordingFormatPreference;
  initialMode?: RecordCaptureMode;
};

function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

export function VoiceMessageRecorderDialog({
  open,
  onOpenChange,
  onRecorded,
  maxBytes,
  maxDurationSeconds = VOICE_MESSAGE_MAX_DURATION_SECONDS,
  formatPreference = "auto",
  initialMode = "audio",
}: VoiceMessageRecorderDialogProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<RecorderPhase>("idle");
  const [recordMode, setRecordMode] = useState<RecordCaptureMode>(initialMode);
  const [facing, setFacing] = useState<CameraFacing>("user");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const durationCapSeconds = Math.max(1, Math.floor(maxDurationSeconds));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const inputSampleRateRef = useRef(VOICE_MESSAGE_WAV_SAMPLE_RATE);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const strategyRef = useRef<VoiceRecordingStrategy>(
    pickVoiceRecordingStrategy(formatPreference),
  );
  const videoStrategyRef = useRef<VideoRecordingStrategy | null>(pickVideoRecordingStrategy());
  const recordedBlobRef = useRef<Blob | null>(null);
  const recordedModeRef = useRef<RecordCaptureMode>(initialMode);
  const recordModeRef = useRef<RecordCaptureMode>(initialMode);
  const facingRef = useRef<CameraFacing>("user");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const discardOnStopRef = useRef(false);
  const previewGenerationRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopWavGraph = async () => {
    try {
      scriptProcessorRef.current?.disconnect();
    } catch {
      // ignore
    }
    try {
      sourceNodeRef.current?.disconnect();
    } catch {
      // ignore
    }
    scriptProcessorRef.current = null;
    sourceNodeRef.current = null;
    const ctx = audioContextRef.current;
    audioContextRef.current = null;
    if (ctx) {
      try {
        await ctx.close();
      } catch {
        // ignore
      }
    }
  };

  const attachLiveVideo = (stream: MediaStream) => {
    setLiveStream(stream);
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    void video.play().catch(() => {
      // Autoplay can fail if the tab is backgrounded.
    });
  };

  const finalizeRecordingBlob = (blob: Blob) => {
    const shouldDiscard = discardOnStopRef.current;
    discardOnStopRef.current = false;
    if (shouldDiscard) return;

    const emptyMessage =
      recordedModeRef.current === "video"
        ? (t.recordVideoEmpty ?? "No video was captured. Try recording again.")
        : (t.recordMessageEmpty ?? "No audio was captured. Try recording again.");

    if (blob.size <= 0) {
      setErrorMessage(emptyMessage);
      setPhase("idle");
      return;
    }
    if (blob.size > maxBytes) {
      setErrorMessage(
        (t.fileTooLargeDescription ?? "Maximum file size is {limit} for your account.").replace(
          "{limit}",
          formatNoteFileSize(maxBytes),
        ),
      );
      setPhase("idle");
      return;
    }

    recordedBlobRef.current = blob;
    setPreviewIsVideo(recordedModeRef.current === "video");
    const url = URL.createObjectURL(blob);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setPhase("preview");
  };

  const resetRecorderState = (options?: { discardActiveRecording?: boolean; keepMode?: boolean }) => {
    previewGenerationRef.current += 1;
    clearTimer();
    if (options?.discardActiveRecording) {
      discardOnStopRef.current = true;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore stop races while tearing down
      }
    }
    mediaRecorderRef.current = null;
    void stopWavGraph();
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    setLiveStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    chunksRef.current = [];
    pcmChunksRef.current = [];
    recordedBlobRef.current = null;
    setPhase("idle");
    setElapsedSeconds(0);
    setIsStarting(false);
    setErrorMessage(null);
    setPreviewIsVideo(false);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (!options?.keepMode) {
      facingRef.current = "user";
      setFacing("user");
    }
  };

  useEffect(() => {
    if (!open) {
      resetRecorderState({ discardActiveRecording: true });
      return;
    }
    const nextMode = initialMode;
    recordModeRef.current = nextMode;
    recordedModeRef.current = nextMode;
    setRecordMode(nextMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog closes/opens
  }, [open, initialMode]);

  useEffect(() => {
    return () => {
      resetRecorderState({ discardActiveRecording: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unmount cleanup only
  }, []);

  const startVideoStream = async (nextFacing: CameraFacing): Promise<MediaStream> => {
    try {
      return await navigator.mediaDevices.getUserMedia(videoAndAudioConstraints(nextFacing));
    } catch {
      return await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    }
  };

  const ensureVideoPreview = async () => {
    if (!isVideoRecordingSupported()) {
      setErrorMessage(
        t.recordVideoUnsupported ?? "Video recording is not supported in this browser.",
      );
      return;
    }
    if (streamRef.current?.getVideoTracks().length) {
      attachLiveVideo(streamRef.current);
      return;
    }

    const generation = ++previewGenerationRef.current;
    setIsStarting(true);
    setErrorMessage(null);
    try {
      const stream = await startVideoStream(facingRef.current);
      if (generation !== previewGenerationRef.current) {
        stopMediaStream(stream);
        return;
      }
      streamRef.current = stream;
      attachLiveVideo(stream);
    } catch {
      if (generation !== previewGenerationRef.current) return;
      setErrorMessage(
        t.recordVideoDenied ??
          "Camera and microphone access are required to record video. Allow access and try again.",
      );
    } finally {
      if (generation === previewGenerationRef.current) {
        setIsStarting(false);
      }
    }
  };

  useEffect(() => {
    if (!open || recordMode !== "video" || phase !== "idle") return;
    void ensureVideoPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preview when entering video idle
  }, [open, recordMode, phase]);

  const handleSwitchCamera = async () => {
    if (phase !== "idle" || recordMode !== "video" || isStarting) return;
    const nextFacing = toggleCameraFacing(facingRef.current);
    const generation = ++previewGenerationRef.current;
    setIsStarting(true);
    setErrorMessage(null);
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    try {
      const stream = await startVideoStream(nextFacing);
      if (generation !== previewGenerationRef.current) {
        stopMediaStream(stream);
        return;
      }
      streamRef.current = stream;
      facingRef.current = nextFacing;
      setFacing(nextFacing);
      attachLiveVideo(stream);
    } catch {
      if (generation !== previewGenerationRef.current) return;
      setErrorMessage(
        t.recordVideoDenied ??
          "Camera and microphone access are required to record video. Allow access and try again.",
      );
    } finally {
      if (generation === previewGenerationRef.current) {
        setIsStarting(false);
      }
    }
  };

  const selectMode = (nextMode: RecordCaptureMode) => {
    if (phase !== "idle" || isStarting || nextMode === recordMode) return;
    previewGenerationRef.current += 1;
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    setLiveStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
    recordModeRef.current = nextMode;
    recordedModeRef.current = nextMode;
    setRecordMode(nextMode);
    setErrorMessage(null);
    setElapsedSeconds(0);
  };

  const finishRecording = () => {
    if (recordModeRef.current === "video" || strategyRef.current.kind === "media-recorder") {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") return;
      recorder.stop();
      return;
    }

    clearTimer();
    const shouldDiscard = discardOnStopRef.current;
    const pcm = concatFloat32(pcmChunksRef.current);
    pcmChunksRef.current = [];
    const downsampled = downsampleToRate(
      pcm,
      inputSampleRateRef.current,
      VOICE_MESSAGE_WAV_SAMPLE_RATE,
    );
    void stopWavGraph().then(() => {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      setLiveStream(null);
      if (shouldDiscard) {
        discardOnStopRef.current = false;
        return;
      }
      const blob = encodeWavMonoFloat32(downsampled, VOICE_MESSAGE_WAV_SAMPLE_RATE);
      finalizeRecordingBlob(blob);
    });
  };

  const beginTimer = () => {
    startedAtRef.current = Date.now();
    setElapsedSeconds(0);
    setPhase("recording");
    clearTimer();
    timerRef.current = window.setInterval(() => {
      const next = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsedSeconds(next);
      if (next >= durationCapSeconds) {
        finishRecording();
      }
    }, 250);
  };

  const startVideoRecording = async () => {
    if (!isVideoRecordingSupported()) {
      setErrorMessage(
        t.recordVideoUnsupported ?? "Video recording is not supported in this browser.",
      );
      return;
    }
    const strategy = pickVideoRecordingStrategy();
    if (!strategy) {
      setErrorMessage(
        t.recordVideoUnsupported ?? "Video recording is not supported in this browser.",
      );
      return;
    }
    videoStrategyRef.current = strategy;
    recordedModeRef.current = "video";
    chunksRef.current = [];
    discardOnStopRef.current = false;

    let stream = streamRef.current;
    if (!stream?.getVideoTracks().length) {
      stream = await startVideoStream(facingRef.current);
      streamRef.current = stream;
      attachLiveVideo(stream);
    }

    const recorder = strategy.mimeType
      ? new MediaRecorder(stream, {
          mimeType: strategy.mimeType,
          videoBitsPerSecond: pickVideoBitsPerSecond(maxBytes, durationCapSeconds),
        })
      : new MediaRecorder(stream, {
          videoBitsPerSecond: pickVideoBitsPerSecond(maxBytes, durationCapSeconds),
        });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      clearTimer();
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      setLiveStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
      mediaRecorderRef.current = null;
      const type = recorder.mimeType || strategy.mimeType || "video/webm";
      const blob = new Blob(chunksRef.current, { type });
      chunksRef.current = [];
      finalizeRecordingBlob(blob);
    };
    recorder.onerror = () => {
      setErrorMessage(t.recordMessageFailed ?? "Recording failed. Please try again.");
      resetRecorderState({ keepMode: true });
    };
    recorder.start(250);
    beginTimer();
  };

  const startAudioRecording = async () => {
    if (!isVoiceRecordingSupported()) {
      setErrorMessage(t.recordMessageUnsupported ?? "Voice recording is not supported in this browser.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
      },
    });
    streamRef.current = stream;
    setLiveStream(stream);
    strategyRef.current = pickVoiceRecordingStrategy(formatPreference);
    recordedModeRef.current = "audio";
    chunksRef.current = [];
    pcmChunksRef.current = [];
    discardOnStopRef.current = false;

    if (strategyRef.current.kind === "media-recorder") {
      const mimeType = strategyRef.current.mimeType;
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        clearTimer();
        stopMediaStream(streamRef.current);
        streamRef.current = null;
        setLiveStream(null);
        mediaRecorderRef.current = null;
        const type = recorder.mimeType || mimeType || "audio/mp4";
        const blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        finalizeRecordingBlob(blob);
      };

      recorder.onerror = () => {
        setErrorMessage(t.recordMessageFailed ?? "Recording failed. Please try again.");
        resetRecorderState({ keepMode: true });
      };

      recorder.start(250);
    } else {
      const audioContext = createAudioContext();
      audioContextRef.current = audioContext;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      inputSampleRateRef.current = audioContext.sampleRate;
      const source = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;
      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        pcmChunksRef.current.push(new Float32Array(input));
      };
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(audioContext.destination);
    }

    beginTimer();
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setIsStarting(true);
    try {
      if (recordModeRef.current === "video") {
        await startVideoRecording();
      } else {
        await startAudioRecording();
      }
    } catch {
      setErrorMessage(
        recordModeRef.current === "video"
          ? (t.recordVideoDenied ??
            "Camera and microphone access are required to record video. Allow access and try again.")
          : (t.recordMessageMicDenied ??
            "Microphone access is required to record a message. Allow access and try again."),
      );
      resetRecorderState({ keepMode: true });
    } finally {
      setIsStarting(false);
    }
  };

  const handleUseRecording = () => {
    const blob = recordedBlobRef.current;
    if (!blob) return;
    if (recordedModeRef.current === "video") {
      const strategy = videoStrategyRef.current;
      const mimeType = blob.type || strategy?.mimeType || "video/webm";
      const extension = strategy?.extension || "webm";
      onRecorded(createVideoMessageFile(blob, mimeType, extension));
    } else {
      const strategy = strategyRef.current;
      const mimeType = blob.type || strategy.mimeType;
      onRecorded(createVoiceMessageFile(blob, mimeType, strategy.extension));
    }
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetRecorderState({ discardActiveRecording: true });
    }
    onOpenChange(next);
  };

  const modeLocked = phase !== "idle" || isStarting;
  const showLiveVideo = recordMode === "video" && phase !== "preview";
  const statusLabel =
    phase === "recording"
      ? (t.recordMessageRecordingStatus ?? "Recording")
      : phase === "preview"
        ? (t.recordMessagePreviewStatus ?? "Preview")
        : (t.recordMessageReadyStatus ?? "Ready");
  const switchLabel =
    facing === "environment"
      ? (t.takePhotoSwitchToFront ?? "Switch to front camera")
      : (t.takePhotoSwitchToBack ?? "Switch to back camera");
  const dialogShellClass =
    recordMode === "video"
      ? "flex max-h-[calc(100svh-0.75rem)] w-[calc(100%-0.75rem)] flex-col gap-3 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom)+4.5rem))] sm:max-h-[min(92vh,56rem)] sm:h-[min(92vh,56rem)] sm:w-full sm:max-w-2xl sm:overflow-hidden sm:p-6 sm:pb-6"
      : "flex max-h-[calc(100svh-0.75rem)] w-[calc(100%-0.75rem)] flex-col gap-3 overflow-y-auto overscroll-contain p-4 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+5.5rem))] sm:max-h-[min(90vh,40rem)] sm:w-full sm:max-w-lg sm:p-6 sm:pb-6";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={dialogShellClass}>
        <DialogHeader className="shrink-0">
          <DialogTitle>{t.recordMessageTitle ?? "Record a message"}</DialogTitle>
          <DialogDescription className={recordMode === "video" ? "line-clamp-2 sm:line-clamp-none" : undefined}>
            {recordMode === "video"
              ? (t.recordVideoDescription ??
                "Record a private video with sound. It is encrypted in your browser like a file attachment before upload.")
              : (t.recordMessageDescription ??
                "Record a private voice message. It is encrypted in your browser like a file attachment before upload.")}
          </DialogDescription>
        </DialogHeader>

        <div
          className="grid shrink-0 grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          role="tablist"
          aria-label={t.recordModeLabel ?? "Recording type"}
        >
          <button
            type="button"
            role="tab"
            aria-selected={recordMode === "audio"}
            disabled={modeLocked}
            onClick={() => selectMode("audio")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              recordMode === "audio"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-50"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            }`}
          >
            <Mic className="h-4 w-4" aria-hidden />
            {t.recordModeAudio ?? "Audio"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={recordMode === "video"}
            disabled={modeLocked}
            onClick={() => selectMode("video")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              recordMode === "video"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-50"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            }`}
          >
            <Video className="h-4 w-4" aria-hidden />
            {t.recordModeVideo ?? "Video"}
          </button>
        </div>

        <div
          className={`flex w-full flex-col items-center ${
            recordMode === "video"
              ? "mt-2 min-h-0 flex-1 gap-3 sm:mt-0 sm:overflow-hidden"
              : "gap-7 py-5"
          }`}
        >
          {showLiveVideo ? (
            <div className="relative mx-auto h-[min(56svh,24rem)] w-auto max-w-full shrink-0 aspect-[3/4] overflow-hidden rounded-lg bg-black sm:h-full sm:max-h-full sm:min-h-0 sm:flex-1">
              <video
                ref={videoRef}
                className={`h-full w-full object-cover${facing === "user" ? " -scale-x-100" : ""}`}
                playsInline
                muted
                autoPlay
              />
              {phase === "idle" ? (
                <button
                  type="button"
                  onClick={() => void handleSwitchCamera()}
                  disabled={isStarting}
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50"
                  aria-label={switchLabel}
                  title={switchLabel}
                >
                  <SwitchCamera className="h-5 w-5" aria-hidden />
                </button>
              ) : null}
              {phase === "recording" ? (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
                  {t.recordMessageRecordingStatus ?? "Recording"}
                </span>
              ) : null}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-3 pb-3 pt-8 text-center">
                <p
                  className="text-lg font-semibold leading-none tracking-tight tabular-nums text-white sm:text-xl"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span>{formatRecordingDuration(elapsedSeconds)}</span>
                  <span className="mx-1.5 text-sm font-medium text-white/55">/</span>
                  <span className="text-sm font-medium tabular-nums text-white/70">
                    {formatRecordingDuration(durationCapSeconds)}
                  </span>
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80">
                  {statusLabel}
                </p>
              </div>
            </div>
          ) : recordMode === "audio" ? (
            <div
              className={
                phase === "recording"
                  ? "relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500/12 text-red-600 ring-4 ring-red-500/15 dark:text-red-400"
                  : phase === "preview"
                    ? "flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                    : "flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
              }
              aria-hidden
            >
              {phase === "recording" ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-500/10" />
              ) : null}
              {phase === "preview" ? (
                <Check className="relative h-9 w-9" />
              ) : (
                <Mic className={`relative h-9 w-9${phase === "recording" ? " animate-pulse" : ""}`} />
              )}
            </div>
          ) : null}

          {recordMode === "audio" ? (
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <p
                className="text-xl font-semibold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-50 sm:text-[2rem]"
                aria-live="polite"
                aria-atomic="true"
              >
                <span>{formatRecordingDuration(elapsedSeconds)}</span>
                <span className="mx-1.5 text-lg font-medium text-gray-300 dark:text-gray-600">/</span>
                <span className="text-lg font-medium tabular-nums text-gray-400 dark:text-gray-500">
                  {formatRecordingDuration(durationCapSeconds)}
                </span>
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                {statusLabel}
              </p>
            </div>
          ) : null}

          {phase === "preview" && previewUrl ? (
            previewIsVideo ? (
              <div className="relative mx-auto h-[min(56svh,24rem)] w-auto max-w-full shrink-0 aspect-[3/4] overflow-hidden rounded-lg bg-black sm:h-full sm:max-h-full sm:min-h-0 sm:flex-1">
                <video
                  controls
                  playsInline
                  src={previewUrl}
                  className="h-full w-full object-contain"
                  preload="metadata"
                >
                  {t.recordMessagePreviewUnsupported ?? "Your browser cannot preview this recording."}
                </video>
                <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-3 pb-6 pt-3 text-center">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/85">
                    {statusLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                    {formatRecordingDuration(elapsedSeconds)}
                    <span className="mx-1 text-white/55">/</span>
                    {formatRecordingDuration(durationCapSeconds)}
                  </p>
                </div>
              </div>
            ) : (
              <WaveformAudioPlayer
                src={previewUrl}
                blob={recordedBlobRef.current}
                size="compact"
                className="w-full"
              />
            )
          ) : (
            <div className="flex min-h-[3.75rem] w-full shrink-0 items-center">
              <LiveAmplitudeMeter
                stream={liveStream}
                active={phase === "recording"}
                className="w-full"
              />
            </div>
          )}

          {errorMessage ? (
            <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <DialogFooter
          className={
            recordMode === "video"
              ? "z-10 mt-auto flex-wrap gap-2 bg-background pt-7 sm:static sm:justify-center sm:space-x-0 sm:gap-2 sm:pt-3"
              : "sticky bottom-0 z-10 mt-6 shrink-0 gap-2 bg-background pt-5 pb-[env(safe-area-inset-bottom)] sm:static sm:mt-4 sm:justify-center sm:space-x-0 sm:gap-2 sm:pt-3 sm:pb-0"
          }
        >
          {phase === "idle" ? (
            <Button type="button" onClick={() => void startRecording()} disabled={isStarting}>
              {recordMode === "video" ? (
                <Video className="mr-1.5 h-4 w-4" aria-hidden />
              ) : (
                <Mic className="mr-1.5 h-4 w-4" aria-hidden />
              )}
              {isStarting
                ? (t.recordMessageStarting ?? "Starting…")
                : (t.recordMessageStart ?? "Start recording")}
            </Button>
          ) : null}

          {phase === "recording" ? (
            <Button type="button" variant="destructive" onClick={finishRecording}>
              <Square className="mr-1.5 h-4 w-4" aria-hidden />
              {t.recordMessageStop ?? "Stop"}
            </Button>
          ) : null}

          {phase === "preview" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const mode = recordModeRef.current;
                  resetRecorderState({ keepMode: true });
                  if (mode === "audio") {
                    void startRecording();
                  }
                }}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden />
                {t.recordMessageRetake ?? "Re-record"}
              </Button>
              <Button type="button" onClick={handleUseRecording}>
                <Check className="mr-1.5 h-4 w-4" aria-hidden />
                {t.recordMessageUse ?? "Use recording"}
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
