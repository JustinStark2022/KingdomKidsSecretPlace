import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { login } from "@/api/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AuthPage: React.FC = () => {
  const { setUser } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      setUser(user);
      navigate(user.role === "parent" ? "/dashboard" : "/child-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-16">
      <CardContent className="p-6">
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthPage;
