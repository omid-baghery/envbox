"use client";

import { authClient } from "@/features/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {!session ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to EnvBox</h1>
            <p className="text-muted-foreground">
              Secure your environment variables
            </p>
            <Button asChild size="lg">
              <Link href="/login">Sign In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={() => authClient.signOut()}
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
