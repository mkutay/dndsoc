import { type Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyLink } from "@/components/typography/paragraph";
import Balatro from "@/components/reactbits/balatro";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Sign In To Your Account",
  description: "Sign in to your account to access your profile and settings.",
  openGraph: {
    title: "Sign In To Your Account",
    description: "Sign in to your account to access your profile and settings.",
  },
};

export default function Login() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-10">
      <div className="absolute inset-0 z-0">
        <Balatro isRotate={false} mouseInteraction={false} pixelFilter={2000} />
      </div>
      <div className="absolute top-8 mx-auto z-10 shadow-md rounded-full">
        <Logo className="backdrop-blur-sm md:py-6 md:px-8 py-3 px-4 rounded-full" />
      </div>
      <div className="relative z-10 w-full max-w-md shadow-2xl">
        <Card>
          <CardHeader>
            <h1>
              <CardTitle>Sign In</CardTitle>
            </h1>
            <CardDescription>Please enter your email and password to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <SignInForm />
            </Suspense>
            <div className="mt-4 text-center text-sm font-quotes">
              Don&apos;t have an account? <TypographyLink href="/sign-up">Sign up</TypographyLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
