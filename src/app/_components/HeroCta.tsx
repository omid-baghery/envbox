import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

interface HeroCtaProps {
  isSignedIn: boolean;
}

export function HeroCta({ isSignedIn }: HeroCtaProps) {
  return (
    <div className="flex items-center gap-3">
      <Button asChild size="lg">
        <Link href={isSignedIn ? "/dashboard" : "/login"}>
          {isSignedIn ? "Go to dashboard" : "Get started"}
        </Link>
      </Button>
      {!isSignedIn && (
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      )}
    </div>
  );
}
