import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
import NotFound from "@/pages/not-found";
import SecurityGuideDetail from "./pages/SecurityGuideDetail";
import TestClientLLM from "@/pages/TestClientLLM";
import Auth from "@/pages/Auth";
import AuthMagic from "@/pages/AuthMagic";
import AuthBackup from "@/pages/AuthBackup";
import AuthRecovery from "@/pages/AuthRecovery";
import SecuritySettings from "@/pages/SecuritySettings";
import LlmUi from "@/pages/LlmUi";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
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
          <Route path="/test-llm" component={TestClientLLM} />
          <Route path="/llm-ui" component={LlmUi} />
          <Route path="/auth" component={Auth} />
          <Route path="/auth/magic" component={AuthMagic} />
          <Route path="/auth/backup" component={AuthBackup} />
          <Route path="/auth/recovery" component={AuthRecovery} />
          <Route path="/account/security" component={SecuritySettings} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
