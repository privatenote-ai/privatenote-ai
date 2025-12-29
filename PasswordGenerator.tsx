import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTranslations } from "../utils/translations";

interface PasswordGeneratorProps {
    onGenerate?: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onGenerate }) => {
    const { lang } = useParams();
    const t = getTranslations(lang);

    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [excludeSimilar, setExcludeSimilar] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthText, setPasswordStrengthText] = useState("");

    // Character sets
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluding I, O
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"; // Excluding l
    const numberChars = "23456789"; // Excluding 0, 1
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Similar characters to exclude if option is enabled
    const similarChars = "Il1O0";

    // Generate password
    const generatePassword = () => {
        setGenerating(true);

        try {
            // Validate at least one character set is selected
            if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
                throw new Error(t.selectOneCharSet || "Wählen Sie mindestens einen Zeichensatz aus");
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
            if (onGenerate) onGenerate(finalPassword);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An error occurred while generating the password");
            }
        } finally {
            setGenerating(false);
        }
    };

    // Calculate password strength
    const calculatePasswordStrength = (pass: string) => {
        let strength = 0;
        let feedback = "";

        if (pass.length >= 8) strength += 1;
        if (pass.length >= 12) strength += 1;
        if (pass.length >= 16) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[a-z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

        // Map strength to text
        if (strength <= 2) {
            feedback = t.weakPassword || "Schwach";
        } else if (strength <= 4) {
            feedback = t.mediumPassword || "Mittel";
        } else {
            feedback = t.strongPassword || "Stark";
        }

        setPasswordStrength(strength);
        setPasswordStrengthText(feedback);
    };

    // Copy password to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Failed to copy password");
            }
        }
    };

    // Generate password on initial load
    useEffect(() => {
        generatePassword();
    }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

    return (
        <div className="max-w-4xl mx-auto pt-20 pb-12 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">{t.passwordGenerator}</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        {t.passwordDesc}
                    </p>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <label className="block w-24">{t.length}:</label>
                            <input
                                type="range"
                                min="8"
                                max="64"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <span className="w-12 text-center">{length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="uppercase"
                                    checked={useUppercase}
                                    onChange={(e) => setUseUppercase(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="uppercase">{t.uppercase}</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="lowercase"
                                    checked={useLowercase}
                                    onChange={(e) => setUseLowercase(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="lowercase">{t.lowercase}</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="numbers"
                                    checked={useNumbers}
                                    onChange={(e) => setUseNumbers(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="numbers">{t.numbers}</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="symbols"
                                    checked={useSymbols}
                                    onChange={(e) => setUseSymbols(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="symbols">{t.symbols}</label>
                            </div>

                            <div className="flex items-center md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="exclude-similar"
                                    checked={excludeSimilar}
                                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="exclude-similar">{t.excludeSimilar}</label>
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                        onClick={generatePassword}
                        disabled={generating}
                    >
                        {generating ? t.generating : t.generateButton}
                    </button>
                </div>

                {password && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">{t.yourPassword}:</h3>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto font-mono text-lg text-center break-all">
                            {password}
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <span className="mr-2">{t.strength}:</span>
                                <span className={`font-semibold ${passwordStrengthText === t.strongPassword ? "text-green-600" :
                                    passwordStrengthText === t.mediumPassword ? "text-yellow-600" :
                                        "text-red-600"
                                    }`}>
                                    {passwordStrengthText}
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${passwordStrengthText === t.strongPassword ? "bg-green-600" :
                                        passwordStrengthText === t.mediumPassword ? "bg-yellow-600" :
                                            "bg-red-600"
                                        }`}
                                    style={{ width: `${(passwordStrength / 6) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                            onClick={copyToClipboard}
                        >
                            {copied ? t.copied : t.copyButton}
                        </button>
                    </div>
                )}

                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold mb-4">{t.passwordTips}</h3>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li className="mb-1">{t.passwordTip1}</li>
                        <li className="mb-1">{t.passwordTip2}</li>
                        <li className="mb-1">{t.passwordTip3}</li>
                        <li className="mb-1">{t.passwordTip4}</li>
                        <li className="mb-1">{t.passwordTip5}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PasswordGenerator;
