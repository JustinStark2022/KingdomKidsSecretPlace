import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ParentDashboard from "@/pages/parent-dashboard";
import ChildDashboard from "@/pages/child-dashboard";
import BibleReader from "@/pages/bible-reader";
import Lessons from "@/pages/lessons";
import Settings from "@/pages/settings";
import Support from "@/pages/support";
import ContentMonitoring from "@/pages/content-monitoring";
import ScreenTime from "@/pages/screen-time";
import LocationTracking from "@/pages/location-tracking";
import ChildAccounts from "@/pages/child-accounts";
import { ProtectedRoute }  from "@/lib/protected-route";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/auth">
        {user ? (
          user.role === "parent" ? <Redirect to="/dashboard" /> : <Redirect to="/child-dashboard" />
        ) : (
          <AuthPage />
        )}
      </Route>

      <ProtectedRoute path="/" component={() => <Redirect to="/dashboard" />} />
      <ProtectedRoute path="/dashboard" component={ParentDashboard} requireParent />
      <ProtectedRoute path="/children" component={ChildAccounts} requireParent />
      <ProtectedRoute path="/screentime" component={ScreenTime} requireParent />
      <ProtectedRoute path="/monitoring" component={ContentMonitoring} requireParent />
      <ProtectedRoute path="/location" component={LocationTracking} requireParent />
      <ProtectedRoute path="/settings" component={Settings} requireParent />

      <ProtectedRoute path="/bible" component={BibleReader} />
      <ProtectedRoute path="/lessons" component={Lessons} />
      <ProtectedRoute path="/support" component={Support} />

      <ProtectedRoute path="/child-dashboard" component={ChildDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function Redirect({ to }: { to: string }) {
  window.location.href = to;
  return null;
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
