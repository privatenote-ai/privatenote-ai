import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthRecovery() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"form" | "success">("form");
  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !code.trim()) {
      toast({ title: t.authRecoveryMissingInfoTitle, description: t.authRecoveryMissingInfoDesc });
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
        title: t.authRecoveryFailedTitle,
        description: error instanceof Error ? error.message : t.authRecoveryTryAgain,
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
          <CardTitle>{t.authRecoveryTitle}</CardTitle>
          <CardDescription>
            {status === "form" ? t.authRecoveryDescriptionForm : t.authRecoveryDescriptionSuccess}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "form" ? (
            <>
              <Input
                type="email"
                placeholder={t.authRecoveryEmailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder={t.authRecoveryCodePlaceholder}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <Button onClick={handleSubmit} disabled={isBusy}>
                {t.authRecoveryContinue}
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">{t.authRecoverySuccessBody}</p>
              <Button asChild>
                <a href="/account">{t.authRecoveryGoToAccount}</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
