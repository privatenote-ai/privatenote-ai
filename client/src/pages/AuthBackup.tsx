import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthBackup() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>(t.authBackupVerifyingMessage);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage(t.authBackupMissingToken);
      return;
    }

    apiRequest("/api/auth/backup/verify?token=" + encodeURIComponent(token), "GET")
      .then(() => {
        setStatus("success");
        setMessage(t.authBackupVerifiedMessage);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : t.authBackupVerificationFailed);
      });
  }, [location, t.authBackupMissingToken, t.authBackupVerifiedMessage, t.authBackupVerificationFailed]);

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t.authBackupTitle}</CardTitle>
          <CardDescription>
            {status === "loading"
              ? t.authBackupLoading
              : status === "success"
                ? t.authBackupSuccess
                : t.authBackupError}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
