import { QueryClient, QueryFunction } from "@tanstack/react-query";

// ✅ Throw errors for non-OK responses
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// ✅ Helper to attach Authorization + Content-Type
function getAuthHeaders(data?: unknown) {
  const token = localStorage.getItem("token");

  return {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ✅ For POST, PUT, DELETE requests
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(data),
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// ✅ For useQuery hook with token support
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null as unknown as T;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// ✅ Shared Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
