import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { SignOutButton } from "./_components/sign-out-button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isSignedIn = !!session;

  return (
    <div className="flex min-h-screen items-center justify-center">
      
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
            <span className="text-xs font-semibold text-background">E</span>
          </div>
          <span className="text-sm font-medium text-foreground">EnvBox</span>
        </div>
        <nav className="flex items-center gap-4">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          )}
        </nav>
      </header>

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
