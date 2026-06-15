import { db } from "@/shared/db";
import { projects } from "@/shared/db/schema/projects";
import { environments } from "@/shared/db/schema/environments";
import { variables } from "@/shared/db/schema/variables";
import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <div>Please sign in</div>;

  // پیدا کردن پروژه
  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.ownerId, session.user.id)))
    .limit(1);

  if (project.length === 0) notFound();

  // گرفتن environment ها
  const envs = await db
    .select()
    .from(environments)
    .where(eq(environments.projectId, project[0].id));

  // گرفتن همه متغیرهای پروژه
  const allVars = await db
    .select()
    .from(variables)
    .where(eq(variables.projectId, project[0].id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <h1 className="text-base font-medium mb-6">{project[0].name}</h1>

      <div className="flex gap-2 mb-4">
        {envs.map((env) => {
          const count = allVars.filter(
            (v) => v.environmentId === env.id,
          ).length;
          return (
            <div key={env.id} className="rounded-md border px-3 py-1.5 text-sm">
              {env.name} ({count})
            </div>
          );
        })}
      </div>

      {allVars.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">No variables yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase">
                  Key
                </th>
                <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {allVars.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{v.key}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    ••••••••••
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
