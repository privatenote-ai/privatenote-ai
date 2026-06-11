import { Switch, Route, useLocation, Redirect } from "wouter";
import {
  Fragment,
  Suspense,
  lazy,
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { DeferredToaster } from "@/components/DeferredToaster";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import { ThemePreferenceRoot } from "@/hooks/useThemePreference";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";
import {
  absolutePublicUrl,
  canonicalPathForHomeLanguage,
  HOME_HREFLANG_ALTERNATES,
  homeLanguageFromRoute,
  isLocaleHomeRoute,
} from "@shared/homeSeoLinks";
import { setDocumentMeta } from "@/utils/documentMeta";
import { resolveDocumentMeta } from "@/utils/resolveDocumentMeta";
import { normalizeMarketingPathname } from "@shared/publicMarketingPaths";
import { canAccessInternalAppRoutes } from "@/utils/internalAppRoutes";

const ViewNote = lazy(() => import("@/pages/ViewNote"));
const PasswordGenerator = lazy(() => import("@/pages/PasswordGenerator"));
const SecurityResources = lazy(() => import("@/pages/SecurityResources"));
const PrivacyTools = lazy(() => import("@/pages/PrivacyTools"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Developers = lazy(() => import("@/pages/Developers"));
const Premium = lazy(() => import("@/pages/Premium"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const NotFound = lazy(() => import("@/pages/not-found"));
const SecurityGuideDetail = lazy(() => import("./pages/SecurityGuideDetail"));
const AuthMagic = lazy(() => import("@/pages/AuthMagic"));
const AuthRecovery = lazy(() => import("@/pages/AuthRecovery"));
const AuthSignIn = lazy(() => import("@/pages/AuthSignIn"));
const AuthSignUp = lazy(() => import("@/pages/AuthSignUp"));
const AuthEmailChange = lazy(() => import("@/pages/AuthEmailChange"));
const AuthTotp = lazy(() => import("@/pages/AuthTotp"));
const SecuritySettings = lazy(() => import("@/pages/SecuritySettings"));
const AccountOverview = lazy(() => import("@/pages/account/AccountOverview"));
const AccountActivity = lazy(() => import("@/pages/account/AccountActivity"));
const NotificationCenter = lazy(() => import("@/pages/account/NotificationCenter"));
const AccountPreferences = lazy(() => import("@/pages/account/AccountPreferences"));
const BlogAdmin = lazy(() => import("@/pages/BlogAdmin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const AuditLogs = lazy(() => import("@/pages/AuditLogs"));
const TestClientLLM = lazy(() => import("@/pages/TestClientLLM"));
const LlmUi = lazy(() => import("@/pages/LlmUi"));

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

function LazyRoute({ component: Component }: { component: ComponentType }) {
  return (
    <LazyPage>
      <Component />
    </LazyPage>
  );
}

function pathWithoutQueryOrHash(loc: string): string {
  return loc.split(/[?#]/)[0] ?? "";
}

function removeHomeLocaleSeoLinks() {
  document.head
    .querySelectorAll<HTMLLinkElement>('link[data-privatenote-home-locale="true"]')
    .forEach((link) => link.remove());
}

function setHomeSeoLinks(language: SupportedLanguage) {
  removeHomeLocaleSeoLinks();
  document.head
    .querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
    .forEach((link) => link.remove());

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = absolutePublicUrl(canonicalPathForHomeLanguage(language));
  canonical.dataset.privatenoteHomeLocale = "true";
  document.head.appendChild(canonical);

  HOME_HREFLANG_ALTERNATES.forEach((alternate) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = alternate.hrefLang;
    link.href = absolutePublicUrl(alternate.path);
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

  return (
    <LazyPage>
      <Component />
    </LazyPage>
  );
}

function Router() {
  const [location] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const path = pathWithoutQueryOrHash(location);
    const meta = resolveDocumentMeta(path, t);
    const onLocaleHome = isLocaleHomeRoute(path);
    setDocumentMeta(meta.title, meta.description, {
      skipCanonical: onLocaleHome,
      canonicalPath: onLocaleHome ? undefined : normalizeMarketingPathname(path),
    });
    if (onLocaleHome) {
      setHomeSeoLinks(homeLanguageFromRoute(path) as SupportedLanguage);
    } else {
      removeHomeLocaleSeoLinks();
    }
  }, [location, t]);

  useEffect(() => {
    /** Wouter navigations preserve scroll — reset after paint when not already at top. */
    if (window.scrollY === 0) return;
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);
  const isAuthRoute = location.startsWith("/auth") || location === "/magic";
  const showNavbar =
    !isAuthRoute ||
    location.startsWith("/auth/magic") ||
    location === "/magic" ||
    location.startsWith("/auth/email-change") ||
    location.startsWith("/auth/totp");

  const showInternalRoutes = canAccessInternalAppRoutes();

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
              <Route path={`/${language}/developers`} component={() => <LocalizedRoute language={language} component={Developers} />} />
              <Route path={`/${language}/premium`} component={() => <LocalizedRoute language={language} component={Premium} />} />
              <Route path={`/${language}/about`} component={() => <LocalizedRoute language={language} component={About} />} />
              <Route path={`/${language}/contact`} component={() => <LocalizedRoute language={language} component={Contact} />} />
              <Route path={`/${language}/blog/:slug`} component={() => <LocalizedRoute language={language} component={BlogPost} />} />
              <Route path={`/${language}/blog`} component={() => <LocalizedRoute language={language} component={Blog} />} />
              <Route path={`/${language}/privacy`} component={() => <LocalizedRoute language={language} component={Privacy} />} />
              <Route path={`/${language}/terms`} component={() => <LocalizedRoute language={language} component={Terms} />} />
            </Fragment>
          ))}
          <Route path="/note/:id" component={() => <LazyRoute component={ViewNote} />} />
          <Route path="/password-generator" component={() => <LazyRoute component={PasswordGenerator} />} />
          <Route path="/privacy-tools" component={() => <LazyRoute component={PrivacyTools} />} />
          <Route path="/security-resources" component={() => <LazyRoute component={SecurityResources} />} />
          <Route path="/security-guides/:topicId" component={() => <LazyRoute component={SecurityGuideDetail} />} />
          <Route path="/privacy" component={() => <LazyRoute component={Privacy} />} />
          <Route path="/terms" component={() => <LazyRoute component={Terms} />} />
          <Route path="/how-it-works" component={() => <LazyRoute component={HowItWorks} />} />
          <Route path="/developers" component={() => <LazyRoute component={Developers} />} />
          <Route path="/premium" component={() => <LazyRoute component={Premium} />} />
          <Route path="/about" component={() => <LazyRoute component={About} />} />
          <Route path="/contact" component={() => <LazyRoute component={Contact} />} />
          <Route path="/blog" component={() => <LazyRoute component={Blog} />} />
          <Route path="/blog/:slug" component={() => <LazyRoute component={BlogPost} />} />
          {/* /admin is protected by Cloudflare Access in production; the ADMIN_TOKEN login is a second factor */}
          <Route path="/admin" component={() => <LazyRoute component={AdminDashboard} />} />
          {showInternalRoutes ? (
            <>
              <Route path="/admin/blog" component={() => <LazyRoute component={BlogAdmin} />} />
              <Route path="/admin/analytics" component={() => <LazyRoute component={Analytics} />} />
              <Route path="/admin/audit-logs" component={() => <LazyRoute component={AuditLogs} />} />
              <Route path="/test-llm" component={() => <LazyRoute component={TestClientLLM} />} />
              <Route path="/llm-ui" component={() => <LazyRoute component={LlmUi} />} />
            </>
          ) : null}
          <Route path="/auth">
            <Redirect to="/auth/sign-in" />
          </Route>
          <Route path="/auth/sign-in" component={() => <LazyRoute component={AuthSignIn} />} />
          <Route path="/auth/sign-up" component={() => <LazyRoute component={AuthSignUp} />} />
          <Route path="/auth/magic" component={() => <LazyRoute component={AuthMagic} />} />
          <Route path="/magic" component={() => <LazyRoute component={AuthMagic} />} />
          <Route path="/auth/recovery" component={() => <LazyRoute component={AuthRecovery} />} />
          <Route path="/auth/email-change" component={() => <LazyRoute component={AuthEmailChange} />} />
          <Route path="/auth/totp" component={() => <LazyRoute component={AuthTotp} />} />
          <Route path="/account/security" component={() => <LazyRoute component={SecuritySettings} />} />
          <Route path="/account/activity" component={() => <LazyRoute component={AccountActivity} />} />
          <Route path="/account/notifications" component={() => <LazyRoute component={NotificationCenter} />} />
          <Route path="/account/preferences" component={() => <LazyRoute component={AccountPreferences} />} />
          <Route path="/account" component={() => <LazyRoute component={AccountOverview} />} />
          <Route component={() => <LazyRoute component={NotFound} />} />
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
          <DeferredToaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
