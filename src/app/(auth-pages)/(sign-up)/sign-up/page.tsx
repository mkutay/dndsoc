import { type Metadata } from "next";
import { Suspense } from "react";

import { SignUpForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyLink } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Sign Up To Our Society!",
  description: "Join our Dungeons and Dragons society and start your journey with us today.",
  openGraph: {
    title: "Sign Up To Our Society!",
    description: "Join our Dungeons and Dragons society and start your journey with us today.",
  },
};

export default function SignUp() {
  return (
    <Card>
      <CardHeader>
        <h1>
          <CardTitle>Sign Up</CardTitle>
        </h1>
        <CardDescription>Please enter your information to sign up.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <SignUpForm />
        </Suspense>
        <div className="mt-4 text-center text-sm font-quotes">
          Already have an account? <TypographyLink href="/sign-in">Sign in</TypographyLink>
        </div>
      </CardContent>
    </Card>
  );
}
