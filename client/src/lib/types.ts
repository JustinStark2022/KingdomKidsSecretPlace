// client/src/lib/types.ts

import { User } from "@/types/user";
import { ScriptureProgress } from "@/types/scripture";
import { BibleLesson, UserLessonProgress } from "@/types/lesson";
import { PrayerJournal } from "@/types/user"; // if needed

// Dashboard Summary (Parent View)
export interface DashboardSummary {
  pendingAlerts: number;
  scriptureProgressPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  prayerEntries: number;
  childUsers: User[];
}

// Child Dashboard Overview
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

// Bible Version
export interface BibleVersion {
  id: string;
  name: string;
  description: string;
}

// Bible Book Info
export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
}

// Bible Chapter Content
export interface BibleChapter {
  book: string;
  chapter: number;
  verses: {
    verse: number;
    text: string;
  }[];
}

// Bible Search
export interface BibleSearchResult {
  reference: string;
  text: string;
}

// Devotional
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