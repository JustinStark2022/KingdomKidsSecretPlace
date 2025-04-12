// @/types/screenTime.ts
import { User } from "@/types/user";

export interface ScreenTimeData {
  user: User;
  dailyLimits: {
    total: number;
    gaming: number;
    social: number;
    educational: number;
  };
  usageToday: {
    total: number;
    gaming: number;
    social: number;
    educational: number;
  };
  timeRewards: {
    fromScripture: number;
    fromLessons: number;
    fromChores: number;
  };
  schedule: {
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    enabled: boolean;
  }[];
  blockedApps: {
    id: number;
    name: string;
    category: "gaming" | "social" | "educational" | "entertainment" | "other";
    blocked: boolean;
  }[];
}