import { db } from "@/shared/db";
import { projects } from "@/shared/db/schema";

export default async function DashboardPage() {
  const projectList = await db.select().from(projects);
  console.log(projectList.length);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <h1 className="text-base font-medium">Projects ({projectList.length})</h1>

      <div className="flex flex-col gap-2">
        {projectList.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">
                {project.slug} · Created {project.createdAt?.toDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
