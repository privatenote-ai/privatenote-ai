import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AuthRecovery() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"form" | "success">("form");
  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !code.trim()) {
      toast({ title: "Missing info", description: "Enter your email and recovery code." });
      return;
    }
    setIsBusy(true);
    try {
      await apiRequest("/api/auth/recovery/consume", "POST", {
        email,
        code,
      });
      setStatus("success");
    } catch (error) {
      toast({
        title: "Recovery failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Use recovery code</CardTitle>
          <CardDescription>
            {status === "form" ? "Sign in with a one-time recovery code." : "Signed in"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "form" ? (
            <>
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <Button onClick={handleSubmit} disabled={isBusy}>
                Continue
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You’re signed in. Head to your security settings to add a new passkey.
              </p>
              <Button asChild>
                <a href="/account/security">Go to security settings</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
