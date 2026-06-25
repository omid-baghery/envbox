"use client";

import { authClient } from "@/features/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/features/auth/o-auth-providers";
import { Button } from "@/shared/components/ui/button";

export function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const { name, Icon } = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider];

        return (
          <Button
            key={provider}
            variant="outline"
            className="w-full"
            onClick={() =>
              authClient.signIn.social({
                provider,
                callbackURL: "/dashboard",
              })
            }
          >
            <Icon />
            {name}
          </Button>
        );
      })}
    </div>
  );
}
