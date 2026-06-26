"use client";

import { useSearchParams } from "next/navigation";
import EmailVerification from "../../_components/email-verification";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return <EmailVerification email={email} />;
}
