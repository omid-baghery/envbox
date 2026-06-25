"use server";

import { db } from "@/shared/db";
import { environments, projects, variables } from "@/shared/db/schema";
import { and, eq } from "drizzle-orm";
import { requireProjectMember } from "../../shared/lib/authorization";
import { encrypt } from "@/shared/lib/encryption";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

// ========================================= helper function

// چک کردن مالکیت انوایرمنت که متعلق به همین پروژه باشه
async function assertEnvBelongsToProject(
  environmentId: string,
  projectId: string,
) {
  const [env] = await db
    .select({ id: environments.id })
    .from(environments)
    .where(
      and(
        eq(environments.id, environmentId),
        eq(environments.projectId, projectId),
      ),
    )
    .limit(1);

  if (!env) throw new Error("Environment not found in this project");
}

// ریولیدیت کردن صفحه برای بعد از تغییر
async function revalidateProject(projectId: string) {
  const [project] = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (project) revalidatePath(`/dashboard/projects/${project.slug}`);
}

// ========================================= عملیات ها

export async function addVariable(formData: FormData) {
  const key = (formData.get("key") as string)?.trim();
  const value = formData.get("value") as string;
  const environmentId = formData.get("environmentId") as string;
  const projectId = formData.get("projectId") as string;

  if (!key || !value || !environmentId || !projectId) {
    throw new Error("All fields are required");
  }

  // چک می‌کند کاربر فعلی واقعاً عضو فعال همین پروژه است —
  // بدون این، هر کاربر لاگین‌شده می‌توانست variable به پروژه‌ی هرکسی اضافه کند.
  await requireProjectMember(projectId);
  await assertEnvBelongsToProject(environmentId, projectId);

  const encryptedValue = encrypt(value);

  await db.insert(variables).values({
    id: randomUUID(),
    key,
    encryptedValue,
    environmentId,
    projectId,
  });

  await revalidateProject(projectId);
  return { success: true };
}

export async function updateVariable(input: {
  projectId: string;
  variableId: string;
  key: string;
  value: string;
}) {
  await requireProjectMember(input.projectId);

  const encryptedValue = encrypt(input.value);

  const [updated] = await db
    .update(variables)
    .set({ key: input.key.trim(), encryptedValue, updatedAt: new Date() })
    .where(
      and(
        eq(variables.id, input.variableId),
        eq(variables.projectId, input.projectId),
      ),
    )
    .returning();

  if (!updated) throw new Error("Variable not found");
  await revalidateProject(input.projectId);

  return { success: true };
}

export async function deleteVariable(projectId: string, variableId: string) {
  await requireProjectMember(projectId);

  const [deleted] = await db
    .delete(variables)
    .where(
      and(eq(variables.id, variableId), eq(variables.projectId, projectId)),
    )
    .returning();

  if (!deleted) throw new Error("Variable not found");
  await revalidateProject(projectId);

  return { success: true };
}
