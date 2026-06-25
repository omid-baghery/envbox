"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { authClient } from "@/features/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmailVerification from "./_components/email-verification";
import { SignInTab } from "./_components/sign-in-tab";
import { SignUpTab } from "./_components/sign-up-tab";
import { SocialAuthButtons } from "./_components/social-auth-buttons";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    setSelectedTab("email-verification");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Tabs
        value={selectedTab}
        onValueChange={(t) => setSelectedTab(t as Tab)}
        defaultValue="signin"
        className="w-full max-w-sm"
      >
        {(selectedTab === "signin" || selectedTab === "signup") && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <SignInTab openEmailVerificationTab={openEmailVerificationTab} />
            </CardContent>
            <CardFooter>
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
            </CardContent>
            <CardFooter>
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email-verification">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailVerification email={email} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
