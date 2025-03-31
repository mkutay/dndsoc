import Link from "next/link";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { SignInForm } from "./form";

export default function Login() {
  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Sign In!</TypographyH1>
      <TypographyParagraph>
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline hover:text-foreground/80 transition-colors" href="/sign-up">
          Sign Up
        </Link>
      </TypographyParagraph>
      <div className="flex flex-col gap-2 mt-8">
        <SignInForm />
      </div>
    </div>
  );
}
