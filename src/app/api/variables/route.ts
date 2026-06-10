import { db } from "@/shared/db";
import { variables } from "@/shared/db/schema";
import { decrypt, encrypt } from "@/shared/lib/encryption";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
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

export async function GET(req: NextRequest) {
  // GET http://localhost:3000/api/variables?environmentId=5fe63381-8b56-4693-a5fb-bc93b1efb213
  const { searchParams } = new URL(req.url);
  const environmentId = searchParams.get("environmentId");

  if (!environmentId) {
    return NextResponse.json(
      { error: "environment is required" },
      { status: 400 },
    );
  }

  const rows = await db
    .select()
    .from(variables)
    .where(eq(variables.environmentId, environmentId));

  const decrypted = rows.map((row) => ({
    id: row.id,
    key: row.key,
    value: decrypt(row.encryptedValue),
  }));

  return NextResponse.json({ variables: decrypted });
}
