"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import SignInTab from "./_components/sign-in-tab";
import SignUpTab from "./_components/sign-up-tab";
import { authClient } from "@/features/auth/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect if already logged in
  if (!isPending && session) {
    router.push("/");
    return null;
  }

  // Don't flash the login form while checking session
  if (isPending) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Tabs defaultValue="signin" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <SignInTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
