import { type Metadata } from "next";

import { SignUpForm } from "./form";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";

export const dynamic = "force-dynamic";

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
    <div className="flex flex-col max-w-prose">
      <TypographyH1>Sign Up</TypographyH1>
      <TypographyParagraph>
        Already have an account?{" "}
        <TypographyLink variant="primary" href="/sign-in">
          Sign In
        </TypographyLink>
      </TypographyParagraph>
      <div className="flex flex-col gap-3 mt-4">
        <SignUpForm />
      </div>
    </div>
  );
}
