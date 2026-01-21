import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Copy, Check, RefreshCw, Lock, Zap, BarChart3, ArrowRight, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { zxcvbn } from '@zxcvbn-ts/core';
import { apiRequest } from '@/lib/queryClient';
import { encryptNote, generateKey, arrayBufferToBase64 } from '@/utils/encryption';
import { QRCode } from '@/components/ui/qr-code';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordScore, setPasswordScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedNoteUrl, setSharedNoteUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Character sets
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluding I, O
  const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"; // Excluding l
  const numberChars = "23456789"; // Excluding 0, 1
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
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

  // Calculate password strength using zxcvbn-ts
  const calculatePasswordStrength = useCallback((pass: string) => {
    if (!pass) {
      setPasswordStrength(0);
      setPasswordScore(0);
      return;
    }

    const result = zxcvbn(pass);
    // zxcvbn returns a score from 0-4
    setPasswordScore(result.score);
    
    // Map zxcvbn score (0-4) to our strength indicator (0-6 for display purposes)
    // Score 0 = Very Weak, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
    const strengthMapping = [0, 1, 2, 4, 6];
    setPasswordStrength(strengthMapping[result.score] || 0);
  }, []);

  // Store calculatePasswordStrength in a ref to avoid dependency issues
  const calculatePasswordStrengthRef = useRef(calculatePasswordStrength);
  useEffect(() => {
    calculatePasswordStrengthRef.current = calculatePasswordStrength;
  }, [calculatePasswordStrength]);

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
      calculatePasswordStrengthRef.current(finalPassword);
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
      const { key, exportedKey } = await generateKey();
      
      const expirySeconds = 24 * 60 * 60; // 1 day
      const maxReads = 1;
      
      // Encrypt the password with AAD for context binding
      // Fixed: Added AAD with expiry and maxReads
      const { encryptedData, iv, aad } = await encryptNote(password, key, {
        expirySeconds,
        maxReads,
        noteId: reservedId,
      });
      
      // Convert to base64
      const encodeBase64 = (value: ArrayBuffer | Uint8Array) => {
        const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
        const copy = new Uint8Array(bytes.byteLength);
        copy.set(bytes);
        return arrayBufferToBase64(copy.buffer);
      };
      
      const encryptedBase64 = encodeBase64(encryptedData);
      const ivBase64 = encodeBase64(iv);
      
      // Create note with 1 day expiry and 1 read
      // Fixed: Include AAD for context binding
      const { id } = await apiRequest("/api/notes", "POST", {
        id: reservedId,
        content: encryptedBase64,
        iv: ivBase64,
        expirySeconds,
        maxReads,
        ...(aad && { aad }), // Include AAD if available
      });

      // Generate the secure note URL
      const baseUrl = window.location.origin;
      const urlKey = exportedKey.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
      const url = `${baseUrl}/note/${id}#${urlKey}`;

      // Set the shared note URL to show success page
      setSharedNoteUrl(url);
      
      toast({
        title: "Password shared!",
        description: "Your password has been encrypted and shared as a private note",
      });
    } catch (error) {
      console.error('Error sharing password as note:', error);
      toast({
        title: "Error",
        description: "Failed to share password as private note",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Generate password on initial load and when settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Strength text and color based on zxcvbn score
  const getStrengthText = () => {
    // zxcvbn score: 0 = Very Weak, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
    if (passwordScore === 0) return { text: 'Very Weak', color: 'text-red-600' };
    if (passwordScore === 1) return { text: 'Weak', color: 'text-red-500' };
    if (passwordScore === 2) return { text: 'Fair', color: 'text-yellow-600' };
    if (passwordScore === 3) return { text: 'Good', color: 'text-green-500' };
    if (passwordScore === 4) return { text: 'Strong', color: 'text-green-600' };
    return { text: 'Very Weak', color: 'text-red-600' };
  };

  const strengthInfo = getStrengthText();

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Generate</span>
          <span className="block mt-1 text-primary">Strong Passwords</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Create cryptographically secure passwords with unbiased randomness and accurate strength estimation.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="mb-6">

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Label className="block w-24 text-gray-700 dark:text-gray-300 font-medium">Length:</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

        {/* Success view when password is shared */}
        {sharedNoteUrl ? (
          <div className="mt-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Password Shared Successfully</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="note-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Share this secure link
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    id="note-url" 
                    value={sharedNoteUrl}
                    className="flex-1 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-primary focus:border-primary text-sm"
                    readOnly
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <button 
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(sharedNoteUrl);
                        setCopied(true);
                        toast({
                          title: "Copied!",
                          description: "Link copied to clipboard",
                        });
                        setTimeout(() => setCopied(false), 2000);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to copy link",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-r-xl text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {copied ? (
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  The link contains the decryption key. Anyone with this link can read your password.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  QR Code
                </label>
                <div className="w-48 h-48 bg-white p-2 rounded-lg">
                  <QRCode value={sharedNoteUrl} size={180} />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Scan this code to access your password
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => {
                    setSharedNoteUrl(null);
                    generatePassword();
                  }}
                  className="w-full flex items-center justify-center bg-primary text-white rounded-xl font-semibold py-2.5 px-4 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Password
                </button>
              </div>
            </div>
          </div>
        ) : password && (
          <div className="mt-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 p-6 relative overflow-hidden">
            {/* Subtle background treatment */}
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Password</h3>
              </div>

              <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-4 mb-4 overflow-x-auto font-mono text-lg text-center break-all text-gray-900 dark:text-white shadow-sm">
                {password}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Password Strength</span>
                  <span className={`text-sm font-semibold ${strengthInfo.color}`}>
                    {strengthInfo.text}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      passwordScore === 0
                        ? 'bg-red-600'
                        : passwordScore === 1
                        ? 'bg-red-500'
                        : passwordScore === 2
                        ? 'bg-yellow-600'
                        : passwordScore === 3
                        ? 'bg-green-500'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${((passwordScore + 1) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  className="flex items-center justify-center bg-primary text-white rounded-xl font-semibold py-2 px-4 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                  onClick={sharePasswordAsNote}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" /> Share as Note
                    </>
                  )}
                </button>
                <button
                  className="flex items-center justify-center bg-primary text-white rounded-xl font-semibold py-2 px-3 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" /> Copy
                    </>
                  )}
                </button>
                <button
                  className="flex items-center justify-center bg-primary text-white rounded-xl font-semibold py-2 px-3 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                  onClick={generatePassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approach Explanation Cards - Summaries */}
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Link href="/blog/how-we-generate-passwords" className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crypto Web API</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Uses the Crypto Web API for cryptographically secure randomness. All password generation happens entirely in your browser—your password never leaves your device.
          </p>
          <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link href="/blog/how-we-generate-passwords" className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unbiased Randomness</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Uses rejection sampling to ensure every character has an equal chance of being selected, eliminating bias and making passwords harder to predict or crack.
          </p>
          <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link href="/blog/how-we-generate-passwords" className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Strength Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Uses advanced password strength estimation that analyzes patterns, common words, and calculates realistic crack times to give you an accurate security assessment.
          </p>
          <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Learn More Link */}
      <div className="mt-8 text-center">
        <Link
          href="/blog/how-we-generate-passwords"
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Learn more about how we generate passwords
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Powered by attribution */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by{' '}
          <a 
            href="https://passwords.lu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            passwords.lu
          </a>
        </p>
      </div>
    </div>
  );
};

export default PasswordGenerator;
