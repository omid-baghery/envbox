"use server";

import { db } from "@/shared/db";
import { variables } from "@/shared/db/schema/variables";
import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import { encrypt } from "@/shared/lib/encryption";
import { revalidatePath } from "next/cache";

export async function addVariable(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const key = formData.get("key") as string;
  const value = formData.get("value") as string;
  const environmentId = formData.get("environmentId") as string;
  const projectId = formData.get("projectId") as string;

  if (!key || !value || !environmentId || !projectId) {
    throw new Error("All fields are required");
  }

  const encryptedValue = encrypt(value);

  await db.insert(variables).values({
    id: crypto.randomUUID(),
    key,
    encryptedValue,
    environmentId,
    projectId,
  });

  revalidatePath(`/dashboard/projects/[slug]`);
  return { success: true };
}
