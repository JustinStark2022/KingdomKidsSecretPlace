// node_backend/src/shared/relations.ts
import { relations } from 'drizzle-orm';
import { users } from './schema';

export const userRelations = relations(users, ({ one, many }) => ({
  parent: one(users, {
    fields: [users.parent_id], // ✅ match schema exactly
    references: [users.id],
  }),
  children: many(users, {
    relationName: 'UserToChildren',
  }),
}));