import { db } from "@/shared/db";
import { variables } from "@/shared/db/schema/variables";
import { environments } from "@/shared/db/schema/environments";
import { decrypt } from "@/shared/lib/encryption";
import { eq, and } from "drizzle-orm";
import { apiKeys } from "@/shared/db/schema";

export async function GET(request: Request) {
  // ۱. گرفتن API Key از Header
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Missing API key" }, { status: 401 });
  }
  const apiKey = authHeader.replace("Bearer ", "");

  // ۲. گرفتن environment از query string
  const { searchParams } = new URL(request.url);
  const envName = searchParams.get("env"); // "development" | "staging" | "production"

  if (!envName) {
    return Response.json({ error: "env is required" }, { status: 400 });
  }

  // ۳. پیدا کردن API Key تو دیتابیس
  const keyResult = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.key, apiKey))
    .limit(1);

  if (keyResult.length === 0) {
    return Response.json({ error: "Invalid API key" }, { status: 401 });
  }

  const projectId = keyResult[0].projectId;

  // ۴. پیدا کردن environment
  const envResult = await db
    .select()
    .from(environments)
    .where(
      and(
        eq(environments.projectId, projectId),
        eq(environments.name, envName),
      ),
    )
    .limit(1);

  if (envResult.length === 0) {
    return Response.json({ error: "Environment not found" }, { status: 404 });
  }

  // ۵. گرفتن متغیرها و رمزگشایی
  const vars = await db
    .select()
    .from(variables)
    .where(eq(variables.environmentId, envResult[0].id));

  // ۶. تبدیل به فرمت KEY=VALUE
  const result: Record<string, string> = {};
  for (const v of vars) {
    result[v.key] = decrypt(v.encryptedValue);
  }

  return Response.json(result);
}
