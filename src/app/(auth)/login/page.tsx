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
import React from "react";
import SignInTab from "./_components/sign-in-tab";
import SignUpTab from "./_components/sign-up-tab";

export default function LoginPage() {
  return (
    <Tabs defaultValue="signin" className="mx-auto w-full my-6 py-6 px-4">
      <TabsList>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
      <Card>
        <TabsContent value="signin">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sign In Tab */}
            <SignInTab />
          </CardContent>
        </TabsContent>

        <TabsContent value="signup">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sign up Tab */}
            <SignUpTab />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
}
