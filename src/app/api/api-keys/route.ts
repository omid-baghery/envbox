import { db } from "@/shared/db";
import { apiKeys } from "@/shared/db/schema";
import { randomBytes, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(res: NextRequest) {
  const body = await res.json();

  const key = `envbox_sk_${randomBytes(32).toString("hex")}`;

  const result = await db
    .insert(apiKeys)
    .values({
      id: randomUUID(),
      key,
      projectId: body.projectId,
    })
    .returning();

  return NextResponse.json({ apiKeys: result[0] }, { status: 200 });
}
