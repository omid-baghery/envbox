import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { environments } from "./environments";
import { projects } from "./projects";

export const variables = pgTable("variables", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  encryptedValue: text("encrypted_value").notNull(),
  environmentId: text("environment_id")
    .notNull()
    .references(() => environments.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
