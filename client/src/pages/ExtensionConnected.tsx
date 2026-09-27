import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { setDocumentMeta } from "@/utils/documentMeta";
import { localizedPath } from "@/utils/localizedPath";
import { CHROME_EXTENSION_AUTH_SYNC_EVENT } from "@shared/chromeExtensionAuth";

export default function ExtensionConnected() {
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;

  useEffect(() => {
    setDocumentMeta(
      tx("chromeExtensionConnectedMetaTitle", "Chrome extension connected"),
      tx(
        "chromeExtensionConnectedMetaDesc",
        "Sign-in for the PrivateNote Chrome extension completed. You can return to the extension.",
      ),
    );
  }, [t]);

  useEffect(() => {
    if (loading) return;
    window.dispatchEvent(new CustomEvent(CHROME_EXTENSION_AUTH_SYNC_EVENT));
  }, [loading, user]);

  const signInHref = `${localizedPath("/auth/sign-in", language)}?returnTo=${encodeURIComponent("/extension/connected")}`;

  return (
    <div className="min-h-[60vh] px-4 py-10">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>
            {tx("chromeExtensionConnectedTitle", "Chrome extension")}
          </CardTitle>
          <CardDescription>
            {loading
              ? tx("chromeExtensionConnectedChecking", "Checking your session…")
              : user
                ? tx(
                    "chromeExtensionConnectedSignedInDesc",
                    "You're signed in. Return to the PrivateNote extension to attach files and use your account limits.",
                  )
                : tx(
                    "chromeExtensionConnectedSignedOutDesc",
                    "Sign in on this site so the Chrome extension can attach encrypted files.",
                  )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {tx("chromeExtensionConnectedChecking", "Checking your session…")}
            </div>
          ) : user ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" aria-hidden="true" />
              <p className="text-sm">
                {user.email
                  ? tx("chromeExtensionConnectedAs", "Signed in as {email}").replace(
                      "{email}",
                      user.email,
                    )
                  : tx("chromeExtensionConnectedSignedIn", "Signed in")}
              </p>
            </div>
          ) : (
            <Button asChild>
              <a href={signInHref}>{tx("chromeExtensionConnectedSignIn", "Sign in")}</a>
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary underline-offset-4 hover:underline">
              {tx("chromeExtensionConnectedHome", "Back to PrivateNote")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
