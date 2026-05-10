import { Switch, Route, useLocation } from "wouter";
import { Fragment, useEffect, useLayoutEffect, type ComponentType } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import ViewNote from "@/pages/ViewNote";
import PasswordGenerator from "@/pages/PasswordGenerator";
import SecurityResources from "@/pages/SecurityResources";
import PrivacyTools from "@/pages/PrivacyTools";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HowItWorks from "@/pages/HowItWorks";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BlogAdmin from "@/pages/BlogAdmin";
import Analytics from "@/pages/Analytics";
import AuditLogs from "@/pages/AuditLogs";
import NotFound from "@/pages/not-found";
import SecurityGuideDetail from "./pages/SecurityGuideDetail";
import TestClientLLM from "@/pages/TestClientLLM";
import Auth from "@/pages/Auth";
import AuthMagic from "@/pages/AuthMagic";
import AuthRecovery from "@/pages/AuthRecovery";
import AuthSignIn from "@/pages/AuthSignIn";
import AuthSignUp from "@/pages/AuthSignUp";
import AuthEmailChange from "@/pages/AuthEmailChange";
import AuthTotp from "@/pages/AuthTotp";
import SecuritySettings from "@/pages/SecuritySettings";
import AccountOverview from "@/pages/account/AccountOverview";
import AccountActivity from "@/pages/account/AccountActivity";
import AccountPreferences from "@/pages/account/AccountPreferences";
import { ThemePreferenceRoot } from "@/hooks/useThemePreference";
import LlmUi from "@/pages/LlmUi";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";
import { setDocumentMeta } from "@/utils/documentMeta";
import { resolveDocumentMeta } from "@/utils/resolveDocumentMeta";

const HOME_ALTERNATES: Array<{ hrefLang: string; path: string }> = [
  { hrefLang: "en", path: "/" },
  { hrefLang: "de", path: "/de/" },
  { hrefLang: "fr", path: "/fr/" },
  { hrefLang: "es", path: "/es/" },
  { hrefLang: "x-default", path: "/" },
];

function pathWithoutQueryOrHash(loc: string): string {
  return loc.split(/[?#]/)[0] ?? "";
}

/** Language for hreflang/canonical when the URL is a locale home route (/, /de/, /de, …). */
function homeSeoLanguageForPath(pathname: string): SupportedLanguage | null {
  const p = pathname || "/";
  if (p === "/") return "en";
  const parts = p.split("/").filter(Boolean);
  if (parts.length !== 1) return null;
  const code = parts[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(code) && code !== "en" ? code : null;
}

function removeHomeLocaleSeoLinks() {
  document.head
    .querySelectorAll<HTMLLinkElement>('link[data-privatenote-home-locale="true"]')
    .forEach((link) => link.remove());
}

function setHomeSeoLinks(language: SupportedLanguage) {
  const origin = window.location.origin;
  const canonicalPath = language === "en" ? "/" : `/${language}/`;
  const existing = document.head.querySelectorAll<HTMLLinkElement>(
    'link[data-privatenote-home-locale="true"]',
  );
  existing.forEach((link) => link.remove());

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = `${origin}${canonicalPath}`;
  canonical.dataset.privatenoteHomeLocale = "true";
  document.head.appendChild(canonical);

  HOME_ALTERNATES.forEach((alternate) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = alternate.hrefLang;
    link.href = `${origin}${alternate.path}`;
    link.dataset.privatenoteHomeLocale = "true";
    document.head.appendChild(link);
  });
}

function HomeRoute({ language = "en" }: { language?: SupportedLanguage }) {
  const { language: activeLanguage, setLanguage } = useLanguage();

  useEffect(() => {
    if (activeLanguage !== language) {
      setLanguage(language);
    }
  }, [activeLanguage, language, setLanguage]);

  return <Home />;
}

function LocalizedRoute({
  language,
  component: Component,
}: {
  language: SupportedLanguage;
  component: ComponentType;
}) {
  const { language: activeLanguage, setLanguage } = useLanguage();

  useEffect(() => {
    if (activeLanguage !== language) {
      setLanguage(language);
    }
  }, [activeLanguage, language, setLanguage]);

  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { t } = useLanguage();

  useLayoutEffect(() => {
    /** Hreflang + canonical for locale homes only; paths must match CDN 200s (e.g. …/de/, not …/de). */
    const path = pathWithoutQueryOrHash(location);
    const homeLang = homeSeoLanguageForPath(path);
    if (homeLang === null) {
      removeHomeLocaleSeoLinks();
    } else {
      setHomeSeoLinks(homeLang);
    }

    const meta = resolveDocumentMeta(path, t);
    setDocumentMeta(meta.title, meta.description);

    /** Wouter navigations preserve scroll — reset so CTAs to home/read content start from the top. */
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location, t]);
  const isAuthRoute = location.startsWith("/auth") || location === "/magic";
  const showNavbar =
    !isAuthRoute ||
    location.startsWith("/auth/magic") ||
    location === "/magic" ||
    location.startsWith("/auth/email-change") ||
    location.startsWith("/auth/totp");

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
      {showNavbar && <Navbar />}
      <main className={`min-w-0 flex-grow ${isAuthRoute ? "pt-6" : "pt-16"}`}>
        <Switch>
          <Route path="/" component={() => <HomeRoute />} />
          <Route path="/de" component={() => <HomeRoute language="de" />} />
          <Route path="/de/" component={() => <HomeRoute language="de" />} />
          <Route path="/fr" component={() => <HomeRoute language="fr" />} />
          <Route path="/fr/" component={() => <HomeRoute language="fr" />} />
          <Route path="/es" component={() => <HomeRoute language="es" />} />
          <Route path="/es/" component={() => <HomeRoute language="es" />} />
          {(["de", "fr", "es"] as const).map((language) => (
            <Fragment key={language}>
              <Route path={`/${language}/password-generator`} component={() => <LocalizedRoute language={language} component={PasswordGenerator} />} />
              <Route path={`/${language}/privacy-tools`} component={() => <LocalizedRoute language={language} component={PrivacyTools} />} />
              <Route path={`/${language}/security-resources`} component={() => <LocalizedRoute language={language} component={SecurityResources} />} />
              <Route path={`/${language}/how-it-works`} component={() => <LocalizedRoute language={language} component={HowItWorks} />} />
              <Route path={`/${language}/about`} component={() => <LocalizedRoute language={language} component={About} />} />
              <Route path={`/${language}/contact`} component={() => <LocalizedRoute language={language} component={Contact} />} />
              <Route path={`/${language}/blog/:slug`} component={() => <LocalizedRoute language={language} component={BlogPost} />} />
              <Route path={`/${language}/blog`} component={() => <LocalizedRoute language={language} component={Blog} />} />
              <Route path={`/${language}/privacy`} component={() => <LocalizedRoute language={language} component={Privacy} />} />
              <Route path={`/${language}/terms`} component={() => <LocalizedRoute language={language} component={Terms} />} />
            </Fragment>
          ))}
          <Route path="/note/:id" component={ViewNote} />
          <Route path="/password-generator" component={PasswordGenerator} />
          <Route path="/privacy-tools" component={PrivacyTools} />
          <Route path="/security-resources" component={SecurityResources} />
          <Route path="/security-guides/:topicId" component={SecurityGuideDetail} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/admin/blog" component={BlogAdmin} />
          <Route path="/admin/analytics" component={Analytics} />
          <Route path="/admin/audit-logs" component={AuditLogs} />
          <Route path="/test-llm" component={TestClientLLM} />
          <Route path="/llm-ui" component={LlmUi} />
          <Route path="/auth" component={() => <Auth />} />
          <Route path="/auth/sign-in" component={AuthSignIn} />
          <Route path="/auth/sign-up" component={AuthSignUp} />
          <Route path="/auth/magic" component={AuthMagic} />
          <Route path="/magic" component={AuthMagic} />
          <Route path="/auth/recovery" component={AuthRecovery} />
          <Route path="/auth/email-change" component={AuthEmailChange} />
          <Route path="/auth/totp" component={AuthTotp} />
          <Route path="/account/security" component={SecuritySettings} />
          <Route path="/account/activity" component={AccountActivity} />
          <Route path="/account/preferences" component={AccountPreferences} />
          <Route path="/account" component={AccountOverview} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <ThemePreferenceRoot />
          <Router />
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
