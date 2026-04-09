import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Copy, Check, RefreshCw, Lock, Zap, BarChart3, ArrowRight, Share2, Eye, EyeOff, CircleHelp, FileText, QrCode } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
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

const PasswordGenerator: React.FC = () => {
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
          title: "Error",
          description: "Please select at least one character set",
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
        title: "Error",
        description: "Failed to generate password",
        variant: "destructive",
      });
    }
  }, [useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, length, toast]);

  // Copy password to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Share password as private note
  const sharePasswordAsNote = async () => {
    if (!password) {
      toast({
        title: "Error",
        description: "No password to share",
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
      });

      // Generate the secure note URL
      const baseUrl = window.location.origin;
      const urlKey = normalizeUrlFragmentKey(exportedKey);
      const url = `${baseUrl}/note/${id}#${urlKey}`;

      // Set the shared note URL to show success page
      setSharedNoteUrl(url);

      toast({
        title: "Password shared!",
        description: "Your password has been encrypted and shared as a private note",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error sharing password as note:", error);
      }
      toast({
        title: "Error",
        description: "Failed to share password as private note",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

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

  const copySuccessLink = () => {
    if (!sharedNoteUrl) return;
    navigator.clipboard.writeText(sharedNoteUrl);
    setSuccessLinkCopied(true);
    setCopied(true);
    toast({ title: "Copied!", description: "Secret link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
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
    copySuccessLink();
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
        toast({ title: "QR and link copied", description: "Paste into Mail or another app." });
        return;
      } catch { /* fall through */ }
    }
    copySuccessLink();
  };

  const downloadQrCode = async () => {
    try {
      const svgData = getQrSvgDataFromDom("password-qr-code");
      if (!svgData) throw new Error("QR code not available.");
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = "privatenote-password-qr.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast({ title: "QR Code Downloaded", description: "Attach the file manually in your email." });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({ title: "Error", description: "Could not download QR code.", variant: "destructive" });
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
    if (tier === 'very-weak') return { text: 'Very Weak', color: 'text-red-600' };
    if (tier === 'weak') return { text: 'Weak', color: 'text-red-600/70' };
    if (tier === 'fair') return { text: 'Fair', color: 'text-amber-500' };
    if (tier === 'good') return { text: 'Good', color: 'text-emerald-500/50' };
    if (tier === 'strong') return { text: 'Strong', color: 'text-teal-500/70' };
    if (tier === 'very-strong') return { text: 'Very Strong', color: 'text-teal-600' };
    return { text: 'Very Weak', color: 'text-red-600' };
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
        <section className="w-full max-w-5xl mx-auto py-4 sm:py-6">
          <div className="space-y-6 sm:space-y-7">
            <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
              <div className="text-center">
                <h1 className="page-title text-gray-900 dark:text-white">
                  Your Secure Password is <span className="text-primary italic">ready</span>
                </h1>
                <div className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl space-y-1 md:space-y-2">
                  <p className="m-0">Your password is encrypted in a private note.</p>
                  <p className="m-0">Only someone with this link can read it.</p>
                </div>
              </div>
            </section>

            <div className="mb-12 py-4 sm:py-6 px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <div className="p-0 sm:p-0 break-words">
                  <div className="flex flex-col space-y-5 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={shareLink}
                        type="button"
                        className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                        title="Share link"
                      >
                        <Share2 className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                        Share
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSuccessHelp((open) => !open)}
                        aria-expanded={showSuccessHelp}
                        aria-label="Show security tips"
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
                          <p className="m-0">Anyone with this link can read the password.</p>
                          <p className="m-0">This link cannot be recovered if lost.</p>
                          <p className="m-0">The note will self-destruct after being read.</p>
                        </div>
                      </div>
                    )}

                    <div className="overflow-hidden rounded-lg border-2 border-primary">
                      <div className="bg-primary px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white">
                        Secure link
                      </div>
                      <div className="flex items-center bg-white dark:bg-gray-900 p-3 transition-transform active:scale-[1.02]">
                        <input
                          type="text"
                          readOnly
                          value={sharedNoteUrl}
                          className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-200 select-text focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-sm touch-manipulation"
                          aria-label="Encrypted password link"
                          onFocus={(event) => event.currentTarget.select()}
                        />
                      </div>
                    </div>

                    <div className="mt-8 sm:mt-10 pt-2 pb-5">
                      <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setShowSuccessQr((open) => !open)}
                          aria-expanded={showSuccessQr}
                          aria-label={showSuccessQr ? "Hide QR Code" : "Share via QR Code"}
                          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                        >
                          <QrCode className="h-4 w-4 mr-1.5 shrink-0 text-primary" aria-hidden />
                          Share via QR Code
                        </button>
                        <button
                          type="button"
                          onClick={copySuccessLink}
                          className={`inline-flex w-full items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${successLinkCopied
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500"
                            : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                            }`}
                          title="Copy link to clipboard"
                          aria-live="polite"
                        >
                          {successLinkCopied ? (
                            <>
                              <Check className="h-4 w-4 mr-1.5 shrink-0" />
                              Link copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1.5 shrink-0" />
                              Copy Link
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSharedNoteUrl(null);
                            generatePassword();
                          }}
                          className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150 whitespace-nowrap"
                        >
                          <RefreshCw className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                          New Password
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
                              title="Share QR image"
                            >
                              <Share2 className="h-4 w-4 mr-1.5 shrink-0 text-primary" />
                              Share
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowQrHelp((open) => !open)}
                              aria-expanded={showQrHelp}
                              aria-label="Show QR code tips"
                              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                            >
                              <CircleHelp className="h-5 w-5 text-primary" />
                            </button>
                          </div>
                          {showQrHelp && (
                            <div className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/35 px-3 py-3 text-sm leading-snug text-blue-900 dark:text-blue-100">
                              <ul className="list-disc pl-4 space-y-1.5">
                                <li>Scan to open on mobile.</li>
                                <li>Anyone with this code can view the password.</li>
                                <li>This code cannot be recovered if lost.</li>
                              </ul>
                            </div>
                          )}
                          <div className="w-full overflow-hidden rounded-lg border-2 border-primary/70 dark:border-primary/70">
                            <div className="bg-primary/70 px-3 py-1.5">
                              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white text-center leading-tight">
                                QR Code
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
                              title="Download QR code as SVG image"
                            >
                              <FileText className="h-4 w-4 mr-1.5 shrink-0" />
                              Download QR Code
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
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                <span>Powered by</span>
                <span className="inline-flex items-center gap-0.5">
                  <img src="/favicon_passwords.svg" alt="" className="h-4 w-4 shrink-0" aria-hidden />
                  <a
                    href="https://passwords.lu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    passwords.lu
                  </a>
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const securityApproachFeatures = [
    {
      title: 'Crypto Web API',
      description:
        'Uses the Crypto Web API for cryptographically secure randomness. All password generation happens entirely in your browser—your password never leaves your device.',
      icon: <Lock className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Unbiased Randomness',
      description:
        'Uses rejection sampling so every character has an equal chance of being selected, eliminating bias and making passwords harder to predict or crack.',
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Smart Strength Analysis',
      description:
        'Advanced strength estimation analyzes patterns, common words, and realistic crack times for an accurate security assessment.',
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="px-4 pb-0 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="page-title text-gray-900 dark:text-white">
            Strong <span className="text-primary italic">Password </span> Generator
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create cryptographically secure passwords with unbiased randomness and accurate strength estimation.
          </p>
        </div>
      </section>

      <div className="mt-8 mb-8 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-sm flex flex-col">
            <div className="mb-4">

              <div className="pt-5">
                <div className="flex items-center gap-2 mb-6">
                  <Label className="block w-24 text-gray-600 dark:text-gray-300 font-medium">Length:</Label>
                  <Slider
                    value={[length]}
                    min={8}
                    max={64}
                    step={1}
                    onValueChange={(vals) => setLength(vals[0])}
                    className="w-full"
                  />
                  <span className="w-12 text-center text-gray-900 dark:text-white font-semibold">{length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={useUppercase}
                      onCheckedChange={(checked) => setUseUppercase(checked as boolean)}
                    />
                    <Label htmlFor="uppercase" className="text-gray-700 dark:text-gray-300 cursor-pointer">Uppercase Letters</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={useLowercase}
                      onCheckedChange={(checked) => setUseLowercase(checked as boolean)}
                    />
                    <Label htmlFor="lowercase" className="text-gray-700 dark:text-gray-300 cursor-pointer">Lowercase Letters</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={useNumbers}
                      onCheckedChange={(checked) => setUseNumbers(checked as boolean)}
                    />
                    <Label htmlFor="numbers" className="text-gray-700 dark:text-gray-300 cursor-pointer">Numbers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={useSymbols}
                      onCheckedChange={(checked) => setUseSymbols(checked as boolean)}
                    />
                    <Label htmlFor="symbols" className="text-gray-700 dark:text-gray-300 cursor-pointer">Symbols</Label>
                  </div>

                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox
                      id="exclude-similar"
                      checked={excludeSimilar}
                      onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
                    />
                    <Label htmlFor="exclude-similar" className="text-gray-700 dark:text-gray-300 cursor-pointer">Exclude Similar Characters (I, l, 1, O, 0)</Label>
                  </div>
                </div>
              </div>

            </div>

            {password && (
              <div className="mt-3">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Password Strength</span>
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
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <p
                      className={`flex-1 min-w-0 text-center font-mono text-[0.8125rem] leading-tight text-gray-900 dark:text-white break-all select-all py-0.5 ${showPassword ? 'tracking-[0.1em]' : 'tracking-normal'}`}
                      aria-label={showPassword ? "Generated password" : "Password hidden"}
                    >
                      {showPassword ? password : '•'.repeat(password.length)}
                    </p>
                    <div className="flex shrink-0 items-center gap-3 pl-1 pr-0.5">
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="rounded-lg p-1.5 text-primary hover:bg-primary/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label={copied ? 'Copied' : 'Copy password'}
                        title={copied ? 'Copied' : 'Copy password'}
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="rounded-lg p-1.5 text-primary hover:bg-primary/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-transparent hover:border-primary/20"
                        aria-label="Regenerate password"
                        title="Regenerate password"
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
                        <RefreshCw className="h-4 w-4 animate-spin shrink-0" /> Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 shrink-0" /> Share as a Note
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200/80 dark:border-gray-700/80 flex justify-end">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-end gap-x-1.5 gap-y-1 text-right">
                <span>Powered by</span>
                <span className="inline-flex items-center gap-0.5">
                  <img src="/favicon_passwords.svg" alt="" className="h-4 w-4 shrink-0" aria-hidden />
                  <a
                    href="https://passwords.lu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    passwords.lu
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center px-4">
        <Link
          href="/blog/how-we-generate-passwords"
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Learn more about how we generate passwords
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <section ref={featuresSectionRef} className="relative px-4 pt-20 pb-12 sm:px-6 sm:pt-24 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How generation stays trustworthy</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            The same ideas we use for Key Features—plain language, real cryptography.
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
      </section>


    </div>
  );
};

export default PasswordGenerator;
