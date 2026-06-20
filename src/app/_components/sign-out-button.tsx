"use client";

import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/features/auth/auth-client";

export function SignOutButton() {
  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <Button size="lg" variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
