"use server";

import { db } from "@/shared/db";
import { projects, environments, projectMembers } from "@/shared/db/schema";
import { requireSession } from "../../shared/lib/authorization";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { generateUniqueSlug } from "../../shared/lib/slug";

const ENV_NAMES = ["dev", "staging", "prod"] as const;

export async function createProject(formData: FormData) {
  const session = await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name || name.length < 2) {
    throw new Error("Project name must be at least 2 characters");
  }

  const slug = await generateUniqueSlug(name);
  const projectId = randomUUID();
  const environmentIds: string[] = [];

  // یک تراکنش: یا همه‌چیز ساخته می‌شود یا هیچ‌چیز — اگر وسط کار خطا بیاید
  // (مثلاً slug تکراری)، یک پروژه‌ی نصفه‌کاره بدون owner در project_members نمی‌ماند.
  await db.transaction(async (tx) => {
    await tx.insert(projects).values({
      id: projectId,
      name,
      slug,
      ownerId: session.user.id,
    });

    const envRows = ENV_NAMES.map((envName) => ({
      id: randomUUID(),
      name: envName,
      projectId,
    }));
    envRows.forEach((e) => environmentIds.push(e.id));
    await tx.insert(environments).values(envRows);

    // owner هم یک ردیف در project_members دارد، با دسترسی به همه‌ی environment ها.
    await tx.insert(projectMembers).values({
      id: randomUUID(),
      projectId,
      userId: session.user.id,
      role: "owner",
      environmentIds,
      status: "active",
    });
  });

  revalidatePath("/dashboard");
  return { success: true, slug, projectId };
}

export async function renameProject(projectId: string, name: string) {
  const session = await requireSession();
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) {
    throw new Error("Project name must be at least 2 characters");
  }

  const [updated] = await db
    .update(projects)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(
      and(eq(projects.id, projectId), eq(projects.ownerId, session.user.id)),
    )
    .returning();

  if (!updated) {
    throw new Error("Project not found or you are not the owner");
  }

  revalidatePath(`/dashboard/projects/${updated.slug}`);
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const session = await requireSession();

  const [deleted] = await db
    .delete(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.ownerId, session.user.id)),
    )
    .returning();

  if (!deleted) {
    throw new Error("Project not found or you are not the owner");
  }

  // environments, project_members, invite_tokens, variables, api_keys
  // همه با onDelete: "cascade" در schema خودکار پاک می‌شوند.
  revalidatePath("/dashboard");
  return { success: true };
}
