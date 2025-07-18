import { type Metadata } from "next";
import { Suspense } from "react";

import { SignUpForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyLink } from "@/components/typography/paragraph";
import LiquidChrome from "@/components/reactbits/liquid-chrome";
import { Logo } from "@/components/logo";

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
    <div className="relative flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-10">
      <div className="absolute inset-0 z-0">
        <LiquidChrome interactive={false} />
      </div>
      <div className="absolute top-4 z-10 shadow-md rounded-full">
        <Logo className="backdrop-blur-sm py-3 px-4 rounded-full" disableText />
      </div>
      <div className="relative z-10 w-full max-w-md shadow-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
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
      </div>
      <div className="text-primary text-center text-xs font-quotes text-balance absolute bottom-4 z-10">
        By clicking continue, you agree to our{" "}
        <TypographyLink href="/terms-of-service">Terms of Service</TypographyLink> and{" "}
        <TypographyLink href="/privacy-policy">Privacy Policy</TypographyLink>.
      </div>
    </div>
  );
}
