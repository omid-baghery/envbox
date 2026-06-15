import { db } from "@/shared/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const result = await db.execute(sql`SELECT 2 + 2 AS answer`);
  return Response.json({ answer: result.rows[0].answer });
}
