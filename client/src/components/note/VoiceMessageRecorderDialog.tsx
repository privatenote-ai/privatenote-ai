import { useEffect, useRef, useState } from "react";
import { Mic, Square, RotateCcw, Check } from "lucide-react";
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
}: VoiceMessageRecorderDialogProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<RecorderPhase>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
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
  const recordedBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const discardOnStopRef = useRef(false);

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

  const finalizeRecordingBlob = (blob: Blob) => {
    const shouldDiscard = discardOnStopRef.current;
    discardOnStopRef.current = false;
    if (shouldDiscard) return;

    if (blob.size <= 0) {
      setErrorMessage(t.recordMessageEmpty ?? "No audio was captured. Try recording again.");
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
    const url = URL.createObjectURL(blob);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setPhase("preview");
  };

  const resetRecorderState = (options?: { discardActiveRecording?: boolean }) => {
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
    chunksRef.current = [];
    pcmChunksRef.current = [];
    recordedBlobRef.current = null;
    setPhase("idle");
    setElapsedSeconds(0);
    setIsStarting(false);
    setErrorMessage(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  useEffect(() => {
    if (!open) {
      resetRecorderState({ discardActiveRecording: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog closes/opens
  }, [open]);

  useEffect(() => {
    return () => {
      resetRecorderState({ discardActiveRecording: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unmount cleanup only
  }, []);

  const finishRecording = () => {
    const strategy = strategyRef.current;
    if (strategy.kind === "media-recorder") {
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
      if (shouldDiscard) {
        discardOnStopRef.current = false;
        return;
      }
      const blob = encodeWavMonoFloat32(downsampled, VOICE_MESSAGE_WAV_SAMPLE_RATE);
      finalizeRecordingBlob(blob);
    });
  };

  const startRecording = async () => {
    setErrorMessage(null);
    if (!isVoiceRecordingSupported()) {
      setErrorMessage(t.recordMessageUnsupported ?? "Voice recording is not supported in this browser.");
      return;
    }

    setIsStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;
      strategyRef.current = pickVoiceRecordingStrategy(formatPreference);
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
          mediaRecorderRef.current = null;
          const type = recorder.mimeType || mimeType || "audio/mp4";
          const blob = new Blob(chunksRef.current, { type });
          chunksRef.current = [];
          finalizeRecordingBlob(blob);
        };

        recorder.onerror = () => {
          setErrorMessage(t.recordMessageFailed ?? "Recording failed. Please try again.");
          resetRecorderState();
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
        // ScriptProcessor is deprecated but remains the most portable mono capture path.
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;
        processor.onaudioprocess = (event) => {
          const input = event.inputBuffer.getChannelData(0);
          pcmChunksRef.current.push(new Float32Array(input));
        };
        // Keep the processor graph alive without monitoring the mic through speakers.
        const silentGain = audioContext.createGain();
        silentGain.gain.value = 0;
        source.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(audioContext.destination);
      }

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
    } catch {
      setErrorMessage(
        t.recordMessageMicDenied ??
          "Microphone access is required to record a message. Allow access and try again.",
      );
      resetRecorderState();
    } finally {
      setIsStarting(false);
    }
  };

  const handleUseRecording = () => {
    const blob = recordedBlobRef.current;
    if (!blob) return;
    const strategy = strategyRef.current;
    const mimeType = blob.type || strategy.mimeType;
    const file = createVoiceMessageFile(blob, mimeType, strategy.extension);
    onRecorded(file);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetRecorderState({ discardActiveRecording: true });
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.recordMessageTitle ?? "Record a message"}</DialogTitle>
          <DialogDescription>
            {t.recordMessageDescription ??
              "Record a private voice message. It is encrypted in your browser like a file attachment before upload."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <div
            className={
              phase === "recording"
                ? "flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 text-red-600 ring-4 ring-red-500/20 dark:text-red-400"
                : "flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
            }
            aria-hidden
          >
            <Mic className={phase === "recording" ? "h-9 w-9 animate-pulse" : "h-9 w-9"} />
          </div>

          <p className="font-mono text-2xl tabular-nums text-gray-900 dark:text-gray-100">
            {formatRecordingDuration(elapsedSeconds)}
            <span className="ml-1 text-sm font-sans text-gray-400">
              / {formatRecordingDuration(durationCapSeconds)}
            </span>
          </p>

          {phase === "preview" && previewUrl ? (
            <audio controls src={previewUrl} className="w-full" preload="metadata">
              {t.recordMessagePreviewUnsupported ?? "Your browser cannot preview this recording."}
            </audio>
          ) : null}

          {errorMessage ? (
            <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {phase === "idle" ? (
            <Button type="button" onClick={() => void startRecording()} disabled={isStarting}>
              <Mic className="mr-1.5 h-4 w-4" aria-hidden />
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
                  resetRecorderState();
                  void startRecording();
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
