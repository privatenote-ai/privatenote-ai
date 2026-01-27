import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initializeClientLLM } from "@/utils/clientLLM";
import { useToast } from "@/hooks/use-toast";

type DeviceType = "mobile" | "laptop" | "desktop" | "";

const MODEL_CATALOG = {
  ultraLite: "Qwen3-0.6B-Instruct",
  midRange: "Llama-3.2-1B-Instruct",
  highEnd: "Llama-3.2-3B-Instruct",
  multilingual: "Qwen3-1.7B-Instruct",
  powerhouse: "DeepSeek-R1-Distill-Qwen-7B",
} as const;

const MODEL_ID_MAP: Record<string, string> = {
  "Qwen3-0.6B-Instruct": "Qwen3-0.6B-q4f16_1-MLC",
  "Qwen3-1.7B-Instruct": "Qwen3-1.7B-q4f16_1-MLC",
  "Llama-3.2-1B-Instruct": "Llama-3.2-1B-Instruct-q4f16_1-MLC",
  "Llama-3.2-3B-Instruct": "Llama-3.2-3B-Instruct-q4f16_1-MLC",
  "DeepSeek-R1-Distill-Qwen-7B": "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC",
};

const getHardwareStats = () => {
  const hasWebGPU = "gpu" in navigator && Boolean((navigator as { gpu?: unknown }).gpu);
  return {
    ram: navigator.deviceMemory || "Unknown",
    cores: navigator.hardwareConcurrency || "Unknown",
    gpu: hasWebGPU ? "WebGPU Supported" : "Legacy/No GPU",
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  };
};

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
  { value: "desktop", label: "Powerhouse Desktop" },
];

function LlmUi() {
  const [stats, setStats] = useState(() => ({
    ram: "Unknown" as number | "Unknown",
    cores: "Unknown" as number | "Unknown",
    gpu: "Legacy/No GPU",
    isMobile: false,
  }));

  const [primaryLanguage, setPrimaryLanguage] = useState<string>("");
  const [deviceType, setDeviceType] = useState<DeviceType>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setStats(getHardwareStats());
  }, []);

  const ramValue = typeof stats.ram === "number" ? stats.ram : null;
  const coreValue = typeof stats.cores === "number" ? stats.cores : null;

  const baselineTone = useMemo(() => {
    if (ramValue !== null) {
      if (ramValue >= 16) return "Nice rig! That’s a serious local AI station.";
      if (ramValue < 4) return "Keeping it light, I see. We’ll stay nimble.";
      if (ramValue <= 8) return "Solid mid‑range setup — good balance of speed and comfort.";
    }
    if (stats.isMobile) return "On the go — we’ll keep the model lean and snappy.";
    return "Got it. We’ll pick a model that fits your hardware without drama.";
  }, [ramValue, stats.isMobile]);

  const isNonEnglish = primaryLanguage !== "" && primaryLanguage !== "English";
  const isMobileChosen = deviceType === "mobile";
  const isLaptopOrDesktop = deviceType === "laptop" || deviceType === "desktop";
  const hasWebGPU = stats.gpu === "WebGPU Supported";

  const recommendation = useMemo(() => {
    if (!primaryLanguage || !deviceType) {
      return null;
    }

    if (ramValue !== null && ramValue < 4) {
      return {
        tier: "Tier 1: Ultra‑Lite",
        model: MODEL_CATALOG.ultraLite,
        context: "The battery‑saver. Fast, small (~380MB), ideal for tags and quick summaries.",
      };
    }

    if (isNonEnglish && (ramValue === null || ramValue >= 4)) {
      return {
        tier: "Tier 4: International/Multilingual",
        model: MODEL_CATALOG.multilingual,
        context: "The Polyglot. Best‑in‑class grammar for French, Spanish, and 100+ languages.",
      };
    }

    if (ramValue !== null && ramValue >= 16 && deviceType === "desktop" && hasWebGPU) {
      return {
        tier: "Tier 5: Powerhouse / Reasoning",
        model: MODEL_CATALOG.powerhouse,
        context: "The Brain. Built for deep reasoning and complex analysis.",
      };
    }

    if (ramValue !== null && ramValue >= 8 && isLaptopOrDesktop) {
      return {
        tier: "Tier 3: High‑End English",
        model: MODEL_CATALOG.highEnd,
        context: "The Writer. Deep reasoning, rich vocabulary, and crisp formatting.",
      };
    }

    if (ramValue !== null && ramValue >= 4 && ramValue <= 8 && isMobileChosen) {
      return {
        tier: "Tier 2: Mid‑Range English",
        model: MODEL_CATALOG.midRange,
        context: "The Standard. Optimized for English fluency and snappy mobile performance.",
      };
    }

    if (ramValue === null) {
      if (isMobileChosen) {
        return {
          tier: "Tier 2: Mid‑Range English",
          model: MODEL_CATALOG.midRange,
          context: "Conservative pick for unknown RAM. Keeps mobile fast and stable.",
        };
      }
      if (coreValue !== null && coreValue >= 8) {
        return {
          tier: "Tier 3: High‑End English",
          model: MODEL_CATALOG.highEnd,
          context: "Plenty of cores detected — stepping up for richer output.",
        };
      }
    }

    return {
      tier: "Tier 2: Mid‑Range English",
      model: MODEL_CATALOG.midRange,
      context: "Safe default when hardware is mixed or uncertain.",
    };
  }, [primaryLanguage, deviceType, ramValue, isNonEnglish, isLaptopOrDesktop, isMobileChosen, hasWebGPU, coreValue]);

  const recommendationReady = Boolean(recommendation);
  const recommendedModelId = recommendation ? MODEL_ID_MAP[recommendation.model] : null;

  const handleBackgroundDownload = async () => {
    if (!recommendedModelId || isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      await initializeClientLLM((prog) => {
        setDownloadProgress(prog.progress);
      }, recommendedModelId);
      toast({
        title: "Download started",
        description: `Model ready: ${recommendation?.model}`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to initialize model.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="page-title text-gray-900 dark:text-white">LLM‑UI: Model Selection Engine</h1>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          We’ll match you with the right local LLM for PrivateNote.ai — fast, private, and tuned to your device.
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
            <Badge variant="secondary">Device: {stats.isMobile ? "Mobile" : "Desktop/Laptop"}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We’ll use your hardware signals as a baseline and then refine the pick with your language and device class.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Consult</CardTitle>
          <CardDescription>Two quick questions to lock in the best model.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary language for note‑taking</label>
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
            <label className="text-sm font-medium">Are you on a mobile device, a laptop, or a powerhouse desktop?</label>
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
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analyze & Recommend</CardTitle>
          <CardDescription>
            {recommendationReady
              ? "Here’s your primary engine, tuned to your setup."
              : "Answer the two questions above to unlock your recommendation."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!recommendationReady ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Waiting on your language and device class.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-white">{recommendation?.tier}</Badge>
                <Badge variant="secondary">Primary Engine: {recommendation?.model}</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{recommendation?.context}</p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Signal</TableHead>
                    <TableHead>Detected / Selected</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>RAM</TableCell>
                    <TableCell>{ramValue !== null ? `${ramValue} GB` : "Unknown"}</TableCell>
                    <TableCell>{ramValue !== null && ramValue < 4 ? "Ultra‑Lite tier" : "Baseline weight"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Cores</TableCell>
                    <TableCell>{coreValue !== null ? coreValue : "Unknown"}</TableCell>
                    <TableCell>{coreValue !== null && coreValue >= 8 ? "Supports richer output" : "Neutral"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GPU</TableCell>
                    <TableCell>{stats.gpu}</TableCell>
                    <TableCell>{hasWebGPU ? "Unlocks powerhouse tier" : "Conservative pick"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Device Class</TableCell>
                    <TableCell>
                      {deviceType
                        ? deviceOptions.find((option) => option.value === deviceType)?.label
                        : "Not set"}
                    </TableCell>
                    <TableCell>{isMobileChosen ? "Mobile‑optimized" : "Desktop‑leaning"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Language</TableCell>
                    <TableCell>{primaryLanguage || "Not set"}</TableCell>
                    <TableCell>{isNonEnglish ? "Multilingual priority" : "English‑optimized"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Primary Engine</TableCell>
                    <TableCell className="font-semibold">{recommendation?.model}</TableCell>
                    <TableCell className="font-semibold">Ready to queue</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  Shall I start the background download for <span className="font-semibold">{recommendation?.model}</span> now?
                </div>
                <Button type="button" onClick={handleBackgroundDownload} disabled={!recommendedModelId || isDownloading}>
                  {isDownloading ? "Downloading..." : "Start Background Download"}
                </Button>
              </div>
              {isDownloading && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Download progress: {downloadProgress}%
                  </div>
                  <Progress value={downloadProgress} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LlmUi;
