import { ComponentProps, ElementType } from "react";
import { GitHubIcon, GoogleIcon } from "./components/o-auth-icons";

// ۱. لیست provider هایی که پشتیبانی میکنیم
export const SUPPORTED_OAUTH_PROVIDERS = ["github", "google"] as const;

// ۲. نوع هر provider
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

// ۳. مشخصات هر provider
export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  github: { name: "GitHub", Icon: GitHubIcon },
  google: { name: "Google", Icon: GoogleIcon },
};
