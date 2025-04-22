export interface User {
  id: number;
  username: string;
  email: string;
  password: string; 
  display_name: string;
  role: 'parent' | 'child';
  parentId?: number | null;
  createdAt?: string;
}
