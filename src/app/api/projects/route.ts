import { db } from "@/shared/db";
import { environments, projects } from "@/shared/db/schema";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // گرفتن یه کاربر واقعی از دیتابیس
  const users = await db.execute('SELECT id FROM "user" LIMIT 1');
  const userId = users.rows[0]?.id;

  if (!userId) {
    return Response.json(
      { error: "No user found. Sign up first." },
      { status: 400 },
    );
  }

  const projectId = randomUUID();
  const result = await db
    .insert(projects)
    .values({
      id: projectId,
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      ownerId: userId.toString(),
    })
    .returning();

  await db.insert(environments).values([
    { id: randomUUID(), name: "development", projectId },
    { id: randomUUID(), name: "staging", projectId },
    { id: randomUUID(), name: "production", projectId },
  ]);

  return Response.json({ project: result[0] }, { status: 201 });
}

export async function GET() {
  const allProjects = await db.select().from(projects);
  return NextResponse.json({ projects: allProjects });
}
