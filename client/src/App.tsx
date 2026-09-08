import { Switch, Route, useLocation, Redirect } from "wouter";
import {
  Component,
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
import { AccountEntitlementsProvider } from "@/context/AccountEntitlementsContext";
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
import { marketingHreflangAlternatesForRoute } from "@shared/localizedMarketingHreflang";
import { setDocumentMeta } from "@/utils/documentMeta";
import { resolveDocumentMeta } from "@/utils/resolveDocumentMeta";
import { normalizeMarketingPathname } from "@shared/publicMarketingPaths";
import { canAccessInternalAppRoutes } from "@/utils/internalAppRoutes";
import { PREMIUM_PAGE_PUBLIC } from "@shared/premiumPagePublic";
import { NativePageAnalytics } from "@/components/NativePageAnalytics";

const ViewNote = lazy(() => import("@/pages/ViewNote"));
const PasswordGenerator = lazy(() => import("@/pages/PasswordGenerator"));
const SecureFileTransfer = lazy(() => import("@/pages/SecureFileTransfer"));
const SecurityResources = lazy(() => import("@/pages/SecurityResources"));
const PrivacyTools = lazy(() => import("@/pages/PrivacyTools"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Developers = lazy(() => import("@/pages/Developers"));
const DeveloperIntegrationDetail = lazy(() => import("@/pages/DeveloperIntegrationDetail"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogCategory = lazy(() => import("@/pages/BlogCategory"));
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
const AccountPreferences = lazy(() => import("@/pages/account/AccountPreferences"));
const Premium = lazy(() => import("@/pages/Premium"));
const BlogAdmin = lazy(() => import("@/pages/BlogAdmin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const AuditLogs = lazy(() => import("@/pages/AuditLogs"));
const TestClientLLM = lazy(() => import("@/pages/TestClientLLM"));
const LlmUi = lazy(() => import("@/pages/LlmUi"));

const NON_ENGLISH_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (language): language is Exclude<SupportedLanguage, "en"> => language !== "en",
);

/**
 * Fill the viewport under the fixed navbar so the footer stays below the fold
 * while a lazy route chunk loads (avoids a footer flash on first paint).
 */
function LazyRouteFallback() {
  return (
    <div
      className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LazyRouteFallback />}>{children}</Suspense>;
}

type LazyRouteErrorBoundaryState = { error: Error | null };

const LAZY_CHUNK_RELOAD_KEY = "pn:lazy-chunk-reload-at";

function isLikelyStaleChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Loading chunk [\d]+ failed/i.test(
    message,
  );
}

function reloadOnceForStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(LAZY_CHUNK_RELOAD_KEY) || "0");
    if (Number.isFinite(last) && Date.now() - last < 15_000) return false;
    sessionStorage.setItem(LAZY_CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    /* private mode / quota */
  }
  window.location.reload();
  return true;
}

class LazyRouteErrorBoundary extends Component<
  { children: ReactNode },
  LazyRouteErrorBoundaryState
> {
  state: LazyRouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): LazyRouteErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (isLikelyStaleChunkLoadError(error)) {
      reloadOnceForStaleChunk();
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-base font-medium text-foreground">This page failed to load.</p>
          <p className="text-sm text-muted-foreground">
            {isLikelyStaleChunkLoadError(this.state.error)
              ? "A newer deploy may have replaced this page’s scripts. Reloading usually fixes it."
              : "Check your connection, then try again."}
          </p>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LazyRoute({ component: Page }: { component: ComponentType }) {
  return (
    <LazyRouteErrorBoundary>
      <LazyPage>
        <Page />
      </LazyPage>
    </LazyRouteErrorBoundary>
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

function removeLocalizedMarketingSeoLinks() {
  document.head
    .querySelectorAll<HTMLLinkElement>('link[data-privatenote-localized-marketing="true"]')
    .forEach((link) => link.remove());
}

function setLocalizedMarketingSeoLinks(pathname: string) {
  removeLocalizedMarketingSeoLinks();
  const alternates = marketingHreflangAlternatesForRoute(pathname);
  if (!alternates) return;

  alternates.forEach((alternate) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = alternate.hrefLang;
    link.href = absolutePublicUrl(alternate.path);
    link.dataset.privatenoteLocalizedMarketing = "true";
    document.head.appendChild(link);
  });
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
      canonicalPath: onLocaleHome
        ? canonicalPathForHomeLanguage(homeLanguageFromRoute(path) as SupportedLanguage)
        : normalizeMarketingPathname(path),
    });
    if (onLocaleHome) {
      setHomeSeoLinks(homeLanguageFromRoute(path) as SupportedLanguage);
      removeLocalizedMarketingSeoLinks();
    } else {
      removeHomeLocaleSeoLinks();
      setLocalizedMarketingSeoLinks(path);
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
    <div className="flex min-h-screen min-w-0 flex-col">
      {showNavbar && <Navbar />}
      <main className={`min-w-0 flex-grow ${isAuthRoute ? "pt-6" : "pt-16"}`}>
        <Switch>
          <Route path="/" component={() => <HomeRoute />} />
          {/*
            One route per locale home. Wouter ignores trailing slashes, so a
            separate `/de` → `/de/` Redirect would match `/de/` first and render
            an empty page (navbar/footer only). Server/prerender still canonicalize to `/de/`.
          */}
          {NON_ENGLISH_LANGUAGES.map((language) => (
            <Route
              key={`${language}-home`}
              path={`/${language}`}
              component={() => <HomeRoute language={language} />}
            />
          ))}
          {NON_ENGLISH_LANGUAGES.map((language) => (
            <Fragment key={language}>
              <Route path={`/${language}/password-generator`} component={() => <LocalizedRoute language={language} component={PasswordGenerator} />} />
              <Route path={`/${language}/secure-file-transfer`} component={() => <LocalizedRoute language={language} component={SecureFileTransfer} />} />
              <Route path={`/${language}/privacy-tools`} component={() => <LocalizedRoute language={language} component={PrivacyTools} />} />
              <Route path={`/${language}/security-resources`} component={() => <LocalizedRoute language={language} component={SecurityResources} />} />
              <Route path={`/${language}/how-it-works`} component={() => <LocalizedRoute language={language} component={HowItWorks} />} />
              {PREMIUM_PAGE_PUBLIC ? (
                <Route path={`/${language}/premium`} component={() => <LocalizedRoute language={language} component={Premium} />} />
              ) : (
                <Route path={`/${language}/premium`}>
                  <Redirect to={`/${language}/`} />
                </Route>
              )}
              <Route path={`/${language}/developers/:integrationId`} component={() => <LocalizedRoute language={language} component={DeveloperIntegrationDetail} />} />
              <Route path={`/${language}/developers`} component={() => <LocalizedRoute language={language} component={Developers} />} />
              <Route path={`/${language}/about`} component={() => <LocalizedRoute language={language} component={About} />} />
              <Route path={`/${language}/contact`} component={() => <LocalizedRoute language={language} component={Contact} />} />
              <Route path={`/${language}/blog/category/:category`} component={() => <LocalizedRoute language={language} component={BlogCategory} />} />
              <Route path={`/${language}/blog/:slug`} component={() => <LocalizedRoute language={language} component={BlogPost} />} />
              <Route path={`/${language}/blog`} component={() => <LocalizedRoute language={language} component={Blog} />} />
              <Route path={`/${language}/privacy`} component={() => <LocalizedRoute language={language} component={Privacy} />} />
              <Route path={`/${language}/terms`} component={() => <LocalizedRoute language={language} component={Terms} />} />
              <Route path={`/${language}/security-guides/:topicId`} component={() => <LocalizedRoute language={language} component={SecurityGuideDetail} />} />
            </Fragment>
          ))}
          <Route path="/note/:id" component={() => <LazyRoute component={ViewNote} />} />
          <Route path="/password-generator" component={() => <LazyRoute component={PasswordGenerator} />} />
          <Route path="/secure-file-transfer" component={() => <LazyRoute component={SecureFileTransfer} />} />
          <Route path="/privacy-tools" component={() => <LazyRoute component={PrivacyTools} />} />
          <Route path="/security-resources" component={() => <LazyRoute component={SecurityResources} />} />
          <Route path="/security-guides/:topicId" component={() => <LazyRoute component={SecurityGuideDetail} />} />
          <Route path="/privacy" component={() => <LazyRoute component={Privacy} />} />
          <Route path="/terms" component={() => <LazyRoute component={Terms} />} />
          <Route path="/how-it-works" component={() => <LazyRoute component={HowItWorks} />} />
          {PREMIUM_PAGE_PUBLIC ? (
            <Route path="/premium" component={() => <LazyRoute component={Premium} />} />
          ) : (
            <Route path="/premium">
              <Redirect to="/" />
            </Route>
          )}
          <Route path="/developers/:integrationId" component={() => <LazyRoute component={DeveloperIntegrationDetail} />} />
          <Route path="/developers" component={() => <LazyRoute component={Developers} />} />
          <Route path="/about" component={() => <LazyRoute component={About} />} />
          <Route path="/contact" component={() => <LazyRoute component={Contact} />} />
          <Route path="/blog" component={() => <LazyRoute component={Blog} />} />
          <Route path="/blog/category/:category" component={() => <LazyRoute component={BlogCategory} />} />
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
          {/* Specific /auth/* routes before /auth redirect so sign-in never matches empty. */}
          <Route path="/auth/sign-in" component={() => <LazyRoute component={AuthSignIn} />} />
          <Route path="/auth/sign-up" component={() => <LazyRoute component={AuthSignUp} />} />
          <Route path="/auth/magic" component={() => <LazyRoute component={AuthMagic} />} />
          <Route path="/magic" component={() => <LazyRoute component={AuthMagic} />} />
          <Route path="/auth/recovery" component={() => <LazyRoute component={AuthRecovery} />} />
          <Route path="/auth/email-change" component={() => <LazyRoute component={AuthEmailChange} />} />
          <Route path="/auth/totp" component={() => <LazyRoute component={AuthTotp} />} />
          <Route path="/auth">
            <Redirect to="/auth/sign-in" />
          </Route>
          <Route path="/account/security" component={() => <LazyRoute component={SecuritySettings} />} />
          <Route path="/account/activity" component={() => <LazyRoute component={AccountActivity} />} />
          <Route path="/account/notifications">
            <Redirect to="/account/activity" />
          </Route>
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
          <AccountEntitlementsProvider>
            <ThemePreferenceRoot />
            <Router />
            <NativePageAnalytics />
            <DeferredToaster />
          </AccountEntitlementsProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
