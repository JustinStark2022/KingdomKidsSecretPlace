export interface User {
  id: number; // updated from string to number for consistency
  username: string;
  displayName: string;
  role: "parent" | "child";
  createdAt: string;
}