export interface User {
  id: number;
  username: string;
  role: "parent" | "child";
  displayName?: string;
  email?: string; // ✅ Add this line
  isParent?: boolean;
  parentId?: number | null;
  createdAt?: string;
}
