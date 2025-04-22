import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { RegisterFormData } from "@/types/schema";
import { User as SelectUser } from "@/types/user";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Types
export type ChildFormData = Omit<RegisterFormData, "confirmPassword">;
export type ExtendedInsertUser = RegisterFormData;

type LoginData = Pick<ExtendedInsertUser, "username" | "password">;

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, ExtendedInsertUser>;
  createChildMutation: UseMutationResult<SelectUser, Error, ChildFormData>;
};

// Context

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });
    },
    onError: (err) => {
      toast({
        title: "Login failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: ExtendedInsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Account created",
        description: `Welcome to Kingdom Kids, ${user.firstName}!`,
      });
    },
    onError: (err) => {
      toast({
        title: "Registration failed",
        description: err.message || "Could not register account",
        variant: "destructive",
      });
    },
  });

  const createChildMutation = useMutation({
    mutationFn: async (data: ChildFormData) => {
      const res = await apiRequest("POST", "/api/users/child", data);
      return await res.json();
    },
    onSuccess: (child) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/children"] });
      toast({
        title: "Child Account Created",
        description: `Account for ${child.firstName} was successfully created.`,
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to Create Child",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been signed out.",
      });
    },
    onError: (err) => {
      toast({
        title: "Logout failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        createChildMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


