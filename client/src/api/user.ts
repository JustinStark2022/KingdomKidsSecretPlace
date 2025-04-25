import { User } from "@/types/user";

export const testAuthApi = () => "API is connected";
export async function getMe(): Promise<User> {
  
  const res = await fetch("/api/user", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}
export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  display_name: string;
  role: string;
  parent_id?: number | null;
  first_name: string;
  last_name: string;
  created_at?: string;
  token?: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    credentials: "include", // makes sure cookies (JWT) are sent/received
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  return response.json();
}