import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, AlertCircle, Mail } from "lucide-react";

export default function AuthEmailChange() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your new email address...");
  const [newEmail, setNewEmail] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    apiRequest<{ ok: boolean; message: string; newEmail?: string }>(
      "/api/auth/email/change/verify?token=" + encodeURIComponent(token),
      "GET"
    )
      .then((response) => {
        setStatus("success");
        setMessage("Your email address has been updated.");
        if (response.newEmail) {
          setNewEmail(response.newEmail);
        }
        refresh();
        toast({
          title: "Email updated",
          description: "Your email address has been changed successfully.",
        });
      })
      .catch((error) => {
        setStatus("error");
        const raw = error instanceof Error ? error.message : "Verification failed.";
        if (raw.includes("expired") || raw.includes("Invalid")) {
          setMessage("This verification link has expired or is invalid. Please request a new email change.");
        } else if (raw.includes("available") || raw.includes("taken")) {
          setMessage("This email address is no longer available. Please try a different email.");
        } else {
          setMessage("We couldn't verify your new email address. Please try again.");
        }
      });
  }, []);

  return (
    <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Loading State */}
        {status === "loading" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <Mail className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl">Updating your email...</CardTitle>
              <CardDescription className="text-base mt-2">
                {message}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Success State */}
        {status === "success" && (
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                  <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500 relative z-10" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Email Change
                </p>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  Email Updated
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  {message}
                </CardDescription>
                {newEmail && (
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                    New email: {newEmail}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/security")} size="lg">
                  Go to Security Settings
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {status === "error" && (
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                  <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-500 relative z-10" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Email Change
                </p>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  Verification Failed
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  {message}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/security")} size="lg">
                  Go to Security Settings
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  Go to Home
                </Button>
              </div>
              <div className="rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-300 text-center">
                  <strong>Note:</strong> Verification links expire after 1 hour and can only be used once.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
