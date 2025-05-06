export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  display_name: string;
  role: string;
  parent_id?: number | null;
  first_name: string;
  last_name: string;
  created_at?: string;
}

export interface Child extends User {
  parent_id: number;
  screenTime?: {
    usage_today_total: number;
    daily_limits_total: number;
    [key: string]: any;
  } | null;
  totalLessons?: number;
  completedLessons?: number;
}
