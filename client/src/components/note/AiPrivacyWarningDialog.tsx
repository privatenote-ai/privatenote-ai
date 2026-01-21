import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Shield, Lock, ExternalLink } from "lucide-react";

interface AiPrivacyWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AiPrivacyWarningDialog: React.FC<AiPrivacyWarningDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}) => {
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleConfirm = () => {
    if (rememberChoice) {
      localStorage.setItem("ai_privacy_consent_v1", "accepted");
    }
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (rememberChoice) {
      localStorage.setItem("ai_privacy_consent_v1", "declined");
    }
    onCancel();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Privacy Warning
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4 text-left">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Using AI features will send your note content to OpenAI for processing.
            </p>

            <div className="space-y-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    End-to-End Encryption Broken
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    Your note will be decrypted and sent to a third-party service (OpenAI).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Data Sharing
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    OpenAI may log or store your content for abuse prevention and service improvement.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="remember-choice"
                checked={rememberChoice}
                onChange={(e) => setRememberChoice(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember-choice"
                className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                Remember my choice (don't show this warning again)
              </label>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p>
                For truly private AI processing, consider using client-side AI models (coming soon).
                <a
                  href="https://openai.com/policies/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline ml-1"
                >
                  Learn more <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            I Understand, Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
