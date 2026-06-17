"use server";

import { db } from "@/shared/db";
import { requireProjectOwner } from "../projects/authorization";
import { environments, inviteTokens, projectMembers } from "@/shared/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { generateSecret, hashSecret } from "@/shared/lib/token-hash";
import { revalidatePath } from "next/cache";

const EXPIRY_MS: Record<string, number> = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
};

export async function inviteMember(input: {
  projectId: string;
  environmentIds: string[];
  expiry: "1h" | "6h" | "24h";
  inviteEmail?: string;
}) {
  await requireProjectOwner(input.projectId);

  if (input.environmentIds.length === 0) {
    throw new Error("Select at least one environment");
  }

  // ============== چک کردن معتبر بودن ولیدیشن ها
  const validEnvs = await db
    .select({ id: environments.id })
    .from(environments)
    .where(
      and(
        eq(environments.projectId, input.projectId),
        inArray(environments.id, input.environmentIds),
      ),
    );

  if (validEnvs.length !== input.environmentIds.length) {
    throw new Error("Invalid environment selection");
  }

  // ============ create new member
  const memberId = randomUUID();

  await db.insert(projectMembers).values({
    id: memberId,
    projectId: input.projectId,
    inviteEmail: input.inviteEmail ?? null,
    role: "member",
    environmentIds: input.environmentIds,
    status: "pending",
  });

  // ============= create token
  const rawToken = generateSecret("evb_invite", 16);
  const tokenHash = hashSecret(rawToken);

  await db.insert(inviteTokens).values({
    id: randomUUID(),
    projectId: input.projectId,
    memberId,
    tokenHash,
    expiresAt: new Date(Date.now() + EXPIRY_MS[input.expiry]),
  });

  revalidatePath("/dashboard/projects");

  return { command: `npx envbox-cli join ${rawToken}` };
}
