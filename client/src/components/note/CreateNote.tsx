import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import bs58 from "bs58";
import { QRCode } from "@/components/ui/qr-code";
import { apiRequest } from "@/lib/queryClient";
import {
  encryptNote,
  generateKey,
  arrayBufferToBase64,
  encryptWithPassword,
} from "@/utils/encryption";
import { enhanceNoteWithAI } from "@/utils/openai";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  ShieldCheck,
  Copy,
  RefreshCw,
  Sparkles,
  Lock,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  ZoomIn,
  ZapOff,
  Zap,
  ArrowLeft,
  User,
  FileText,
  Settings,
  Eye,
  Key,
  Mail,
} from "lucide-react";
import { SecurityRecommendations } from "@/components/features/SecurityRecommendations";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

// Function to get shorter name for template pills
const getShortName = (name: string): string => {
  const nameMap: Record<string, string> = {
    "Ask AI Anything": "Ask AI",
    "Birthday Greeting": "Birthday",
    "Thank You Note": "Thank You",
    "Apology Message": "Apology",
    "Love Message": "Love",
    Congratulations: "Congrats",
    "Meeting Request": "Meeting",
    "Farewell / Goodbye": "Farewell",
    Invitation: "Invite",
    "Condolence Message": "Condolence",
    "Reminder Message": "Reminder",
    "Document Summary": "Summary",
    "Privacy Check": "Privacy",
  };

  return nameMap[name] || name;
};

// Secure random integer function for password generation
const secureRandomInt = (max: number): number => {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] % max;
};

// Function to convert expiry value to seconds for API
const convertExpiryToSeconds = (expiryValue: string): number => {
  // Format is like "5m", "1h", "7d" etc.
  const value = parseInt(expiryValue.slice(0, -1));
  const unit = expiryValue.slice(-1);
  
  switch(unit) {
    case 'm': // minutes
      return value * 60;
    case 'h': // hours
      return value * 60 * 60;
    case 'd': // days
      return value * 24 * 60 * 60;
    default:
      return 24 * 60 * 60; // Default to 1 day
  }
};

// Function to display expiry time in a human-readable format
const getExpiryTimeDisplay = (expiryValue: string): string => {
  const value = parseInt(expiryValue.slice(0, -1));
  const unit = expiryValue.slice(-1);
  
  switch(unit) {
    case 'm':
      return `${value} minute${value !== 1 ? 's' : ''}`;
    case 'h':
      return `${value} hour${value !== 1 ? 's' : ''}`;
    case 'd':
      return `${value} day${value !== 1 ? 's' : ''}`;
    default:
      return '1 day'; // Default
  }
};

// Function to generate a human-friendly password (easier to remember)
const generateHumanFriendlyPassword = (): string => {
  const adjectives = [
    "happy",
    "sunny",
    "brave",
    "green",
    "lucky",
    "clever",
    "gentle",
    "mighty",
    "golden",
    "swift",
  ];
  const nouns = [
    "tiger",
    "mountain",
    "river",
    "eagle",
    "ocean",
    "forest",
    "planet",
    "dragon",
    "castle",
    "sunset",
  ];
  const numbers = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}${numbers}`;
};

// Function to generate a strong, secure password (hard to remember but very secure)
const generateStrongPassword = (): string => {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    password += charset[secureRandomInt(charsetLength)];
  }

  return password;
};

// Prompt templates for common use cases
interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  enhancementType: "improve" | "summarize" | "secure";
}

const promptTemplates: PromptTemplate[] = [
  // Top 5 most frequently used templates displayed by default
  {
    id: "ask-anything",
    name: "Ask AI Anything",
    description: "Get help with any message using AI",
    template: "Help me write a message about [describe what you need]",
    enhancementType: "improve",
  },
  {
    id: "thank-you",
    name: "Thank You Note",
    description: "For help, gifts, professional follow-ups",
    template:
      "Write a thank you note to [name] for [what they did]. Our relationship is [professional/personal] and I want to express my gratitude for [specific details].",
    enhancementType: "improve",
  },
  {
    id: "meeting-request",
    name: "Meeting Request",
    description: "Quick professional message for scheduling",
    template:
      "Write a professional email requesting a meeting with [name/title] from [company] to discuss [topic]. I would like to meet on [date/time] at [location/platform].",
    enhancementType: "improve",
  },
  {
    id: "birthday",
    name: "Birthday Greeting",
    description: "Most common casual message for friends, coworkers, family",
    template:
      "Create a warm, friendly birthday greeting for my [relation] named [name]. They are turning [age] and enjoy [interests].",
    enhancementType: "improve",
  },
  {
    id: "apology",
    name: "Apology Message",
    description: "Personal or professional apologies",
    template:
      "Help me write a sincere apology to [name] for [what happened]. I want to make it right by [how you plan to fix it].",
    enhancementType: "improve",
  },
  // Additional templates hidden under "Show more"
  {
    id: "love",
    name: "Love Message",
    description: "Romantic notes, sweet messages, anniversaries",
    template:
      "Write a romantic message to [name] for our [occasion/anniversary]. We've been together for [time period] and I especially love [what you love about them].",
    enhancementType: "improve",
  },
  {
    id: "congratulations",
    name: "Congratulations",
    description: "Promotions, new jobs, babies, achievements",
    template:
      "Write a congratulatory message to [name] for their [achievement]. Our relationship is [professional/personal] and I want to express my [sentiment].",
    enhancementType: "improve",
  },
  {
    id: "farewell",
    name: "Farewell / Goodbye",
    description: "Leaving a job, moving away, saying goodbye",
    template:
      "Help me write a farewell message to [individual/group] as I [reason for leaving]. I've [been with them/known them] for [time period] and want to express [sentiment].",
    enhancementType: "improve",
  },
  {
    id: "invitation",
    name: "Invitation",
    description: "Invite to party, dinner, or informal gathering",
    template:
      "Write an invitation for [event type] on [date] at [location]. The occasion is [reason] and guests should know [important details].",
    enhancementType: "improve",
  },
  {
    id: "condolence",
    name: "Condolence Message",
    description: "For loss or hard moments",
    template:
      "Help me write a thoughtful condolence message to [name] who recently lost their [relation]. I've known them for [time period] and want to offer comfort.",
    enhancementType: "improve",
  },
  {
    id: "reminder",
    name: "Reminder Message",
    description: "Friendly nudge or soft reminder",
    template:
      "Write a gentle reminder to [name/group] about [what needs to be done] by [deadline]. The tone should be [friendly/professional].",
    enhancementType: "improve",
  },
  {
    id: "document-summary",
    name: "Document Summary",
    description: "Summarize a long document",
    template:
      "Summarize the following document into key points: [paste document text here]",
    enhancementType: "summarize",
  },
  {
    id: "privacy-check",
    name: "Privacy Check",
    description: "Redact private information",
    template:
      "Remove all personally identifiable information from the following text: [paste text with potential PII here]",
    enhancementType: "secure",
  },
];

export const CreateNote: React.FC = () => {
  const [noteContent, setNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noteUrl, setNoteUrl] = useState<string | null>(null);
  const [isAiMode, setIsAiMode] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [aiEnhancementType, setAiEnhancementType] = useState<
    "improve" | "summarize" | "secure"
  >("improve");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [expiryValue, setExpiryValue] = useState("1d"); // Default to 1 day
  const readCount = 1; // Fixed to always be 1 read
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>("ask-anything");
  const [showAllTemplates, setShowAllTemplates] = useState<boolean>(false);
  const [contentFinalized, setContentFinalized] = useState<boolean>(false); // Track if the AI-generated content has been finalized
  const [originalPrompt, setOriginalPrompt] = useState<string>(""); // Store original prompt for regeneration
  const [showPrompt, setShowPrompt] = useState<boolean>(true); // Toggle between showing prompt or generated content
  const [promptHistory, setPromptHistory] = useState<string[]>([]); // Store complete prompt history
  // Password field and related state
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // Toggle password visibility
  // Password protection is determined by whether the password field has a value
  const isPasswordProtected = password.trim().length > 0;
  const [sharePassword, setSharePassword] = useState<boolean>(true); // Whether to include password in shared URL
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Validate password if password protection is enabled
    if (isPasswordProtected && !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password for your note",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let encryptedBase64,
        ivBase64,
        exportedKey,
        saltBase64,
        encryptedKeyBase64,
        encryptedKeyIvBase64;

      // First, always generate a standard encryption key (first layer of security)
      const { key, exportedKey: generatedKey } = await generateKey();
      exportedKey = generatedKey;

      if (isPasswordProtected) {
        // Use password-based encryption as second layer (double-encryption)
        const { encryptedData, iv, salt, encryptedKey, encryptedKeyIv } =
          await encryptWithPassword(noteContent, password);

        // Convert encrypted data to base64 for transmission
        encryptedBase64 = arrayBufferToBase64(encryptedData);
        ivBase64 = arrayBufferToBase64(iv);
        saltBase64 = arrayBufferToBase64(salt);
        encryptedKeyBase64 = arrayBufferToBase64(encryptedKey);
        encryptedKeyIvBase64 = arrayBufferToBase64(encryptedKeyIv);
      } else {
        // Standard encryption without password
        // Encrypt the note content
        const { encryptedData, iv } = await encryptNote(noteContent, key);

        // Convert encrypted data to base64 for transmission
        encryptedBase64 = arrayBufferToBase64(encryptedData);
        ivBase64 = arrayBufferToBase64(iv);
      }

      // Convert expiryValue to seconds for API
      const expirySeconds = convertExpiryToSeconds(expiryValue);
      
      if (isAiMode) {
        if (!import.meta.env.VITE_TURNSTILE_SITE_KEY) {
          throw new Error("Human verification is not configured.");
        }
        if (!turnstileToken) {
          throw new Error("Please complete the human verification.");
        }
      }

      // Send encrypted note to server
      const { id } = await apiRequest("/api/notes", "POST", {
        content: encryptedBase64,
        iv: ivBase64,
        expirySeconds,
        maxReads: readCount,
        aiMode: isAiMode,
        turnstileToken: turnstileToken || undefined,
        // Include password protection fields if enabled
        isPasswordProtected,
        ...(isPasswordProtected && {
          salt: saltBase64,
          encryptedKey: encryptedKeyBase64,
          encryptedKeyIv: encryptedKeyIvBase64,
        }),
      });

      // Generate the secure note URL
      const baseUrl = window.location.origin;
      // Always include the key in the URL for both password-protected and standard notes
      const url = `${baseUrl}/note/${id}#${exportedKey}`;
      
      // Set the URL for display
      setNoteUrl(url);
      setTurnstileToken(null);
      setTurnstileError(null);
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch (error) {
      console.error("[CreateNote] ❌❌❌ ERROR CREATING NOTE ❌❌❌");
      console.error("[CreateNote] Error type:", error?.constructor?.name || 'Unknown');
      console.error("[CreateNote] Error message:", error instanceof Error ? error.message : String(error));
      console.error("[CreateNote] Full error:", error);
      
      let errorMessage = "Failed to create encrypted note. Please try again.";
      if (error instanceof Error) {
        // Extract status code from error message (format: "405: ...")
        const statusMatch = error.message.match(/^(\d+):/);
        if (statusMatch) {
          const status = statusMatch[1];
          errorMessage = `Server error (${status}). Please check the console for details.`;
          console.error(`[CreateNote] HTTP Status: ${status}`);
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAiMode) {
      setTurnstileToken(null);
      setTurnstileError(null);
      setTurnstileReady(false);
      return;
    }

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      setTurnstileError("Human verification is not configured.");
      return;
    }

    let intervalId: number | null = null;

    const initTurnstile = () => {
      if (!window.turnstile) {
        return;
      }
      setTurnstileReady(true);
      const container = document.getElementById("turnstile-container");
      if (!container) {
        return;
      }
      if (turnstileWidgetIdRef.current) {
        return;
      }
      container.innerHTML = "";
      const widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileError(null);
        },
        "error-callback": () => {
          setTurnstileToken(null);
          setTurnstileError("Human verification failed. Please try again.");
        },
        "expired-callback": () => {
          setTurnstileToken(null);
        },
      });
      turnstileWidgetIdRef.current = widgetId;
    };

    if (!window.turnstile) {
      intervalId = window.setInterval(() => {
        if (window.turnstile) {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
          initTurnstile();
        }
      }, 200);
    } else {
      initTurnstile();
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [isAiMode]);

  const copyToClipboard = () => {
    if (noteUrl) {
      navigator.clipboard.writeText(noteUrl);
      toast({
        title: "Copied!",
        description: "Secret note link copied to clipboard",
      });
    }
  };

  const shareViaEmail = () => {
    if (noteUrl) {
      const subject = "Secure Private Note";
      const body = `I've shared a secure, encrypted note with you. Click the link to view it: ${noteUrl}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      toast({
        title: "Email App Opened",
        description: "Your default email app should open with the note link",
      });
    }
  };
  
  // Function to copy QR code as image to clipboard
  const copyQrCodeToClipboard = async () => {
    try {
      // Create a temporary canvas to render the QR code
      const qrCodeElement = document.getElementById('note-qr-code');
      if (qrCodeElement) {
        // Since direct copy of SVG to clipboard is complex, create a download instead
        const svgElement = qrCodeElement.querySelector('svg');
        if (svgElement) {
          // Create a temporary canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions (with some padding)
          canvas.width = 200;
          canvas.height = 200;
          
          // Draw white background
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const DOMURL = window.URL || window.webkitURL || window;
            const url = DOMURL.createObjectURL(svgBlob);
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = "privatenote-qr.svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Release the object URL
            setTimeout(() => {
              DOMURL.revokeObjectURL(url);
            }, 100);
            
            toast({
              title: "QR Code Downloaded",
              description: "QR code saved as SVG file. You can now share it.",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({
        title: "Error",
        description: "Could not download QR code. Try using the link instead.",
        variant: "destructive",
      });
    }
  };
  
  // Function to email QR code without link
  const emailQrCode = () => {
    if (noteUrl) {
      const subject = "Secure Private Note";
      const body = `I've shared a secure, encrypted note with you. Scan the attached QR code to view it.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      toast({
        title: "Email App Opened",
        description: "Your default email app should open. Attach the QR code manually to your email.",
      });
    }
  };

  const createNewNote = () => {
    setNoteUrl(null);
    setNoteContent("");
    setAiPrompt("");
    setContentFinalized(false);
    setOriginalPrompt("");
    setPromptHistory([]); // Clear prompt history
    setShowAdvancedOptions(false);
    setShowPrompt(true); // Reset to show prompt input
  };

  const selectTemplate = (template: (typeof promptTemplates)[0]) => {
    setAiPrompt(template.template);
    setAiEnhancementType(template.enhancementType);
    setSelectedTemplateId(template.id);
    // Removed notification toast for cleaner UX
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the AI",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingContent(true);

    // If this is the first prompt, store it as the original prompt
    if (!originalPrompt) {
      setOriginalPrompt(aiPrompt);
    }

    // Only add the prompt to history if it's not already the last entry
    // This prevents duplicate entries when clicking "Generate" multiple times
    setPromptHistory((prevHistory) => {
      // If history is empty or the last entry is different from current prompt
      if (
        prevHistory.length === 0 ||
        prevHistory[prevHistory.length - 1] !== aiPrompt
      ) {
        return [...prevHistory, aiPrompt];
      }
      return prevHistory;
    });

    // Reset content finalized state
    setContentFinalized(false);

    try {
      // Use our OpenAI integration to generate content with the selected enhancement type
      const aiGeneratedContent = await enhanceNoteWithAI(
        aiPrompt,
        aiEnhancementType,
        turnstileToken,
      );

      setNoteContent(aiGeneratedContent);

      // Hide prompt and show generated content
      setShowPrompt(false);

      toast({
        title: "Success",
        description: `AI content ${aiEnhancementType}d successfully using gpt-4o-mini.`,
      });
    } catch (error) {
      console.error("Error generating AI content:", error);

      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Handle Back button click - show prompt history
  const handleBackButton = () => {
    // Save the current state before going back
    const currentContent = noteContent;

    // Always go to prompt input mode
    setShowPrompt(true);

    // If there's prompt history, go back to the previous prompt
    if (promptHistory.length > 0) {
      // Record the current state in a temporary variable so we don't lose it
      const historyWithCurrent = [...promptHistory];

      // Set the prompt to the last entry in the history
      const previousPrompt = historyWithCurrent.pop() || "";
      setAiPrompt(previousPrompt);

      // Update the prompt history
      setPromptHistory(historyWithCurrent);

      toast({
        title: "Previous Prompt Restored",
        description: "You can edit this prompt and regenerate content.",
      });
    } else if (originalPrompt) {
      // If no history but we have the original prompt, use that
      setAiPrompt(originalPrompt);
      toast({
        title: "Original Prompt Restored",
        description: "You're back to where you started.",
      });
    }
  };

  // Functions for post-generation options
  const handleImprove = async () => {
    if (!noteContent) return;

    // Save current content before improving
    const improvePrompt = `Improve this text for clarity and style: ${noteContent}`;

    // Add the improvement action to prompt history
    setPromptHistory((prevHistory) => [...prevHistory, improvePrompt]);

    setIsGeneratingContent(true);
    try {
      const improvedContent = await enhanceNoteWithAI(noteContent, "improve", turnstileToken);
      setNoteContent(improvedContent);
      toast({
        title: "Content Improved",
        description:
          "The AI has refined your content for better clarity and style.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSummarize = async () => {
    if (!noteContent) return;

    // Save current content before summarizing
    const summarizePrompt = `Summarize this text into key points: ${noteContent}`;

    // Add the summarize action to prompt history
    setPromptHistory((prevHistory) => [...prevHistory, summarizePrompt]);

    setIsGeneratingContent(true);
    try {
      const summarizedContent = await enhanceNoteWithAI(
        noteContent,
        "summarize",
        turnstileToken,
      );
      setNoteContent(summarizedContent);
      toast({
        title: "Content Summarized",
        description: "The AI has summarized your content to its key points.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSimplify = async () => {
    if (!noteContent) return;

    // Save current content before simplifying
    const simplifyPrompt = `Simplify this text and make it easier to understand: ${noteContent}`;

    // Add the simplify action to prompt history
    setPromptHistory((prevHistory) => [...prevHistory, simplifyPrompt]);

    setIsGeneratingContent(true);
    try {
      const simplifiedContent = await enhanceNoteWithAI(noteContent, "improve", turnstileToken);
      setNoteContent(simplifiedContent);
      toast({
        title: "Content Simplified",
        description: "The AI has simplified your content for easier reading.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to simplify content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleRegenerate = async () => {
    if (!originalPrompt) return;

    // Add a regeneration entry to the prompt history
    const regeneratePrompt = `Regenerate from original prompt: ${originalPrompt}`;

    // Record this action in the prompt history
    setPromptHistory((prevHistory) => [...prevHistory, regeneratePrompt]);

    setIsGeneratingContent(true);
    try {
      const newContent = await enhanceNoteWithAI(
        originalPrompt,
        aiEnhancementType,
        turnstileToken,
      );
      setNoteContent(newContent);
      toast({
        title: "Content Regenerated",
        description:
          "The AI has created a new version based on your original prompt.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleAccept = () => {
    setContentFinalized(true);
    toast({
      title: "Content Accepted",
      description: "You can now proceed to create an encrypted note.",
    });
  };

  // If we have a note URL, show the result page
  if (noteUrl) {
    return (
      <section className="max-w-3xl mx-auto">
        <div className="mb-4 mt-4"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Note Created Successfully
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 whitespace-pre-wrap break-words border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Your note has been encrypted and stored securely. Share this
                link with the recipient:
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex-grow flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-600">
                  <div className="text-sm text-gray-800 dark:text-gray-200 truncate flex-grow">
                    {noteUrl}
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                    title="Copy link to clipboard"
                  >
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy Link
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="flex items-center px-3 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-200 rounded-md transition-colors"
                    title="Email link to recipient"
                  >
                    <Mail className="h-4 w-4 mr-1.5" />
                    Email Link
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center my-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2" id="note-qr-code">
                <QRCode value={noteUrl} size={180} />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={copyQrCodeToClipboard}
                  className="flex items-center px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                  title="Download QR code as SVG image"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  Save QR
                </button>
                <button
                  onClick={emailQrCode}
                  className="flex items-center px-3 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-200 rounded-md transition-colors"
                  title="Email the QR code"
                >
                  <Mail className="h-4 w-4 mr-1.5" />
                  Email QR
                </button>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-amber-800 dark:text-amber-200 text-sm">
              {isPasswordProtected ? (
                <>
                  <p>
                    <strong>Password protection enabled:</strong> The recipient
                    will need to enter your password to decrypt this note.
                  </p>
                  <p className="mt-1">
                    Make sure to securely share the password with the recipient
                    using a different communication channel.
                  </p>
                </>
              ) : (
                <p>
                  <strong>Security notice:</strong> This link contains the
                  encryption key. Anyone with this link can read the note.
                </p>
              )}
              <p className="mt-1">
                The note will be permanently deleted after it has been read once
                or after {getExpiryTimeDisplay(expiryValue)}.
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={createNewNote}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Create Another Note
              </button>
            </div>

            <SecurityRecommendations type="compact" context="success" />
          </div>
        </div>
      </section>
    );
  }

  // Otherwise show the create form
  return (
    <section className="max-w-3xl mx-auto">
      <div className="pt-4">
        {/* Mode toggle */}
        <div className="mb-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
            <button
              type="button"
              onClick={() => setIsAiMode(false)}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                !isAiMode
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2" />
                Write Manually
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsAiMode(true)}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                isAiMode
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Write with AI
                <span className="ml-1 text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Beta
                </span>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          {isAiMode ? (
            <div className="space-y-3 mb-4">
              {/* Write with AI Mode Notice removed from here - now shown below the Generate button */}

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                  What kind of message would you like to write?
                </h3>

                <div className="mb-4">
                  {/* Just the top 5 most used templates */}
                  <div className="flex flex-wrap gap-2">
                    {promptTemplates.slice(0, 5).map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => selectTemplate(template)}
                        className={`h-8 px-3 rounded-full text-xs font-medium border transition-colors text-center inline-flex items-center
                          ${
                            selectedTemplateId === template.id
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>

                  {/* Show more templates button */}
                  <div className="mt-3">
                    {showAllTemplates && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {promptTemplates.slice(5).map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => selectTemplate(template)}
                            className={`h-8 px-3 rounded-full text-xs font-medium border transition-colors text-center inline-flex items-center
                              ${
                                selectedTemplateId === template.id
                                  ? "bg-primary/10 text-primary border-primary/30"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                              }`}
                          >
                            {template.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Toggle button */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowAllTemplates(!showAllTemplates)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center px-2 py-1"
                      >
                        {showAllTemplates ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Show fewer templates
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show more templates
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Show either the prompt input or the generated content based on showPrompt state */}
                {showPrompt ? (
                  <div>
                    <div className="relative">
                      <textarea
                        id="ai-prompt"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-[140px]"
                        placeholder={
                          selectedTemplateId === "ask-anything"
                            ? "Type your message request here (e.g., 'Write a professional email to my boss requesting time off next week')"
                            : selectedTemplateId === "thank-you"
                              ? "Add details about who you're thanking and what for (e.g., 'Thank Sarah for helping with the project')"
                              : selectedTemplateId === "meeting-request"
                                ? "Specify who, when, where and what the meeting is about"
                                : selectedTemplateId === "birthday"
                                  ? "Include the person's name, relationship, and their interests for a personalized message"
                                  : selectedTemplateId === "apology"
                                    ? "Describe what happened and how you plan to make it right"
                                    : aiEnhancementType === "summarize"
                                      ? "Paste a long text that you want to summarize..."
                                      : aiEnhancementType === "secure"
                                        ? "Paste text that might contain sensitive information to redact..."
                                        : "Describe what you want the AI to write for you..."
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={isGeneratingContent}
                        className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Generate with AI"
                      >
                        {isGeneratingContent ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Write with AI Mode Notice - moved here from top */}
                    <div className="mt-3 space-y-3">
                      {/* Cloudflare Turnstile (AI mode only) */}
                      {isAiMode && (
                        <div className="flex flex-col gap-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-3">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Verify you are human to use AI mode.
                          </div>
                          <div id="turnstile-container" className="min-h-[65px]" />
                          {!turnstileReady && !turnstileError && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Loading verification...
                            </div>
                          )}
                          {turnstileError && (
                            <div className="text-xs text-red-600 dark:text-red-400">
                              {turnstileError}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Original AI notice */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                        <p className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            <strong>Write with AI:</strong> Your prompts will be
                            processed privately. Note that final content will
                            still be encrypted in your browser. No data is
                            stored on our servers.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : noteContent ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        AI-Generated Content{" "}
                        <span className="text-xs text-gray-500">
                          (you can edit below)
                        </span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleBackButton}
                        className="text-xs flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Back
                      </button>
                    </div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => {
                        // Check if content is within the 100KB limit (approximately 102,400 characters)
                        if (e.target.value.length <= 102400) {
                          setNoteContent(e.target.value);
                        } else {
                          toast({
                            title: "Content too large",
                            description: "Notes are limited to 100KB in size",
                            variant: "destructive",
                          });
                        }
                      }}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                    {/* Size indicator */}
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {(
                        new TextEncoder().encode(noteContent).length / 1024
                      ).toFixed(1)}{" "}
                      KB / 100 KB
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action buttons when we have content and are in AI mode */}
              {noteContent && !showPrompt && !contentFinalized && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      type="button"
                      onClick={handleImprove}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                      Improve
                    </button>
                    <button
                      type="button"
                      onClick={handleSummarize}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <ZoomIn className="h-4 w-4 mr-1 text-blue-500" />
                      Summarize
                    </button>
                    <button
                      type="button"
                      onClick={handleSimplify}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4 mr-1 text-purple-500" />
                      Simplify
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-1 text-green-500" />
                      Regenerate
                    </button>
                    <button
                      type="button"
                      onClick={handleAccept}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <textarea
                value={noteContent}
                onChange={(e) => {
                  // Check if content is within the 50KB limit (approximately 51,200 characters)
                  if (e.target.value.length <= 51200) {
                    setNoteContent(e.target.value);
                  } else {
                    toast({
                      title: "Content too large",
                      description: "Notes are limited to 50KB in size",
                      variant: "destructive",
                    });
                  }
                }}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-primary/60 dark:border-primary/40 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Type your confidential message here..."
                required
              />
              {/* Size indicator */}
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                {(new TextEncoder().encode(noteContent).length / 1024).toFixed(
                  1,
                )}{" "}
                KB / 50 KB
              </div>
            </div>
          )}

          {/* Add a bit of negative margin to bring elements closer */}
          <div className="mt-[-0.5rem]"></div>

          {/* Advanced options panel - with animation and modern styling */}
          <div
            className={`mb-6 overflow-hidden transition-all duration-300 ease-in-out ${
              showAdvancedOptions
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Custom Settings
                </h3>
              </div>

              {/* Password protection - just the input field */}
              <div className="grid grid-cols-3 gap-2 items-center py-2 px-1 mb-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors">
                <div className="col-span-1">
                  <label
                    htmlFor="note-password"
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span className="bg-green-50 dark:bg-green-900/30 p-1 rounded mr-2">
                      <Lock className="w-4 h-4 text-green-500 dark:text-green-400" />
                    </span>
                    <div>
                      <span className="block">Password</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                        Recipients will need a password to decrypt
                      </span>
                    </div>
                  </label>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <div className="flex">
                      <input
                        id="note-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a secure password (optional)"
                        className="w-full px-2.5 py-1.5 text-sm rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm"
                      />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-2 py-1.5 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300"
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() =>
                              setPassword(generateHumanFriendlyPassword())
                            }
                            className="px-2 py-1.5 bg-green-50 dark:bg-green-900/30 border border-gray-300 dark:border-gray-600 text-xs text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 flex items-center"
                            title="Generate human-friendly password (easy to remember)"
                          >
                            <User className="h-4 w-4 mr-1" />
                            <span>Simple</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPassword(generateStrongPassword())
                            }
                            className="px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 border-t border-r border-b border-gray-300 dark:border-gray-600 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-r-md flex items-center"
                            title="Generate strong password (very secure)"
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            <span>Strong</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* Time settings with improved design */}
              <div className="mt-3 flex flex-col space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors">
                  <div className="col-span-1">
                    <label
                      htmlFor="expiry-days"
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <span className="bg-blue-50 dark:bg-blue-900/30 p-1 rounded mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-500 dark:text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Expiration
                    </label>
                  </div>
                  <div className="col-span-2">
                    <select
                      id="expiry-value"
                      value={expiryValue}
                      onChange={(e) => setExpiryValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 backdrop-blur-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.75rem center",
                        backgroundSize: "0.75em",
                      }}
                    >
                      <option value="5m">5 minutes</option>
                      <option value="10m">10 minutes</option>
                      <option value="30m">30 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="2h">2 hours</option>
                      <option value="8h">8 hours</option>
                      <option value="1d">1 day</option>
                      <option value="3d">3 days</option>
                      <option value="7d">7 days</option>
                    </select>
                  </div>
                </div>

                {/* View Limit is now fixed to once, so we display info about this instead of a selector */}
                <div className="grid grid-cols-3 gap-2 items-center py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors">
                  <div className="col-span-1">
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="bg-purple-50 dark:bg-purple-900/30 p-1 rounded mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-purple-500 dark:text-purple-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      View Limit
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Notes can only be viewed once for maximum security
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Show these buttons when either:
              1. We're not in AI mode (regardless of content), OR
              2. We're in AI mode and content has been finalized (accepted)
          */}
          {!isAiMode || (noteContent && isAiMode && contentFinalized) ? (
            <div className="space-y-4 mt-3">
              {/* Button row - Settings and Create together */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
                {/* Custom Settings button - same size as create button, aligned left */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full sm:w-auto min-w-[180px] flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                >
                  {showAdvancedOptions ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1.5 text-primary" />
                      <span>Hide Options</span>
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-1.5 text-primary" />
                      <span>Customize</span>
                    </>
                  )}
                </button>

                {/* Primary action - Create button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto min-w-[180px] flex items-center justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating secure note...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-1.5" />
                      Share Private Note
                    </>
                  )}
                </button>
              </div>

              {/* Privacy info banner with expiration info */}
              <div className="flex flex-wrap items-start justify-start gap-x-3 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 py-1">
                <span className="flex items-center whitespace-nowrap">
                  <Eye className="h-3 w-3 mr-1 text-orange-500" />
                  Expires after {getExpiryTimeDisplay(expiryValue)} or 1 read
                </span>
                {isPasswordProtected && (
                  <>
                    <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block"></span>
                    <span className="flex items-center whitespace-nowrap">
                      <Key className="h-3 w-3 mr-1 text-yellow-500" />
                      Password protected
                    </span>
                  </>
                )}
                <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block"></span>
                <span className="flex items-center whitespace-nowrap">
                  <Shield className="h-3 w-3 mr-1 text-green-500" />
                  End-to-end encrypted
                </span>
                <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block"></span>
                <span className="flex items-center whitespace-nowrap">
                  <Lock className="h-3 w-3 mr-1 text-blue-500" />
                  AES-256 GCM
                </span>
                <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block"></span>
                <span className="flex items-center whitespace-nowrap">
                  <Eye className="h-3 w-3 mr-1 text-purple-500 opacity-20" />
                  No tracking
                </span>
                <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden md:block"></span>
                <span className="flex items-center whitespace-nowrap">
                  <Shield className="h-3 w-3 mr-1 text-red-500 opacity-20" />
                  No ads
                </span>
              </div>
            </div>
          ) : null}

          {/* Write with AI Mode Notice removed from here as it's now shown below the Generate button */}
        </form>
      </div>

      {/* Pro Tier Promotion (Placeholder) */}
      {isAiMode && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            <span className="text-primary font-semibold">Coming soon:</span>{" "}
            Upgrade to Pro for unlimited AI-powered notes with local AI
            processing for maximum privacy.
          </p>
        </div>
      )}
    </section>
  );
};
