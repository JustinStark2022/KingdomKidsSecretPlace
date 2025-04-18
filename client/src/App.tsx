// client/src/App.tsx
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Bible from "./pages/Bible";
import Prayer from "./pages/Prayer";
import Devotionals from "./pages/Devotionals";
import Lessons from "./pages/Lessons";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "@/pages/not-found";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* Everything else uses layout */}
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/support" component={Support} />

              {/* ✅ Protected Pages */}
              <Route path="/dashboard">
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/bible">
                <ProtectedRoute>
                  <Bible />
                </ProtectedRoute>
              </Route>
              <Route path="/prayer">
                <ProtectedRoute>
                  <Prayer />
                </ProtectedRoute>
              </Route>
              <Route path="/devotionals">
                <ProtectedRoute>
                  <Devotionals />
                </ProtectedRoute>
              </Route>
              <Route path="/lessons">
                <ProtectedRoute>
                  <Lessons />
                </ProtectedRoute>
              </Route>
              <Route path="/settings">
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </Route>

              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
      <Toaster />
    </UserProvider>
  );
}

export default App;
