import { User, ScriptureProgress, BibleLesson, UserLessonProgress, PrayerJournal } from "@shared/schema";

// Dashboard types
export interface DashboardSummary {
  pendingAlerts: number;
  scriptureProgressPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  prayerEntries: number;
  childUsers: User[];
}

export interface ChildDashboardData {
  user: User;
  scriptureProgress: ScriptureProgress[];
  recentLessons: BibleLesson[];
  dailyDevotional: {
    title: string;
    verse: string;
    content: string;
  };
  gameTime: {
    earned: number;
    available: number;
    total: number;
  };
}

// Bible and Scripture types
export interface BibleVersion {
  id: string;
  name: string;
  description: string;
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: {
    verse: number;
    text: string;
  }[];
}

export interface BibleSearchResult {
  reference: string;
  text: string;
}

// Devotional types
export interface Devotional {
  id: number;
  title: string;
  verse: string;
  reference: string;
  content: string;
  date: string;
  image?: string;
  tags: string[];
}

// Monitoring types
export interface ChatLog {
  id: number;
  childId: number;
  childName: string;
  platform: string;
  content: string;
  flagged: boolean;
  flagReason?: string;
  timestamp: string;
  participants: string[];
}

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
    category: string;
    blocked: boolean;
  }[];
}
