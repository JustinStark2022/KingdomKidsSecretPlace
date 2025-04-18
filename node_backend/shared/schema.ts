// node_backend/shared/schema.ts
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull(), // 'parent' or 'child'
  isParent: boolean('is_parent').default(false),
  parentId: integer('parent_id').references(() => users.id), // 👈 NEW LINE
  createdAt: timestamp('created_at').defaultNow()
});
