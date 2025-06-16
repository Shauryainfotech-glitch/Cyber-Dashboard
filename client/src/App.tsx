import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";

// Import components using relative paths with proper folder structure
import Login from "./pages/Login/login";
import Dashboard from "./pages/Dashboard/dashboard";
import Landing from "./pages/Landing/landing";
import CaseManagement from "./pages/CaseManagement/case-management";
import AITools from "./pages/AiTools/ai-tools";
import EnhancedAITools from "./pages/EnhanchedAiTools/enhanced-ai-tools";
import EvidenceAnalysis from "./pages/EvidenceAnalysis/evidence-analysis";
import VictimSupport from "./pages/VictimSupport/victim-support";
import SecuritySettings from "./pages/Security/security-settings";
import MasterConfig from "./pages/MasterConf/master-config";
import SystemMonitoring from "./pages/SystemMonitoring/system-monitoring";
import NotFound from "./pages/NotFound/not-found";

// Protected route component to handle authentication
function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={props => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/case-management" component={props => <ProtectedRoute component={CaseManagement} {...props} />} />
      <Route path="/ai-tools" component={props => <ProtectedRoute component={EnhancedAITools} {...props} />} />
      <Route path="/evidence-analysis" component={props => <ProtectedRoute component={EvidenceAnalysis} {...props} />} />
      <Route path="/victim-support" component={props => <ProtectedRoute component={VictimSupport} {...props} />} />
      <Route path="/security-settings" component={props => <ProtectedRoute component={SecuritySettings} {...props} />} />
      <Route path="/master-config" component={props => <ProtectedRoute component={MasterConfig} {...props} />} />
      <Route path="/system-monitoring" component={props => <ProtectedRoute component={SystemMonitoring} {...props} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
