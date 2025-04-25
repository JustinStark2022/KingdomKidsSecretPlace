// src/db/schema.ts
import { pgTable, serial, varchar, text, boolean, integer, timestamp, } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    displayName: text("display_name").notNull(),
    role: text("role").notNull(), // "parent" | "child"
    isParent: boolean("is_parent").default(false),
    parentId: integer("parent_id"),
    firstName: text("first_name").notNull().default(""),
    lastName: text("last_name").notNull().default(""),
    createdAt: timestamp("created_at").defaultNow(),
});
