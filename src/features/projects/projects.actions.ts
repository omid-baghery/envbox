"use server";

import { db } from "@/shared/db";
import { projects } from "@/shared/db/schema/projects";
import { environments } from "@/shared/db/schema/environments";
import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { generateApiKey } from "../api-keys/api-keys.service";
import { apiKeys } from "@/shared/db/schema";

export async function createProject(formData: FormData) {
  // ۱. چک کن کاربر لاگین هست
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // ۲. اسم رو از فرم بگیر
  const name = formData.get("name") as string;

  if (!name || name.length < 2) {
    throw new Error("Project name must be at least 2 characters");
  }

  // ۳. slug بساز
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const projectId = crypto.randomUUID();

  // ۴. پروژه رو تو دیتابیس بذار
  await db.insert(projects).values({
    id: projectId,
    name,
    slug,
    ownerId: session.user.id,
  });

  // ۵. سه محیط پیش‌فرض بساز
  await db.insert(environments).values([
    { id: crypto.randomUUID(), name: "development", projectId },
    { id: crypto.randomUUID(), name: "staging", projectId },
    { id: crypto.randomUUID(), name: "production", projectId },
  ]);

  const key = generateApiKey();
  await db.insert(apiKeys).values({
    id: crypto.randomUUID(),
    key,
    projectId,
  });

  // ۶. کش رو رفرش کن
  revalidatePath("/dashboard");

  return { success: true, slug };
}
