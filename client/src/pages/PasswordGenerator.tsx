import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Copy, Check } from 'lucide-react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();

  // Character sets
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluding I, O
  const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"; // Excluding l
  const numberChars = "23456789"; // Excluding 0, 1
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const similarChars = "Il1O0";
  
  // Generate password
  const generatePassword = () => {
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

      // Generate password
      let newPassword = "";
      const randomBuffer = new Uint32Array(length);
      window.crypto.getRandomValues(randomBuffer);

      for (let i = 0; i < length; i++) {
        const randomIndex = randomBuffer[i] % charSet.length;
        newPassword += charSet.charAt(randomIndex);
      }

      // Ensure at least one character from each selected set
      let finalPassword = newPassword;

      // If we have sets enabled, ensure at least one character from each set
      if (useUppercase) {
        const randomIndex = Math.floor(Math.random() * finalPassword.length);
        const randomChar = uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
        finalPassword = finalPassword.substring(0, randomIndex) + randomChar + finalPassword.substring(randomIndex + 1);
      }

      if (useLowercase) {
        const randomIndex = Math.floor(Math.random() * finalPassword.length);
        const randomChar = lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
        finalPassword = finalPassword.substring(0, randomIndex) + randomChar + finalPassword.substring(randomIndex + 1);
      }

      if (useNumbers) {
        const randomIndex = Math.floor(Math.random() * finalPassword.length);
        const randomChar = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        finalPassword = finalPassword.substring(0, randomIndex) + randomChar + finalPassword.substring(randomIndex + 1);
      }

      if (useSymbols) {
        const randomIndex = Math.floor(Math.random() * finalPassword.length);
        const randomChar = symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
        finalPassword = finalPassword.substring(0, randomIndex) + randomChar + finalPassword.substring(randomIndex + 1);
      }

      setPassword(finalPassword);
      calculatePasswordStrength(finalPassword);
    } catch (error) {
      console.error('Error generating password:', error);
      toast({
        title: "Error",
        description: "Failed to generate password",
        variant: "destructive",
      });
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;

    if (pass.length >= 8) strength += 1;
    if (pass.length >= 12) strength += 1;
    if (pass.length >= 16) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

    setPasswordStrength(strength);
  };

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

  // Generate password on initial load and when settings change
  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar]);

  // Strength text and color
  const getStrengthText = () => {
    if (passwordStrength <= 2) return { text: 'Weak', color: 'text-red-600' };
    if (passwordStrength <= 4) return { text: 'Medium', color: 'text-yellow-600' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  const strengthInfo = getStrengthText();

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Password Generator</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Create strong, unique passwords to keep your online accounts secure.
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Label className="block w-24">Length:</Label>
              <Slider
                value={[length]}
                min={8}
                max={64}
                step={1}
                onValueChange={(vals) => setLength(vals[0])}
                className="w-full"
              />
              <span className="w-12 text-center">{length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={useUppercase}
                  onCheckedChange={(checked) => setUseUppercase(checked as boolean)}
                />
                <Label htmlFor="uppercase">Uppercase Letters</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={useLowercase}
                  onCheckedChange={(checked) => setUseLowercase(checked as boolean)}
                />
                <Label htmlFor="lowercase">Lowercase Letters</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={useNumbers}
                  onCheckedChange={(checked) => setUseNumbers(checked as boolean)}
                />
                <Label htmlFor="numbers">Numbers</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={useSymbols}
                  onCheckedChange={(checked) => setUseSymbols(checked as boolean)}
                />
                <Label htmlFor="symbols">Symbols</Label>
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id="exclude-similar"
                  checked={excludeSimilar}
                  onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
                />
                <Label htmlFor="exclude-similar">Exclude Similar Characters (I, l, 1, O, 0)</Label>
              </div>
            </div>
          </div>

          <button
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            onClick={generatePassword}
          >
            Generate New Password
          </button>
        </div>

        {password && (
          <div className="mt-6 bg-blue-50 dark:bg-gray-700/30 border border-blue-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Password:</h3>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto font-mono text-lg text-center break-all">
              {password}
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="mr-2">Strength:</span>
                <span className={`font-semibold ${strengthInfo.color}`}>
                  {strengthInfo.text}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    passwordStrength <= 2
                      ? 'bg-red-600'
                      : passwordStrength <= 4
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${(passwordStrength / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
