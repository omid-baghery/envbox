import { generateApiKey } from "@/features/api-keys/api-keys.service";
import { db } from "@/shared/db";
import { apiKeys } from "@/shared/db/schema";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(res: NextRequest) {
  const body = await res.json();

  const key = generateApiKey();

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
