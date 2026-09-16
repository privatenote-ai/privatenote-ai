import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Copy, Check, RefreshCw, Lock, Zap, BarChart3, ArrowRight, Share2, Eye, EyeOff, CircleHelp, FileText, QrCode } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { setStructuredDataScript } from '@/utils/documentMeta';
import { buildPasswordGeneratorFaqSchema, PASSWORD_GENERATOR_FAQ_IDS } from '@shared/passwordGeneratorStructuredData';
import { PASSWORDS_LU_PARTNER_URLS } from '@/config/passwordsLuPartner';
import { PasswordsLuMoreGenerators, PasswordGeneratorPrivateNoteLinks } from '@/components/PasswordsLuPartnerLinks';
import {
  encryptNote,
  generateContentKey,
  serializeEncryptedPayload,
} from '@/utils/encryption';
import { QRCode } from '@/components/ui/qr-code';
import { createQrPngFileFromSvgData, getQrSvgDataFromDom } from '@/utils/qrPngFile';
import {
  DEFAULT_STRONG_PASSWORD_LENGTH,
  TRANSPORT_SAFE_PASSWORD_SYMBOLS,
} from '@shared/transportSafePassword';
import {
  NOTE_EXPIRY_DEFAULT_PRESET_ID,
  noteExpiryPresetIdToSeconds,
} from '@shared/noteExpiry';
import { normalizeUrlFragmentKey } from '@shared/urlFragmentKey';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const PASSWORD_FAQ_ITEMS = PASSWORD_GENERATOR_FAQ_IDS.map((id) => ({ id }));

const PasswordGenerator: React.FC = () => {
  const { language, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(DEFAULT_STRONG_PASSWORD_LENGTH);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedNoteUrl, setSharedNoteUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessQr, setShowSuccessQr] = useState(false);
  const [showQrHelp, setShowQrHelp] = useState(false);
  const [showSuccessHelp, setShowSuccessHelp] = useState(false);
  const [successLinkCopied, setSuccessLinkCopied] = useState(false);
  const [featureCardsVisible, setFeatureCardsVisible] = useState(false);
  const qrSharePngRef = useRef<File | null>(null);
  const successQrSectionRef = useRef<HTMLDivElement | null>(null);
  const featuresSectionRef = useRef<HTMLElement | null>(null);

  const { toast } = useToast();

  // Character sets
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluding I, O
  const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"; // Excluding l
  const numberChars = "23456789"; // Excluding 0, 1
  const symbolChars = TRANSPORT_SAFE_PASSWORD_SYMBOLS;
  const similarChars = "Il1O0";

  // Rejection sampling for unbiased random selection
  const getUnbiasedRandomIndex = (max: number): number => {
    const maxValid = Math.floor(0xFFFFFFFF / max) * max; // Largest multiple of max that fits in 32 bits
    let randomValue: number;
    let randomBuffer = new Uint32Array(1);

    do {
      window.crypto.getRandomValues(randomBuffer);
      randomValue = randomBuffer[0];
    } while (randomValue >= maxValid);

    return randomValue % max;
  };

  // Generate password
  const generatePassword = useCallback(() => {
    try {
      // Validate at least one character set is selected
      if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
        toast({
          title: t.error,
          description: t.passwordSelectOneCharSet,
          variant: "destructive",
        });
        return;
      }

      // Build character set
      let charSet = "";
      if (useUppercase) charSet += uppercaseChars;
      if (useLowercase) charSet += lowercaseChars;
      if (useNumbers) charSet += numberChars;
      if (useSymbols) charSet += symbolChars;

      // Remove similar characters if option is enabled
      if (excludeSimilar) {
        for (const char of similarChars) {
          charSet = charSet.replace(new RegExp(char, "g"), "");
        }
      }

      // Generate password using rejection sampling for unbiased randomness
      let newPassword = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = getUnbiasedRandomIndex(charSet.length);
        newPassword += charSet.charAt(randomIndex);
      }

      // Ensure at least one character from each selected set
      let finalPassword = newPassword;
      const selectedSets: Array<{ chars: string; name: string }> = [];

      if (useUppercase) selectedSets.push({ chars: uppercaseChars, name: 'uppercase' });
      if (useLowercase) selectedSets.push({ chars: lowercaseChars, name: 'lowercase' });
      if (useNumbers) selectedSets.push({ chars: numberChars, name: 'numbers' });
      if (useSymbols) selectedSets.push({ chars: symbolChars, name: 'symbols' });

      // Shuffle positions using crypto API
      const positions = Array.from({ length: finalPassword.length }, (_, i) => i);
      for (let i = positions.length - 1; i > 0; i--) {
        const j = getUnbiasedRandomIndex(i + 1);
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Ensure at least one character from each selected set
      for (let i = 0; i < selectedSets.length; i++) {
        const set = selectedSets[i];
        const position = positions[i];
        const randomCharIndex = getUnbiasedRandomIndex(set.chars.length);
        const randomChar = set.chars.charAt(randomCharIndex);
        finalPassword = finalPassword.substring(0, position) + randomChar + finalPassword.substring(position + 1);
      }

      setPassword(finalPassword);
      setShowPassword(false);
    } catch (error) {
      console.error('Error generating password:', error);
      toast({
        title: t.error,
        description: t.passwordGenerateFailed,
        variant: "destructive",
      });
    }
  }, [useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, length, toast, t]);

  // Copy password to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: t.copied,
        description: t.passwordCopied,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: t.error,
        description: t.copyFailed,
        variant: "destructive",
      });
    }
  };

  const copyTextToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall through to the textarea fallback for mobile browsers that reject Clipboard API writes.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!copied) throw new Error("Clipboard copy failed");
  };

  // Share password as private note
  const sharePasswordAsNote = async () => {
    if (!password) {
      toast({
        title: t.error,
        description: t.noPasswordToShare,
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      const { id: reservedId } = await apiRequest("/api/notes/reserve", "POST");

      // Generate encryption key
      const { key, exportedKey } = await generateContentKey();

      const expirySeconds = noteExpiryPresetIdToSeconds(NOTE_EXPIRY_DEFAULT_PRESET_ID);
      const maxReads = 1;

      // Encrypt the password with AAD for context binding
      // Fixed: Added AAD with expiry and maxReads
      const { encryptedData, iv, aadBytes } = await encryptNote(password, key, {
        expirySeconds,
        maxReads,
        noteId: reservedId,
      });

      const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });

      const { id } = await apiRequest("/api/notes", "POST", {
        id: reservedId,
        content: wirePayload.content,
        iv: wirePayload.iv,
        expirySeconds,
        maxReads,
        aad: wirePayload.aad,
        creationSource: "web",
        creationEntryPoint: "password-share",
      });

      // Generate the secure note URL
      const baseUrl = window.location.origin;
      const urlKey = normalizeUrlFragmentKey(exportedKey);
      const url = `${baseUrl}/note/${id}#${urlKey}`;

      // Set the shared note URL to show success page
      setSharedNoteUrl(url);

      toast({
        title: t.passwordShared,
        description: t.passwordSharedDescription,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error sharing password as note:", error);
      }
      toast({
        title: t.error,
        description: t.passwordShareFailed,
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    apiRequest("/api/analytics/event", "POST", { page: "password-share" }).catch(() => {});
  }, []);

  useEffect(() => {
    setStructuredDataScript("password-generator-faq", buildPasswordGeneratorFaqSchema(t));
    return () => setStructuredDataScript("password-generator-faq", null);
  }, [t]);

  useEffect(() => {
    setShowSuccessQr(false);
    setShowSuccessHelp(false);
    setShowQrHelp(false);
    setSuccessLinkCopied(false);
    qrSharePngRef.current = null;
  }, [sharedNoteUrl]);

  useEffect(() => {
    if (!showSuccessQr || !sharedNoteUrl) {
      qrSharePngRef.current = null;
      return;
    }
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void (async () => {
          if (cancelled) return;
          const svgData = getQrSvgDataFromDom("password-qr-code");
          if (!svgData || cancelled) return;
          const file = await createQrPngFileFromSvgData(svgData);
          if (!cancelled) qrSharePngRef.current = file;
        })();
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(id); };
  }, [showSuccessQr, sharedNoteUrl]);

  useEffect(() => {
    if (!showSuccessQr) return;
    const el = successQrSectionRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [showSuccessQr]);

  const copySuccessLink = async () => {
    if (!sharedNoteUrl) return;
    try {
      await copyTextToClipboard(sharedNoteUrl);
      setSuccessLinkCopied(true);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying shared password link:", error);
      toast({
        title: t.error,
        description: t.copyFailed,
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (!sharedNoteUrl) return;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url: sharedNoteUrl });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copySuccessLink();
  };

  const shareQrCode = async () => {
    if (!sharedNoteUrl) return;
    let pngFile = qrSharePngRef.current;
    if (!pngFile) {
      const svgData = getQrSvgDataFromDom("password-qr-code");
      if (svgData) {
        pngFile = await createQrPngFileFromSvgData(svgData);
        if (pngFile) qrSharePngRef.current = pngFile;
      }
    }
    if (pngFile && typeof navigator.share === "function") {
      try {
        await navigator.share({ files: [pngFile] });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    if (pngFile && typeof navigator.clipboard?.write === "function" && typeof ClipboardItem !== "undefined") {
      try {
        const textBlob = new Blob([sharedNoteUrl], { type: "text/plain" });
        await navigator.clipboard.write([new ClipboardItem({ "image/png": pngFile, "text/plain": textBlob })]);
        toast({ title: t.qrAndLinkCopied, description: t.pasteIntoMail });
        return;
      } catch { /* fall through */ }
    }
    copySuccessLink();
  };

  const downloadQrCode = async () => {
    try {
      const svgData = getQrSvgDataFromDom("password-qr-code");
      if (!svgData) throw new Error(t.qrCodeNotAvailable);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = "privatenote-password-qr.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast({ title: t.qrCodeDownloaded, description: t.attachFileManually });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({ title: t.error, description: t.qrCodeDownloadFailed, variant: "destructive" });
    }
  };

  // Generate password on initial load and when settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    const section = featuresSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setFeatureCardsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const getLengthTier = (len: number) => {
    if (len <= 8) return 'very-weak';
    if (len <= 10) return 'weak';
    if (len <= 14) return 'fair';
    if (len <= 19) return 'good';
    if (len <= 23) return 'strong';
    return 'very-strong';
  };

  // Strength text and color based on requested length tiers
  const getStrengthText = () => {
    const tier = getLengthTier(password.length);
    if (tier === 'very-weak') return { text: t.strengthVeryWeak, color: 'text-red-600' };
    if (tier === 'weak') return { text: t.strengthWeak, color: 'text-red-600/70' };
    if (tier === 'fair') return { text: t.strengthFair, color: 'text-amber-500' };
    if (tier === 'good') return { text: t.strengthGood, color: 'text-emerald-500/50' };
    if (tier === 'strong') return { text: t.strengthStrong, color: 'text-teal-500/70' };
    if (tier === 'very-strong') return { text: t.strengthVeryStrong, color: 'text-teal-600' };
    return { text: t.strengthVeryWeak, color: 'text-red-600' };
  };

  const strengthInfo = getStrengthText();
  const tier = getLengthTier(password.length);
  const strengthFillPercent = (() => {
    const len = password.length;
    switch (tier) {
      case 'very-weak':
        return Math.min(18, 10 + len);
      case 'weak':
        return 20 + (len - 9) * 2;
      case 'fair':
        return 30 + (len - 11) * 2;
      case 'good':
        return 45 + (len - 15) * 3;
      case 'strong':
        return 68 + (len - 20) * 3;
      default:
        return Math.min(100, 85 + Math.max(0, len - 24) * 2.5);
    }
  })();

  if (sharedNoteUrl) {
    return (
      <div className="pt-24 pb-20">
        <section className="w-full max-w-4xl mx-auto py-4 sm:py-6">
          <div className="space-y-6 sm:space-y-7">
            <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
              <div className="text-center">
                <h1 className="page-title text-gray-900 dark:text-white">
                  {t.yourPasswordIs ?? t.yourSecurePasswordIs}{" "}
                  <span className="text-primary italic">{t.readyToShare ?? t.ready}</span>
                </h1>
                <p className="mt-3 mx-auto max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl">
                  {t.successReadySubtitle ?? t.passwordEncryptedInPrivateNote}
                </p>
              </div>
            </section>

            <div className="mb-12 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="p-0 sm:p-0 break-words">
                  <div className="flex flex-col space-y-5 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={shareLink}
                        type="button"
                        className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                        title={t.shareLink}
                      >
                        <Share2 className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                        {t.share}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSuccessHelp((open) => !open)}
                        aria-expanded={showSuccessHelp}
                        aria-label={t.showSecurityTips}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                      >
                        <CircleHelp className="h-5 w-5 text-primary" />
                      </button>
                    </div>

                    {showSuccessHelp && (
                      <div
                        className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/35 px-4 py-3.5 sm:px-5 sm:py-4 text-sm leading-snug text-blue-900 dark:text-blue-100"
                        role="note"
                      >
                        <div className="space-y-2">
                          <p className="m-0">{t.anyoneWithLinkCanReadPassword}</p>
                          <p className="m-0">{t.linkCannotBeRecovered}</p>
                          <p className="m-0">{t.noteSelfDestructAfterRead}</p>
                        </div>
                      </div>
                    )}

                    <div className="overflow-hidden rounded-lg border-2 border-primary">
                      <div className="bg-primary px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white">
                        {t.secureLink}
                      </div>
                      <div className="flex items-center bg-white dark:bg-gray-900 p-3 transition-transform active:scale-[1.02]">
                        <input
                          type="text"
                          readOnly
                          value={sharedNoteUrl}
                          className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-200 select-text focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-sm touch-manipulation"
                          aria-label={t.encryptedPasswordLink}
                          onFocus={(event) => event.currentTarget.select()}
                        />
                      </div>
                    </div>

                    <div className="mt-8 sm:mt-10 pt-2 pb-5">
                      <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[auto,minmax(0,1fr),auto] sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setShowSuccessQr((open) => !open)}
                          aria-expanded={showSuccessQr}
                          aria-label={showSuccessQr ? t.hideQrCode : t.shareViaQrCode}
                          className="order-2 inline-flex w-full min-w-0 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/80 sm:order-none sm:w-auto sm:px-6"
                        >
                          <QrCode className="h-4 w-4 mr-1.5 shrink-0 text-primary" aria-hidden />
                          {t.shareViaQrCode}
                        </button>
                        <button
                          type="button"
                          onClick={() => void copySuccessLink()}
                          className={`order-1 col-span-2 inline-flex w-full min-w-0 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:order-none sm:col-span-1 ${successLinkCopied
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500"
                            : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                            }`}
                          title={t.copyLinkToClipboard}
                          aria-live="polite"
                        >
                          {successLinkCopied ? (
                            <>
                              <Check className="h-4 w-4 mr-1.5 shrink-0" />
                              {t.linkCopied}
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1.5 shrink-0" />
                              {t.copyLink}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSharedNoteUrl(null);
                            generatePassword();
                          }}
                          className="order-3 inline-flex w-full min-w-0 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/80 sm:order-none sm:w-auto sm:px-6"
                        >
                          <RefreshCw className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                          {t.newPassword}
                        </button>
                      </div>
                    </div>

                    <div className="pt-5 sm:pt-6 w-full flex flex-col items-center">
                      {showSuccessQr && (
                        <div ref={successQrSectionRef} className="mt-10 mx-auto flex w-full max-w-xs flex-col items-center gap-4">
                          <div className="w-full flex items-center justify-between">
                            <button
                              onClick={shareQrCode}
                              type="button"
                              className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                              title={t.shareQrImage}
                            >
                              <Share2 className="h-4 w-4 mr-1.5 shrink-0 text-primary" />
                              {t.share}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowQrHelp((open) => !open)}
                              aria-expanded={showQrHelp}
                              aria-label={t.showQrCodeTips}
                              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                            >
                              <CircleHelp className="h-5 w-5 text-primary" />
                            </button>
                          </div>
                          {showQrHelp && (
                            <div className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/35 px-3 py-3 text-sm leading-snug text-blue-900 dark:text-blue-100">
                              <ul className="list-disc pl-4 space-y-1.5">
                                <li>{t.scanToOpenMobile}</li>
                                <li>{t.anyoneWithCodeCanViewPassword}</li>
                                <li>{t.codeCannotBeRecovered}</li>
                              </ul>
                            </div>
                          )}
                          <div className="w-full overflow-hidden rounded-lg border-2 border-primary/70 dark:border-primary/70">
                            <div className="bg-primary/70 px-3 py-1.5">
                              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white text-center leading-tight">
                                {t.qrCode}
                              </div>
                            </div>
                            <div
                              className="flex justify-center bg-white dark:bg-gray-950 p-3 sm:p-4"
                              id="password-qr-code"
                            >
                              <QRCode value={sharedNoteUrl} size={200} />
                            </div>
                          </div>
                          <div className="flex w-full items-center justify-center">
                            <button
                              onClick={downloadQrCode}
                              type="button"
                              className="inline-flex items-center justify-center px-3 py-2.5 text-sm font-semibold bg-primary/70 text-white rounded-md transition-colors hover:bg-primary/80 shadow-sm"
                              title={t.downloadQrCodeAsSvg}
                            >
                              <FileText className="h-4 w-4 mr-1.5 shrink-0" />
                              {t.downloadQrCode}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center px-4 sm:px-6 lg:px-8 mt-6">
              <PasswordsLuMoreGenerators t={t} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const securityApproachFeatures = [
    {
      title: t.cryptoWebApi,
      description: t.cryptoWebApiDescription,
      icon: <Lock className="h-6 w-6 text-primary" />,
    },
    {
      title: t.unbiasedRandomness,
      description: t.unbiasedRandomnessDescription,
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: t.smartStrengthAnalysis,
      description: t.smartStrengthAnalysisDescription,
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
    },
  ];

  const howItWorksPath = localizedPath("/how-it-works", language);
  const passwordBlogPath = localizedPath("/blog/how-we-generate-passwords", language);

  return (
    <div className="pt-24 pb-20">
      <section className="px-4 pb-0 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="page-title text-gray-900 dark:text-white">
            {t.strongPasswordTitlePrefix} <span className="text-primary">{t.passwordTitleWord} </span> {t.generatorTitleWord}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t.passwordGeneratorSubtitle}
          </p>
        </div>
      </section>

      <div id="password-generator-tool" className="mt-10 mb-6 scroll-mt-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:mb-12 sm:text-2xl">
            {t.pgToolHeading}
          </h2>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Label className="block w-24 shrink-0 text-gray-600 dark:text-gray-300 font-medium">{t.length}:</Label>
              <Slider
                value={[length]}
                min={8}
                max={64}
                step={1}
                onValueChange={(vals) => setLength(vals[0])}
                className="w-full"
              />
              <span className="w-12 shrink-0 text-center text-gray-900 dark:text-white font-semibold">{length}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={useUppercase}
                  onCheckedChange={(checked) => setUseUppercase(checked as boolean)}
                />
                <Label htmlFor="uppercase" className="text-gray-700 dark:text-gray-300 cursor-pointer">{t.uppercaseLetters}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={useLowercase}
                  onCheckedChange={(checked) => setUseLowercase(checked as boolean)}
                />
                <Label htmlFor="lowercase" className="text-gray-700 dark:text-gray-300 cursor-pointer">{t.lowercaseLetters}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={useNumbers}
                  onCheckedChange={(checked) => setUseNumbers(checked as boolean)}
                />
                <Label htmlFor="numbers" className="text-gray-700 dark:text-gray-300 cursor-pointer">{t.numbers}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={useSymbols}
                  onCheckedChange={(checked) => setUseSymbols(checked as boolean)}
                />
                <Label htmlFor="symbols" className="text-gray-700 dark:text-gray-300 cursor-pointer">{t.symbols}</Label>
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id="exclude-similar"
                  checked={excludeSimilar}
                  onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
                />
                <Label htmlFor="exclude-similar" className="text-gray-700 dark:text-gray-300 cursor-pointer">{t.excludeSimilarCharacters}</Label>
              </div>
            </div>

            {password && (
              <div className="mt-3">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t.passwordStrength}</span>
                    <span className={`text-sm font-semibold ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${tier === 'very-weak'
                        ? 'bg-red-600'
                        : tier === 'weak'
                          ? 'bg-red-600/70'
                          : tier === 'fair'
                            ? 'bg-amber-500'
                            : tier === 'good'
                              ? 'bg-emerald-500/50'
                              : tier === 'strong'
                                ? 'bg-teal-500/70'
                                : 'bg-teal-600'
                        }`}
                      style={{ width: `${strengthFillPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-primary/40 bg-primary/10 px-2 sm:px-2.5 py-1.5 shadow-sm dark:border-primary/60 dark:bg-primary/15">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="shrink-0 rounded-lg p-1.5 text-primary hover:bg-primary/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-pressed={showPassword}
                      aria-label={showPassword ? t.hidePassword : t.showPassword}
                      title={showPassword ? t.hidePassword : t.showPassword}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <p
                      className={`flex-1 min-w-0 text-center font-mono text-[0.8125rem] leading-tight text-gray-900 dark:text-white break-all select-all py-0.5 ${showPassword ? 'tracking-[0.1em]' : 'tracking-normal'}`}
                      aria-label={showPassword ? t.generatedPassword : t.passwordHidden}
                    >
                      {showPassword ? password : '•'.repeat(password.length)}
                    </p>
                    <div className="flex shrink-0 items-center gap-3 pl-1 pr-0.5">
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="rounded-lg p-1.5 text-primary hover:bg-primary/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label={copied ? t.copied : t.copyPassword}
                        title={copied ? t.copied : t.copyPassword}
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="rounded-lg p-1.5 text-primary hover:bg-primary/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-transparent hover:border-primary/20"
                        aria-label={t.regeneratePassword}
                        title={t.regeneratePassword}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center w-full">
                  <button
                    type="button"
                    className="w-[52%] max-w-xs min-w-0 py-2.5 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center justify-center gap-2"
                    onClick={sharePasswordAsNote}
                    disabled={isSharing}
                  >
                    {isSharing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin shrink-0" /> {t.sharing}
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 shrink-0" /> {t.shareAsNote}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <PasswordsLuMoreGenerators t={t} className="mx-auto mt-8 max-w-2xl text-center" />
      </div>

      <section
        ref={featuresSectionRef}
        className="relative isolate overflow-x-clip border-b border-gray-200/40 bg-gradient-to-b from-background via-gray-50/50 to-gray-50/25 px-4 py-14 dark:border-gray-800/40 dark:from-background dark:via-gray-950/55 dark:to-gray-950/25 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-20 bg-gradient-to-b from-background to-transparent sm:h-28 dark:from-background"
        />

        <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.howGenerationStaysTrustworthy}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t.passwordTrustSubtitle}
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-2 gap-5 md:grid-cols-3 xl:gap-6">
          {securityApproachFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700/70 rounded-xl shadow-md p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-700 ease-out ${featureCardsVisible ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 -translate-x-6 translate-y-2"}`}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="sm:hidden space-y-4">
          {securityApproachFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden flex items-start p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-700/70 rounded-lg shadow-sm active:scale-[0.99] transition-all duration-700 ease-out ${featureCardsVisible ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 -translate-x-5 translate-y-2"}`}
              style={{ transitionDelay: `${index * 130}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 max-w-3xl sm:mt-16 lg:mt-20">
          <div className="border-t border-gray-200/70 pt-10 dark:border-gray-800/70">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary dark:bg-primary/15">
              <Share2 className="h-3.5 w-3.5" aria-hidden />
              {t.pgSeoBadge}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t.pgSeoHeading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              <p>{t.pgSeoBody1}</p>
              <p>{t.pgSeoBody2}</p>
            </div>

            <PasswordGeneratorPrivateNoteLinks
              t={t}
              howItWorksPath={howItWorksPath}
              passwordBlogPath={passwordBlogPath}
            />
          </div>
        </div>
      </section>

      {/* Password FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50/25 via-gray-50/60 to-gray-50/40 dark:from-gray-950/25 dark:via-gray-900/40 dark:to-gray-950/30">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
        </div>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mb-10">
              <h2 className="bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-4xl font-display font-bold tracking-[-0.035em] text-transparent sm:text-5xl">
                {t.faq}
              </h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                {t.passwordFaqSubtitle}
              </p>
            </div>

            <Accordion
              type="single"
              collapsible
              className="rounded-3xl border border-primary/20 dark:border-primary/15 bg-white/85 dark:bg-gray-950/80 backdrop-blur shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_10px_40px_rgba(15,23,42,0.09)] ring-1 ring-primary/10 dark:ring-primary/5"
            >
              {PASSWORD_FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className={`group border-b border-gray-200/70 dark:border-gray-800/70 overflow-hidden transition-colors duration-150 data-[state=open]:bg-primary/[0.035] dark:data-[state=open]:bg-primary/[0.07] ${index === PASSWORD_FAQ_ITEMS.length - 1 ? 'border-b-0' : ''}`}
                >
                  <AccordionTrigger className="items-start gap-3 text-left text-sm sm:text-base text-gray-900 dark:text-white px-6 py-5 hover:no-underline hover:bg-gray-50/70 dark:hover:bg-gray-900/50 data-[state=open]:text-primary transition-colors [&>svg]:mt-1.5 [&>svg]:shrink-0 [&>svg]:text-gray-400 data-[state=open]:[&>svg]:text-primary">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/15 text-xs font-semibold tabular-nums leading-none text-primary ring-1 ring-primary/25 shadow-[0_0_8px_rgba(99,102,241,0.15)]">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 pt-1.5 leading-snug">{t[`passwordFaq_${item.id}_question`]}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 dark:text-gray-300 px-6 pb-6 pt-6 leading-relaxed">
                    <div className="pl-12 border-l-2 border-primary/25 ml-4">
                      {item.id === "memorable" ? (
                        <p>
                          {t.passwordFaq_memorable_answerLead}{" "}
                          {t.passwordFaq_memorable_answerMaster}{" "}
                          <a
                            href="#password-generator-tool"
                            className="font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                          >
                            {t.passwordFaq_memorable_generatorLink}
                          </a>
                          {t.passwordFaq_memorable_answerGeneratorTail}
                        </p>
                      ) : item.id === "passphrase" ? (
                        <p>
                          {t.passwordFaq_passphrase_answer}{" "}
                          <a
                            href={PASSWORDS_LU_PARTNER_URLS.passphraseGenerator}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                          >
                            {t.pgPartnerPassphrase}
                          </a>{" "}
                          and{" "}
                          <a
                            href={PASSWORDS_LU_PARTNER_URLS.pinGenerator}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                          >
                            {t.pgPartnerPin}
                          </a>
                          {t.passwordFaq_passphrase_answerSuffix}
                        </p>
                      ) : (
                        t[`passwordFaq_${item.id}_answer`]
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PasswordGenerator;
