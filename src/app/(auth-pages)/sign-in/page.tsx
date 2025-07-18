import { type Metadata } from "next";

import { Suspense } from "react";
import { SignInForm } from "./form";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";

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
    <div className="flex flex-col max-w-prose">
      <TypographyH1>Sign In</TypographyH1>
      <TypographyParagraph>
        Don&apos;t have an account?{" "}
        <TypographyLink variant="primary" href="/sign-up">
          Sign Up
        </TypographyLink>
      </TypographyParagraph>
      <div className="flex flex-col gap-2 mt-4">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
