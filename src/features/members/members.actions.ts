"use server";

import { db } from "@/shared/db";
import { requireProjectOwner } from "../../shared/lib/authorization";
import {
  apiKeys,
  environments,
  inviteTokens,
  projectMembers,
} from "@/shared/db/schema";
import { and, eq, gt, inArray, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  generateSecret,
  hashSecret,
  previewSecret,
} from "@/shared/lib/token-hash";
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

export async function joinWithToken(rawToken: string) {
  const tokenHash = hashSecret(rawToken);
  const now = new Date();

  const [invite] = await db
    .select()
    .from(inviteTokens)
    .where(
      and(
        eq(inviteTokens.tokenHash, tokenHash),
        isNull(inviteTokens.usedAt),
        gt(inviteTokens.expiresAt, now),
      ),
    )
    .limit(1);

  if (!invite) {
    throw new Error("This invite link is invalid or has expired");
  }

  // ============ علامت گذاری توکن به عنوان استفاده شده با عمل همه یا هیچ
  return await db.transaction(async (tx) => {
    await tx
      .update(inviteTokens)
      .set({ usedAt: now })
      .where(eq(inviteTokens.id, invite.id));

    const rawApiKey = generateSecret("evb_sk", 24);
    const keyHash = hashSecret(rawApiKey);

    await tx.insert(apiKeys).values({
      id: randomUUID(),
      projectId: invite.projectId,
      memberId: invite.memberId,
      keyHash,
      keyPreview: previewSecret(rawApiKey),
    });

    // =========== فعال کردن عضو
    await tx
      .update(projectMembers)
      .set({ status: "active", updatedAt: now })
      .where(eq(projectMembers.id, invite.memberId));

    return { apiKey: rawApiKey };
  });
}

export async function removeMember(projectId: string, memberId: string) {
  // ۱. فقط owner
  const { membership: actingMember } = await requireProjectOwner(projectId);

  // ۲. owner نمی‌تونه خودش رو حذف کنه
  if (actingMember.id === memberId) {
    throw new Error("You can't remove yourself as the owner");
  }

  // ۳. تراکنش
  await db.transaction(async (tx) => {
    // همه کلیدهای فعال این عضو رو revoke کن
    await tx
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(eq(apiKeys.memberId, memberId), isNull(apiKeys.revokedAt)));

    // عضو رو به removed تغییر بده
    await tx
      .update(projectMembers)
      .set({ status: "removed", updatedAt: new Date() })
      .where(
        and(
          eq(projectMembers.id, memberId),
          eq(projectMembers.projectId, projectId),
        ),
      );
  });

  revalidatePath(`/dashboard/projects`);
  return { success: true };
}

export async function revokeApiKey(projectId: string, apiKeyId: string) {
  // ۱. فقط owner
  await requireProjectOwner(projectId);

  // ۲. کلید رو revoke کن
  const [revoked] = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(apiKeys.id, apiKeyId),
        eq(apiKeys.projectId, projectId),
        isNull(apiKeys.revokedAt),
      ),
    )
    .returning();

  if (!revoked) {
    throw new Error("API key not found or already revoked");
  }

  revalidatePath(`/dashboard/projects`);
  return { success: true };
}
