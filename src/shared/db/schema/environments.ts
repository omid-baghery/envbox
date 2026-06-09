import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const environments = pgTable("environments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // "development", "staging", "production"
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
