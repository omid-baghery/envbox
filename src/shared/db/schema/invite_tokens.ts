import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { projectMembers } from "./project_members";
import { projects } from "./projects";

/**
 * invite_tokens
 *
 * یک token کوتاه که مدیر تولید می‌کند و به صورت `npx envbox join <token>` به دولوپر می‌دهد.
 *
 * - یک‌بارمصرف: وقتی استفاده شد، usedAt پر می‌شود و دیگر هیچ‌وقت دوباره قابل قبول نیست —
 *   حتی اگر هنوز expire نشده باشد. اگر همان کاربر از دستگاه دوم بخواهد join بزند،
 *   باید مدیر یک invite جدید بسازد (که یک ردیف project_members از قبل دارد، پس
 *   فقط یک api_key دیگر برای همان عضو ساخته می‌شود — نیازی به ساخت member تازه نیست).
 *
 * - token خام (plaintext) فقط لحظه‌ی ساخت نمایش داده می‌شود؛ همان چیزی که در دیتابیس
 *   ذخیره می‌شود می‌تواند هش شده باشد (tokenHash) تا اگر دیتابیس لو رفت، توکن‌های
 *   فعال/استفاده‌نشده مستقیماً قابل استفاده نباشند.
 */
export const inviteTokens = pgTable("invite_tokens", {
  id: text("id").primaryKey(),

  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  memberId: text("member_id")
    .notNull()
    .references(() => projectMembers.id, { onDelete: "cascade" }),

  tokenHash: text("token_hash").notNull().unique(),

  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
