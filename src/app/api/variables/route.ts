import { db } from "@/shared/db";
import { variables } from "@/shared/db/schema";
import { encrypt } from "@/shared/lib/encryption";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // body: { key: "DATABASE_URL", value: "postgres://...", environmentId: "..." }

  const encryptedValue = encrypt(body.value);

  const result = await db
    .insert(variables)
    .values({
      id: randomUUID(),
      key: body.key,
      encryptedValue,
      environmentId: body.environmentId,
      projectId: body.projectId,
    })
    .returning();

  return NextResponse.json({ variables: result[0] }, { status: 201 });
}
