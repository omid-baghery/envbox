import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { user } from "./auth";

/**
 * project_members
 *
 * هر ردیف یعنی یک نفر (owner یا member) به یک پروژه دسترسی دارد.
 * - owner هم یک ردیف اینجا دارد (role: "owner") با دسترسی به همه environment ها.
 * - برای member های pending (هنوز دعوت رو قبول نکردن) userId خالیه و فقط email پر شده.
 *   وقتی developer دستور join رو زد و token معتبر بود، userId ست می‌شه و status فعال می‌شه.
 *
 * environmentIds: لیست id های environment که این عضو بهشون دسترسی دارد.
 * این لیست موقع invite تعیین می‌شه و برای کل عمر عضو ثابت می‌مونه — هر api_key
 * بعدی که از این عضو ساخته می‌شه (مثلاً از یک دستگاه دوم) همین دسترسی رو به ارث می‌بره.
 */
export const projectMembers = pgTable("project_members", {
  id: text("id").primaryKey(),

  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  // وقتی هنوز دعوت قبول نشده، این فیلد null است.
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),

  // برای ردیابی دعوت قبل از پیوستن کاربر (و نمایش "ali@dev.io" در لیست pending).
  inviteEmail: text("invite_email"),

  role: text("role", { enum: ["owner", "member"] })
    .notNull()
    .default("member"),

  // لیست id های environment که این عضو به آن‌ها دسترسی دارد.
  environmentIds: jsonb("environment_ids").$type<string[]>().notNull().default([]),

  status: text("status", { enum: ["pending", "active", "removed"] })
    .notNull()
    .default("pending"),

  lastPullAt: timestamp("last_pull_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
