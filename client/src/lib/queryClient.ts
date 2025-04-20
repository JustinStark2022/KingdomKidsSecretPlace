// ✅ Imports
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// ✅ Read from .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Throw detailed error if response not OK
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    const errorBody = contentType?.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);

    const message =
      typeof errorBody === "string"
        ? errorBody
        : errorBody?.message || res.statusText;

    throw new Error(`${res.status}: ${message}`);
  }
}

// ✅ Attach Authorization + Content-Type dynamically
function getAuthHeaders(data?: unknown) {
  const token = localStorage.getItem("token");

  return {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ✅ Generic API request wrapper
export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: getAuthHeaders(data),
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Needed only if using cookies (safe to leave)
  });

  await throwIfResNotOk(res);
  return await res.json();
}

// ✅ React Query integration — GETs with optional 401 handling
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    const res = await fetch(`${API_BASE_URL}${queryKey[0] as string}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null as unknown as T;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// ✅ Initialize Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
    mutations: {
      retry: false,
    },
  },
});
