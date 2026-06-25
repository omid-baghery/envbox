import "server-only";

import { db } from "@/shared/db";
import { projects, projectMembers } from "@/shared/db/schema";
import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * سشن کاربر فعلی را برمی‌گرداند یا خطا می‌دهد.
 * هر server action که نیاز به کاربر لاگین‌شده دارد باید این را اول صدا بزند.
 */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new UnauthorizedError("Not signed in");
  return session;
}

/**
 * چک می‌کند کاربر فعلی واقعاً عضو فعال (یا owner) پروژه‌ی مشخص‌شده است.
 * این تابع باید قبل از هر عملیات روی یک projectId خاص صدا زده شود —
 * نباید فقط به "کاربر لاگین کرده" اکتفا کرد، چون لاگین بودن یعنی هیچ.
 *
 * @returns ردیف project_members مربوط به همین کاربر در همین پروژه
 */
export async function requireProjectMember(projectId: string) {
  const session = await requireSession();

  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, session.user.id),
        eq(projectMembers.status, "active"),
      ),
    )
    .limit(1);

  if (!membership) {
    throw new UnauthorizedError("You don't have access to this project");
  }

  return { session, membership };
}

/**
 * مثل requireProjectMember اما فقط owner را قبول می‌کند — برای عملیات مدیریتی
 * مثل invite، revoke، rename، delete که فقط مدیر پروژه باید بتواند انجام دهد.
 */
export async function requireProjectOwner(projectId: string) {
  const { session, membership } = await requireProjectMember(projectId);

  if (membership.role !== "owner") {
    throw new UnauthorizedError("Only the project owner can do this");
  }

  return { session, membership };
}

/**
 * چک می‌کند پروژه با این id واقعاً وجود دارد. جدا از membership چون بعضی
 * جاها (مثل صفحه‌ی ساخت اولیه) فقط می‌خواهیم مطمئن شویم پروژه هست، نه عضویت.
 */
export async function getProjectOrThrow(projectId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) throw new Error("Project not found");
  return project;
}
