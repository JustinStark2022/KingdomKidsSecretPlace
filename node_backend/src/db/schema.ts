import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
  } from "drizzle-orm/pg-core";
  
  // src/db/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  display_name: varchar("display_name", { length: 255 }).notNull(),
  role: text("role").default("child").notNull(),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
});

  
  export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    verseRef: varchar("verse_ref", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  export const lessonProgress = pgTable("lesson_progress", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    lessonId: integer("lesson_id").notNull(),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at"),
  });
  
  export const screenTime = pgTable("screen_time", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    usedTimeMinutes: integer("used_time").default(0),
    allowedTimeMinutes: integer("allowed_time").default(120),
    additionalRewardMinutes: integer("rewards").default(0),
  });
  
  export const alerts = pgTable("alerts", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    message: text("message").notNull(),
    flagReason: text("flag_reason").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  export const games = pgTable("games", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    platform: text("platform").notNull(),
    contentType: text("content_type").notNull(),
    flagReason: text("flag_reason"),
    userId: integer("user_id"),
  });
  