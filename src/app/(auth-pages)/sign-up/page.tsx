import Link from "next/link";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { SignUpForm } from "./form";

export default function SignUp() {
  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Sign Up!</TypographyH1>
      <TypographyParagraph>
        Already have an account?{" "}
        <Link className="text-foreground font-medium underline hover:text-foreground/80 transition-colors" href="/sign-in">
          Sign In
        </Link>
      </TypographyParagraph>
      <div className="flex flex-col gap-3 mt-8">
        <SignUpForm />
      </div>
    </div>
  );
}
