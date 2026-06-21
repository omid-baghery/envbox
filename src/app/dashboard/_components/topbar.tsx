"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/features/auth/auth-client";
import { useRouter } from "next/navigation";
import { LayoutGrid, Home, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

export function Topbar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = session?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="flex h-11 items-center justify-between border-b border-border bg-background px-5">
        {/* لوگو — فقط mobile */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground">
            <span className="text-[10px] font-semibold text-background">E</span>
          </div>
          <span className="text-sm font-medium">EnvBox</span>
        </Link>

        <div className="hidden md:flex flex-1" /> {/* spacer */}

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-xs text-muted-foreground">
            {session?.user?.email}
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
            {initials}
          </div>
          {/* دکمه همبرگر — فقط mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-11 left-0 right-0 bg-background border-b border-border z-50 p-3 flex flex-col gap-1">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
              isActive("/dashboard") && pathname === "/dashboard"
                ? "bg-accent font-medium"
                : "text-muted-foreground",
            )}
          >
            <Home size={15} /> Overview
          </Link>

          <Link
            href="/dashboard/projects"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
              pathname === "/dashboard/projects"
                ? "bg-accent font-medium"
                : "text-muted-foreground",
            )}
          >
            <LayoutGrid size={15} /> Projects
          </Link>

          <button
            onClick={() => {
              authClient.signOut().then(() => router.push("/"));
            }}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </>
  );
}