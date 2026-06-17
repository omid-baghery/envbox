import { db } from "@/shared/db";
import {
  variables,
  environments,
  apiKeys,
  projectMembers,
} from "@/shared/db/schema";
import { decrypt } from "@/shared/lib/encryption";
import { hashSecret } from "@/shared/lib/token-hash";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(request: Request) {
  // ۱. گرفتن API Key از Header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Missing API key" }, { status: 401 });
  }
  const rawKey = authHeader.replace("Bearer ", "");
  const keyHash = hashSecret(rawKey);

  // ۲. گرفتن environment از query string
  const { searchParams } = new URL(request.url);
  const envName = searchParams.get("env"); // "dev" | "staging" | "prod"
  if (!envName) {
    return Response.json({ error: "env is required" }, { status: 400 });
  }

  // ۳. پیدا کردن کلید با hash (نه plaintext) و چک revoke
  const [keyRow] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)))
    .limit(1);

  if (!keyRow) {
    return Response.json(
      { error: "Invalid or revoked API key" },
      { status: 401 },
    );
  }

  // ۴. خود عضو را می‌خوانیم تا لیست environment های مجازش را بدانیم
  const [member] = await db
    .select()
    .from(projectMembers)
    .where(eq(projectMembers.id, keyRow.memberId))
    .limit(1);

  if (!member || member.status === "removed") {
    return Response.json({ error: "Member access revoked" }, { status: 401 });
  }

  // ۵. پیدا کردن environment با اسم + پروژه‌ی همین کلید
  const [env] = await db
    .select()
    .from(environments)
    .where(
      and(
        eq(environments.projectId, keyRow.projectId),
        eq(environments.name, envName),
      ),
    )
    .limit(1);

  if (!env) {
    return Response.json({ error: "Environment not found" }, { status: 404 });
  }

  // ۶. مهم‌ترین چک: آیا این عضو واقعاً اجازه‌ی این environment خاص را دارد؟
  // قبلاً این کنترل اصلاً وجود نداشت — هر کلید معتبر هر environment ای را
  // که اسمش را می‌دانست می‌توانست بخواند.
  if (!member.environmentIds.includes(env.id)) {
    return Response.json(
      { error: `You don't have access to the "${envName}" environment` },
      { status: 403 },
    );
  }

  // ۷. گرفتن متغیرها و رمزگشایی
  const vars = await db
    .select()
    .from(variables)
    .where(eq(variables.environmentId, env.id));

  const result: Record<string, string> = {};
  for (const v of vars) {
    result[v.key] = decrypt(v.encryptedValue);
  }

  // ۸. آپدیت lastUsedAt (کلید) و lastPullAt (عضو) — برای نمایش در تب Members/API keys
  const now = new Date();
  await Promise.all([
    db
      .update(apiKeys)
      .set({ lastUsedAt: now })
      .where(eq(apiKeys.id, keyRow.id)),
    db
      .update(projectMembers)
      .set({ lastPullAt: now })
      .where(eq(projectMembers.id, member.id)),
  ]);

  return Response.json(result);
}
