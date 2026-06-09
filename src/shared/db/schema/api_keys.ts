import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
