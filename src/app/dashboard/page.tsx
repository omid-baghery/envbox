import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Folder, Terminal, Users } from "lucide-react";

export default async function DashboardHome() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-lg font-medium mb-1">
        Welcome, {session?.user?.name || "there"}!
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your projects, environment variables, and team members securely.
      </p>

      {/* Quick link */}
      <div className="grid gap-3 mb-8">
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-4 rounded-lg border px-5 py-4 hover:bg-accent transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Folder size={20} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Projects</p>
            <p className="text-xs text-muted-foreground">
              View and manage your projects
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Start */}
      <div className="rounded-lg border bg-muted/30 p-6 mb-8">
        <h2 className="text-sm font-medium mb-3">Quick Start</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            1. <strong>Create a project</strong> — Add your environment
            variables through the dashboard
          </p>
          <p>
            2. <strong>Invite members</strong> — Go to the Members tab and
            generate an invite token
          </p>
          <p>
            3. <strong>Share with your team</strong>
          </p>
          <div className="bg-muted rounded-md px-3 py-2 mt-1">
            <code className="text-xs font-mono">
              npx envbox-cli join &lt;token&gt;
            </code>
          </div>
          <p className="mt-2">
            4. <strong>Pull variables</strong> — Your team runs one command
          </p>
          <div className="bg-muted rounded-md px-3 py-2 mt-1">
            <code className="text-xs font-mono">npx envbox-cli pull dev</code>
          </div>
        </div>
      </div>

      {/* How it works summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4 text-center">
          <Folder size={18} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs font-medium">Create Project</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your environment variables
          </p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <Users size={18} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs font-medium">Invite Team</p>
          <p className="text-xs text-muted-foreground mt-1">
            Share a one-time token
          </p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <Terminal size={18} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs font-medium">Pull & Go</p>
          <p className="text-xs text-muted-foreground mt-1">
            One command creates .env
          </p>
        </div>
      </div>
    </div>
  );
}
