import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { HeroCta } from "./_components/HeroCta";
import { CommandPreview } from "./_components/command-preview";
import { FeatureCard } from "./_components/feature-card";
import { GitBranch, KeyRound, Lock, Users } from "lucide-react";

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

        <section className="mx-auto max-w-2xl px-6 pb-20">
          <div className="rounded-xl border border-border bg-muted/20 p-6">
            <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground/70">
              From invite to pull, in two commands
            </p>
            <div className="flex flex-col gap-3">
              <CommandPreview command="npx envbox-cli join evb_invite_f0" />
              <CommandPreview command="npx envbox-cli pull prod" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={Lock}
              title="Encrypted at rest"
              description="Every value is encrypted with AES-256-GCM before it touches the database. Nothing is ever stored in plaintext."
            />
            <FeatureCard
              icon={GitBranch}
              title="Per-environment access"
              description="Dev, staging, and production are separate from day one. Invite someone to just the environments they need."
            />
            <FeatureCard
              icon={Users}
              title="Time-limited invites"
              description="Invite links expire in 1, 6, or 24 hours and can only be used once. No stale credentials floating around."
            />
            <FeatureCard
              icon={KeyRound}
              title="Revoke in one click"
              description="Remove a teammate or revoke a single API key without touching anything else in the project."
            />
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-24">
          <h2 className="text-lg font-medium text-center mb-8">How it works</h2>

          <div className="grid gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium shrink-0">
                1
              </div>
              <div>
                <p className="text-sm font-medium">
                  Create a project & add variables
                </p>
                <p className="text-sm text-muted-foreground">
                  Sign up, create a project, and add your environment variables
                  through the dashboard. Each value is encrypted before storage.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium shrink-0">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Invite your team</p>
                <p className="text-sm text-muted-foreground">
                  Go to the Members tab, invite by email, choose which
                  environments they can access, and share the one-time command.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium shrink-0">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Team members join & pull</p>
                <p className="text-sm text-muted-foreground">
                  They run the join command once — it saves an encrypted config
                  file (auto-added to .gitignore). After that, a single{" "}
                  <code className="text-xs bg-muted px-1 rounded">pull</code>{" "}
                  command creates their .env file.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
