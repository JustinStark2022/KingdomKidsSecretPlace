import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Logo from "../ui/logo";

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, user, error: loginError } = await login({ username, password });

    if (!success || !user) {
      const message = loginError instanceof Error ? loginError.message : "Please check your username and password.";
      setError("Invalid credentials");
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive"
      });
      return;
    }

    toast({ title: `Welcome back, ${user.displayName || user.username}!` });

    // ✅ Role-based routing
    switch (user.role) {
      case "parent":
        setLocation("/dashboard");
        break;
      case "child":
        setLocation("/child-dashboard");
        break;
      default:
        setLocation("/");
        break;
    }
  };

  return (
    <Card className="w-full max-w-md bg-card shadow-lg">
      <CardContent className="pt-6 px-8 pb-8">
        <div className="flex flex-col items-center mb-6">
          <Logo size="large" />
          <p className="text-center text-muted-foreground mt-6 mb-2 font-serif italic">
            "Jesus said, 'Let the little children come to me'" – Matthew 19:14
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="pl-10"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="pl-10"
                autoComplete="current-password" // ✅ Added this
                required
              />
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => setLocation("/signup")}>
              Sign up
            </Button>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Teaching children about Jesus Christ, <br />
          the Way, the Truth, and the Life
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

