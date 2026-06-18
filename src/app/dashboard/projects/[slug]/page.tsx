import { db } from "@/shared/db";
import { projects } from "@/shared/db/schema/projects";
import { environments } from "@/shared/db/schema/environments";
import { variables } from "@/shared/db/schema/variables";
import { projectMembers, apiKeys } from "@/shared/db/schema";
import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { AddVariableDialog } from "./_components/add-variable-dialog";
import { Button } from "@/shared/components/ui/button";
import { InviteMemberDialog } from "./_components/invite-member-dialog";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <div>Please sign in</div>;

  // پروژه
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.ownerId, session.user.id)))
    .limit(1);

  if (!project) notFound();

  // محیط‌ها
  const envs = await db
    .select()
    .from(environments)
    .where(eq(environments.projectId, project.id));

  // متغیرها
  const allVars = await db
    .select()
    .from(variables)
    .where(eq(variables.projectId, project.id));

  // اعضا
  const members = await db
    .select()
    .from(projectMembers)
    .where(eq(projectMembers.projectId, project.id));

  // کلیدها
  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.projectId, project.id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <h1 className="text-base font-medium mb-6">{project.name}</h1>

      <Tabs defaultValue="variables">
        <TabsList>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        {/* تب Variables */}
        <TabsContent value="variables">
          <TabsContent value="variables">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {envs.map((env) => {
                  const count = allVars.filter(
                    (v) => v.environmentId === env.id,
                  ).length;
                  return (
                    <div
                      key={env.id}
                      className="rounded-md border px-3 py-1.5 text-sm"
                    >
                      {env.name} ({count})
                    </div>
                  );
                })}
              </div>
              <AddVariableDialog
                environments={envs.map((e) => ({ id: e.id, name: e.name }))}
                projectId={project.id}
              />
            </div>

            {allVars.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No variables yet.
                </p>
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
          </TabsContent>
        </TabsContent>

        {/* تب Members */}
        <TabsContent value="members">
          <TabsContent value="members">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">
                Members ({members.length})
              </h2>
              <InviteMemberDialog
                environments={envs.map((e) => ({ id: e.id, name: e.name }))}
                projectId={project.id}
              />
            </div>

            {members.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center">
                <p className="text-sm text-muted-foreground">No members yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {member.inviteEmail?.charAt(0)?.toUpperCase() ||
                          member.role?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {member.inviteEmail || member.userId || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.role} · {member.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {member.environmentIds?.length || 0} envs
                      </span>
                      {member.role !== "owner" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </TabsContent>

        {/* تب API Keys */}
        <TabsContent value="api-keys">
          <p className="text-sm text-muted-foreground">API Keys coming soon.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
