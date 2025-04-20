// node_backend/src/shared/schema.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull(),
  isParent: boolean('is_parent').default(false),
  parent_id: integer('parent_id'), 
  createdAt: timestamp('created_at').defaultNow(),
});
