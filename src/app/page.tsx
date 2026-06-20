import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { SignOutButton } from "./_components/sign-out-button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        {!session ? (
          <>
            <h1 className="text-3xl font-bold">EnvBox</h1>
            <p className="text-muted-foreground">
              Secure environment variables for your team.
            </p>
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Welcome back, {session.user.name}!
            </h1>
            <div className="flex gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <SignOutButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
