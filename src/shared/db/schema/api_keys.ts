import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { projectMembers } from "./project_members";

/**
 * api_keys
 *
 * هر کلید متعلق به یک project_member است (نه مستقیم به project).
 * دسترسی به environment ها از روی همان member خوانده می‌شود (projectMembers.environmentIds) —
 * یعنی این جدول خودش فیلد environment ندارد، چون چند environment ممکن است
 * و آن منبع حقیقت روی member نشسته، نه روی هر کلید جدا.
 *
 * یک member می‌تواند چند کلید فعال داشته باشد (مثلاً از چند دستگاه/CI).
 * با حذف member، همه‌ی کلیدهایش revoke می‌شوند (revokedAt پر می‌شود) — تاریخچه می‌ماند.
 */
export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),

  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  memberId: text("member_id")
    .notNull()
    .references(() => projectMembers.id, { onDelete: "cascade" }),

  // فقط هش کلید را ذخیره می‌کنیم؛ خود کلید فقط یک‌بار، لحظه‌ی ساخت، به کاربر نمایش داده می‌شود.
  keyHash: text("key_hash").notNull().unique(),

  // برای نمایش در UI بدون لو دادن کل کلید، مثل: evb_sk_xK9m...
  keyPreview: text("key_preview").notNull(),

  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
