import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { formatMcpUserCode, normalizeMcpUserCode } from "@shared/mcpDeviceAuth";
import { Loader2 } from "lucide-react";

export default function AuthDevice() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [codeInput, setCodeInput] = useState("");
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const pluginClient = useMemo(() => {
    if (typeof window === "undefined") return "mcp";
    const client = new URLSearchParams(window.location.search).get("client");
    return client === "chrome" || client === "vscode" ? client : "mcp";
  }, []);

  const clientLabel =
    pluginClient === "chrome"
      ? "the Chrome extension"
      : pluginClient === "vscode"
        ? "VS Code or Cursor"
        : "Cursor (MCP)";

  const userCodeFromUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    return normalizeMcpUserCode(new URLSearchParams(window.location.search).get("user_code"));
  }, []);

  const resolvedCode = userCodeFromUrl || normalizeMcpUserCode(codeInput);

  const deviceReturnPath = resolvedCode
    ? `/auth/device?user_code=${formatMcpUserCode(resolvedCode)}&client=${pluginClient}`
    : `/auth/device?client=${pluginClient}`;
  const signInHref = `/auth/sign-in?returnTo=${encodeURIComponent(deviceReturnPath)}`;

  const approve = async () => {
    if (!resolvedCode) {
      toast({
        title: "Enter the code",
        description: "Use the 8-character code shown in the app you are authorizing.",
        variant: "destructive",
      });
      return;
    }
    setApproving(true);
    try {
      await apiRequest("/api/auth/device/approve", "POST", { userCode: resolvedCode });
      setApproved(true);
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Could not approve this app. Try generating a new code from VS Code, Chrome, or MCP.";
      toast({ title: "Approval failed", description: message, variant: "destructive" });
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="fixed top-0 left-0 z-40 p-4 sm:p-6">
        <a href="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
          <span className="font-bold text-2xl text-primary">
            privateNote
            <span className="text-xs text-primary align-super ml-0.5">.ai</span>
          </span>
        </a>
      </div>
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Approve {clientLabel}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              {pluginClient === "chrome"
                ? "Link the Chrome extension to the PrivateNote account you already have so it can attach encrypted files without using the website cookie."
                : pluginClient === "vscode"
                  ? "Link VS Code or Cursor to the PrivateNote account you already have."
                  : "Link Cursor to the PrivateNote account you already have so encrypted file transfer and signed-in note limits work locally."}
            </p>
          </div>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">
                {userCodeFromUrl ? "Confirm this connection" : "Enter the code from the app"}
              </CardTitle>
              <CardDescription>
                {userCodeFromUrl
                  ? "This page was opened from the app on your machine. You do not need to type a code — approve only if you started this sign-in."
                  : "Type the 8-character code shown in the app, then approve. Only approve a code you just generated."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approved ? (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Approved. You can return to the app — it will finish authorizing.
                </p>
              ) : loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking session…
                </div>
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Sign in first, then you will return here to approve. You will not need to type a
                    code if this page already came from the app.
                  </p>
                  <Button asChild>
                    <a href={signInHref}>Sign in</a>
                  </Button>
                </div>
              ) : (
                <>
                  {userCodeFromUrl ? null : (
                    <div className="space-y-2">
                      <label htmlFor="mcp-user-code" className="text-sm font-medium">
                        Code from the app
                      </label>
                      <Input
                        id="mcp-user-code"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                        placeholder="ABCD-EFGH"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                  )}
                  <Button onClick={() => void approve()} disabled={approving || !resolvedCode}>
                    {approving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving…
                      </>
                    ) : (
                      "Approve this app"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
