import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Folder } from "lucide-react";

export default async function DashboardHome() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-lg font-medium mb-2">
        Welcome, {session?.user?.name || "there"}!
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your projects, environment variables, and team members securely.
      </p>

      <div className="grid gap-4">
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
    </div>
  );
}
