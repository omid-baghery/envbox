import { db } from "@/shared/db";
import { projects } from "@/shared/db/schema";
import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { NewProjectDialog } from "../_components/new-project-dialog";

export default async function DashboardPage() {
  // گرفتن کاربر لاگین‌شده
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Please sign in</div>;
  }

  // فقط پروژه‌های این کاربر
  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, session.user.id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-base font-medium">Projects</h1>
          <NewProjectDialog />
        </div>
        {projectList.map((project) => (
          <Link
            href={`/dashboard/projects/${project.slug}`}
            key={project.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">
                {project.slug} · Created {project.createdAt?.toDateString()}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
