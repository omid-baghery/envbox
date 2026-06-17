import { db } from "@/shared/db";
import { projects } from "@/shared/db/schema/projects";
import { like, desc } from "drizzle-orm";

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const [last] = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(like(projects.slug, `${base}%`))
    .orderBy(desc(projects.slug))
    .limit(1);

  if (!last) return base;

  const match = last.slug.match(/-(\d+)$/);
  if (!match) return `${base}-1`;

  const num = parseInt(match[1]) + 1;
  return `${base}-${num}`;
}
