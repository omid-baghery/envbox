import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { SignOutButton } from "./_components/sign-out-button";
import { HeroCta } from "./_components/HeroCta";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isSignedIn = !!session;

  return (
    <div className="flex min-h-screen flex-col">
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

      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="mb-4 text-3xl font-medium text-foreground sm:text-4xl">
            Environment variables, shared safely
          </h1>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            Stop pasting secrets into Slack. Invite your team, scope access to
            the right environment, and let everyone pull what they need with one
            command.
          </p>
          <div className="flex justify-center">
            <HeroCta isSignedIn={isSignedIn} />
          </div>
        </section>
      </main>
    </div>
  );
}
