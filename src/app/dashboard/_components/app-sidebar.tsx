"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, LayoutGrid, LogOut } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { authClient } from "@/features/auth/auth-client";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="flex w-48 flex-shrink-0 flex-col border-r border-border bg-background">
      {/* لوگو */}
      <div className="flex h-11 items-center gap-2 border-b border-border px-4">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground">
          <span className="text-[10px] font-semibold text-background">E</span>
        </div>
        <span className="text-sm font-medium">EnvBox</span>
      </div>

      {/* لینک‌ها */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            isActive("/dashboard") && pathname === "/dashboard"
              ? "bg-accent text-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <HomeIcon size={15} />
          Overview
        </Link>

        <Link
          href="/dashboard/projects"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            isActive("/dashboard/projects") &&
              pathname === "/dashboard/projects"
              ? "bg-accent text-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <LayoutGrid size={15} />
          Projects
        </Link>
      </nav>

      {/* Sign out */}
      <div className="border-t border-border px-2 py-2">
        <button
          onClick={() => authClient.signOut().then(() => router.push("/"))}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
