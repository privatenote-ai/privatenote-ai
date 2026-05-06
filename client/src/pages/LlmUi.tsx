import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getCachedMaxStorageBufferBindingSize,
  getDeviceTier,
  getLocalAiOffer,
  getRecommendedModelForDevice,
  getWebLLMSupportHint,
  initializeClientLLM,
  isWebLLMSupported,
  primeLocalModelGpuLimit,
} from "@/utils/clientLLM";
import { useToast } from "@/hooks/use-toast";

type DeviceType = "mobile" | "laptop" | "desktop" | "";

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Polish",
  "Ukrainian",
  "Russian",
  "Arabic",
  "Hindi",
  "Chinese",
  "Japanese",
  "Korean",
  "Other (non-English)",
];

const deviceOptions: { value: DeviceType; label: string }[] = [
  { value: "mobile", label: "Mobile / Tablet" },
  { value: "laptop", label: "Laptop" },
  { value: "desktop", label: "Desktop / Workstation" },
];

const gib = 1024 * 1024 * 1024;

function formatBinding(bytes: number | null): string {
  if (bytes === null) return "Unknown";
  return `${(bytes / gib).toFixed(2)} GiB`;
}

function getHardwareStats(): {
  ram: number | "Unknown";
  cores: number | "Unknown";
  gpu: string;
  isMobile: boolean;
} {
  const hasWebGPU = typeof navigator !== "undefined" && Boolean(navigator.gpu?.requestAdapter);
  const ramRaw = typeof navigator !== "undefined" ? navigator.deviceMemory : undefined;
  const coresRaw = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;
  return {
    ram: typeof ramRaw === "number" ? ramRaw : "Unknown",
    cores: typeof coresRaw === "number" ? coresRaw : "Unknown",
    gpu: hasWebGPU ? "WebGPU Supported" : "Legacy/No GPU",
    isMobile: typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  };
}

function LlmUi() {
  const [stats, setStats] = useState(() => ({
    ram: "Unknown" as number | "Unknown",
    cores: "Unknown" as number | "Unknown",
    gpu: "Legacy/No GPU",
    isMobile: false,
  }));
  const [primaryLanguage, setPrimaryLanguage] = useState<string>("");
  const [deviceType, setDeviceType] = useState<DeviceType>("");
  const [probeReady, setProbeReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setStats(getHardwareStats());
    void (async () => {
      try {
        await primeLocalModelGpuLimit();
      } finally {
        setProbeReady(true);
      }
    })();
  }, []);

  const ramValue = typeof stats.ram === "number" ? stats.ram : null;
  const webLlmReady = isWebLLMSupported();
  const webLlmHint = getWebLLMSupportHint();
  const offer = probeReady ? getLocalAiOffer() : null;
  const deviceTier = probeReady ? getDeviceTier() : null;
  const recommendedModelId = probeReady ? getRecommendedModelForDevice() : null;
  const bindingSize = probeReady ? getCachedMaxStorageBufferBindingSize() : null;

  const baselineTone = useMemo(() => {
    if (!probeReady) return "Probing WebGPU limits and adapter features.";
    if (!offer?.enabled) return "This browser can load the diagnostics, but the current local-AI policy does not allow a model here.";
    if (deviceTier === "newest") return "This device clears the highest local-AI tier in the app.";
    return "This device qualifies for the compact default local model.";
  }, [deviceTier, offer, probeReady]);

  const advisoryNote = useMemo(() => {
    if (!primaryLanguage && !deviceType) return null;
    const parts: string[] = [];
    if (primaryLanguage && primaryLanguage !== "English") {
      parts.push("Your language choice can change prompt expectations, but not the runtime model policy.");
    }
    if (deviceType) {
      parts.push("The selected device class is advisory only; the actual allowlist comes from the WebGPU probe.");
    }
    return parts.join(" ");
  }, [deviceType, primaryLanguage]);

  const recommendation = useMemo(() => {
    if (!probeReady) {
      return {
        tier: "Analyzing device",
        context: "Checking WebGPU binding size and required adapter features.",
      };
    }

    if (!offer?.enabled) {
      return {
        tier: "Unsupported",
        context:
          webLlmHint ??
          "On-device AI is not available on this GPU because the reported WebGPU storage binding limit is too low or unknown.",
      };
    }

    if (deviceTier === "newest") {
      if (offer?.defaultModel?.includes("gemma-2-2b")) {
        return {
          tier: "Newest tier",
          context: "This device uses Gemma 2 2B by default, with Qwen 0.6 as fallback.",
        };
      }
      return {
        tier: "Newest tier",
        context: "This device uses Qwen 0.6 because the larger model is not allowed in this session.",
      };
    }

    return {
      tier: "Standard tier",
      context: "This device qualifies for the compact Qwen 0.6 default only.",
    };
  }, [deviceTier, offer, probeReady, webLlmHint]);

  const handleBackgroundDownload = async () => {
    if (!recommendedModelId || isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      await initializeClientLLM((prog) => {
        setDownloadProgress(prog.progress);
      }, recommendedModelId);
      toast({
        title: "Ready",
        description: "On-device assistant is ready.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Could not prepare on-device AI.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="page-title text-gray-900 dark:text-white">Assistant setup</h1>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          This page reflects the local-AI policy used at runtime: WebGPU probe first, then account tier.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Initialize & Detect</CardTitle>
          <CardDescription>{baselineTone}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">RAM: {typeof stats.ram === "number" ? `${stats.ram} GB` : "Unknown"}</Badge>
            <Badge variant="secondary">Cores: {typeof stats.cores === "number" ? stats.cores : "Unknown"}</Badge>
            <Badge variant="secondary">GPU: {stats.gpu}</Badge>
            <Badge variant="secondary">Binding: {probeReady ? formatBinding(bindingSize) : "Probing…"}</Badge>
            <Badge variant={webLlmReady ? "default" : "destructive"}>
              Runtime: {webLlmReady ? "WebLLM available" : "WebLLM unavailable"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The recommendation below comes from the same `getLocalAiOffer()` gate used before model load. RAM and CPU are shown for context only.
          </p>
          {webLlmHint ? (
            <p className="text-sm text-red-600 dark:text-red-300">{webLlmHint}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage Context</CardTitle>
          <CardDescription>Optional inputs for prompt context. They no longer override device capability.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary language for note-taking</label>
            <Select value={primaryLanguage} onValueChange={setPrimaryLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="max-h-[240px] overflow-y-auto">
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Device class for your own reference</label>
            <Select value={deviceType} onValueChange={(value) => setDeviceType(value as DeviceType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select device class" />
              </SelectTrigger>
              <SelectContent>
                {deviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {advisoryNote ? (
            <p className="md:col-span-2 text-sm text-gray-600 dark:text-gray-300">{advisoryNote}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analyze & Recommend</CardTitle>
          <CardDescription>
            {probeReady
              ? "Recommendation derived from the current WebGPU probe and session policy."
              : "Running the local capability probe."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-white">{recommendation.tier}</Badge>
            {recommendedModelId ? <Badge variant="secondary">{recommendedModelId}</Badge> : null}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{recommendation.context}</p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signal</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>WebGPU probe</TableCell>
                <TableCell>{probeReady ? "Complete" : "In progress"}</TableCell>
                <TableCell>{probeReady ? "Policy can be evaluated" : "Recommendation pending"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Device tier</TableCell>
                <TableCell>{deviceTier ?? "Pending"}</TableCell>
                <TableCell>
                  {deviceTier === "newest"
                    ? "Boosts may be offered"
                    : deviceTier === "standard"
                      ? "Default model only"
                      : deviceTier === "unsupported"
                        ? "Local AI disabled"
                        : "Waiting for probe"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Binding size</TableCell>
                <TableCell>{probeReady ? formatBinding(bindingSize) : "Pending"}</TableCell>
                <TableCell>Primary capacity gate for local models</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Default model</TableCell>
                <TableCell>{offer ? (offer.defaultModel ?? "None") : "Pending"}</TableCell>
                <TableCell>Gemma 2 when supported; otherwise Qwen 0.6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Recommended model</TableCell>
                <TableCell className="font-semibold">{recommendedModelId ?? "No supported local model"}</TableCell>
                <TableCell className="font-semibold">
                  {recommendedModelId ? "Matches runtime policy" : "Download is intentionally disabled"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-200">
              Download the current runtime-approved model in the background now?
            </div>
            <Button type="button" onClick={handleBackgroundDownload} disabled={!recommendedModelId || isDownloading}>
              {isDownloading ? "Downloading..." : "Start background download"}
            </Button>
          </div>
          {isDownloading ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Download progress: {downloadProgress}%</div>
              <Progress value={downloadProgress} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default LlmUi;
