// src/db/schema.ts
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  time,
  boolean,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

// ─── Users ──────────────────────────────────────────────────────────────────────
export const users: any = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  display_name: varchar("display_name", { length: 255 }).notNull(),
  role: text("role").notNull().default("child"), // "parent" or "child"
  parent_id: integer("parent_id")
    .references(() => users.id, { onDelete: "cascade" }),
  first_name: varchar("first_name", { length: 255 }).notNull().default(""),
  last_name: varchar("last_name", { length: 255 }).notNull().default(""),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─── Lessons ───────────────────────────────────────────────────────────────────
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  verse_ref: varchar("verse_ref", { length: 255 }).notNull(),
  content: text("content").notNull(),
  age_range: varchar("age_range", { length: 50 }).notNull(),
  scripture_references: text("scripture_references").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─── Lesson Progress ───────────────────────────────────────────────────────────
export const lesson_progress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lesson_id: integer("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  completed_at: timestamp("completed_at"),
});

// ─── Screen Time ───────────────────────────────────────────────────────────────
export const screen_time = pgTable("screen_time", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  daily_limits_total: integer("daily_limits_total").notNull(),
  daily_limits_gaming: integer("daily_limits_gaming").notNull(),
  daily_limits_social: integer("daily_limits_social").notNull(),
  daily_limits_educational: integer("daily_limits_educational").notNull(),
  usage_today_total: integer("usage_today_total").notNull(),
  usage_today_gaming: integer("usage_today_gaming").notNull(),
  usage_today_social: integer("usage_today_social").notNull(),
  usage_today_educational: integer("usage_today_educational").notNull(),
  time_rewards_scripture: integer("time_rewards_scripture").notNull(),
  time_rewards_lessons: integer("time_rewards_lessons").notNull(),
  time_rewards_chores: integer("time_rewards_chores").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─── Schedules ─────────────────────────────────────────────────────────────────
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  day_of_week: varchar("day_of_week", { length: 10 }).notNull(),
  start_time: time("start_time").notNull(),
  end_time: time("end_time").notNull(),
  enabled: boolean("enabled").notNull().default(true),
});

// ─── Blocked Apps ─────────────────────────────────────────────────────────────
export const blocked_apps = pgTable("blocked_apps", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  category: text("category").notNull(), // e.g. "gaming", "social", etc.
  blocked: boolean("blocked").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─── Devotionals ───────────────────────────────────────────────────────────────
export const devotionals = pgTable("devotionals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  verse: text("verse").notNull(),
  reference: varchar("reference", { length: 255 }).notNull(),
  content: text("content").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  image: text("image"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─── Games ───────────────────────────────────────────────────────────────────
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  flagged: boolean("flagged").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type User = InferModel<typeof users>;

export type NewUser = InferModel<typeof users, "insert">;