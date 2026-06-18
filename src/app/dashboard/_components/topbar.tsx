"use client";

import { authClient } from "@/features/auth/auth-client";

export function Topbar() {
  const { data: session } = authClient.useSession();
  const initials = session?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <header className="flex h-11 items-center justify-end gap-3 border-b border-border bg-background px-5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
          {initials}
        </div>
      </div>
    </header>
  );
}