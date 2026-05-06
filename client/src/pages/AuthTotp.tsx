import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export default function AuthTotp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshUntilAuthenticated } = useAuth();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (code.length === 6) {
      handleVerify(code);
    }
  }, [code]);

  const handleVerify = async (otpCode: string) => {
    if (otpCode.length !== 6) return;
    setVerifying(true);
    setError(null);
    try {
      await apiRequest("/api/auth/totp/verify", "POST", { code: otpCode });
      toast({ title: "Verified", description: "You're signed in." });
      // Retry refresh: D1 read-after-write lag can briefly return authenticated:false
      // even though the verify endpoint just set auth_complete=1.
      await refreshUntilAuthenticated();
      setLocation("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      if (msg.includes("429") || msg.includes("Too many")) {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (msg.includes("Invalid")) {
        setError("Invalid code. Please try again.");
      } else {
        setError(msg);
      }
      setCode("");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">2-step verification</CardTitle>
          <CardDescription className="text-base mt-2">
            Enter the 6-digit code from your authenticator app to continue signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(code);
            }}
            className="flex flex-col items-center gap-4"
          >
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={verifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={verifying || code.length !== 6}
              className="w-full"
              size="lg"
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Lost access to your authenticator app?</p>
            <p>
              <a href="/auth/recovery" className="text-primary hover:underline">
                Use a recovery code
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
