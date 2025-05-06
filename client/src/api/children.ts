import { Child } from "@/types/user";

// ✅ Fetch the list of children
export const fetchChildren = async (): Promise<Child[]> => {
  const res = await fetch("/api/user/children", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch children");
  }

  return res.json();
};

// ✅ Create a new child account
export const createChild = async (childData: {
  username: string;
  password: string;
  display_name: string;
  first_name: string;
  last_name: string;
}): Promise<Child> => {
  const response = await fetch("/api/user/child", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(childData),
  });

  if (!response.ok) {
    throw new Error("Failed to create child");
  }

  return response.json();
};
