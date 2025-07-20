import { type Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "./form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyLink } from "@/components/typography/paragraph";
import LiquidChrome from "@/components/reactbits/liquid-chrome";
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
        <LiquidChrome interactive={false} />
      </div>
      <div className="absolute top-8 mx-auto z-10 shadow-md rounded-full">
        <Logo className="backdrop-blur-sm p-4 rounded-full" />
      </div>
      <div className="relative z-10 w-full max-w-md shadow-2xl">
        <Card>
          <CardHeader className="md:p-6 p-3">
            <h1>
              <CardTitle className="md:text-left text-center md:pt-0 pt-1">Sign In</CardTitle>
            </h1>
          </CardHeader>
          <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
            <Suspense>
              <SignInForm />
            </Suspense>
          </CardContent>
          <CardFooter className="md:p-6 md:pt-0 p-3 pt-0">
            <div className="w-full text-center text-sm font-quotes">
              Don&apos;t have an account? <TypographyLink href="/sign-up">Sign up</TypographyLink>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
