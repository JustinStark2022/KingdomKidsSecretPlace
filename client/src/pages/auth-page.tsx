import React, { useState } from "react";
import { login } from "@/api/user";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import Logo from "@/components/ui/logo";

export default function AuthPage() {
  const { setUser } = useAuth();
  const [, navigate] = useLocation();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    display_name: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      try {
        const user = await login(form.username, form.password);
        if (user.token) {
          localStorage.setItem("token", user.token);
        }
        setUser(user);
        navigate(user.role === "parent" ? "/dashboard" : "/child-dashboard");
      } catch (err: any) {
        setError(err.message || "Login failed");
      }
    } else {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...form, role: "parent" }),
        });

        if (!response.ok) throw new Error("Registration failed");
        const user = await response.json();
        if (user.token) {
          localStorage.setItem("token", user.token);
        }
        setUser(user);
        navigate("/dashboard");
      } catch (err: any) {
        setError(err.message || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-poppins">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl border-0"> {/* Increased max-w-xl */}
        <CardContent className="py-14 px-10 space-y-8"> {/* More padding */}
          <div className="w-full flex justify-center items-center">
            <div className="w-48 h-48 flex items-center justify-center"> {/* Larger container */}
              <Logo />
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center justify-center bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-primary shadow"
                  : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white text-primary shadow"
                  : "text-muted-foreground"
              }`}
            >
              Register
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input name="first_name" value={form.first_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input name="last_name" value={form.last_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input name="display_name" value={form.display_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input name="username" value={form.username} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="text-right">
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="w-full text-white">
              {mode === "login" ? "Sign In" : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}