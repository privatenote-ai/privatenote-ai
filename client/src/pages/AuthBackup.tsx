import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

export default function AuthBackup() {
  const [location] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your backup email...");

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    apiRequest("/api/auth/backup/verify?token=" + encodeURIComponent(token), "GET")
      .then(() => {
        setStatus("success");
        setMessage("Backup email verified.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Verification failed.");
      });
  }, [location]);

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Backup Email</CardTitle>
          <CardDescription>
            {status === "loading" ? "Verifying..." : status === "success" ? "Success" : "Error"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
