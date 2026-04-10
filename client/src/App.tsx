import { Switch, Route, useLocation } from "wouter";
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

function Router() {
  const [location] = useLocation();
  const isAuthRoute = location.startsWith("/auth") || location === "/magic";
  const showNavbar =
    !isAuthRoute ||
    location.startsWith("/auth/magic") ||
    location === "/magic" ||
    location.startsWith("/auth/email-change") ||
    location.startsWith("/auth/totp");

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className={`flex-grow ${isAuthRoute ? "pt-6" : "pt-16"}`}>
        <Switch>
          <Route path="/" component={Home} />
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
      <AuthProvider>
        <ThemePreferenceRoot />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
