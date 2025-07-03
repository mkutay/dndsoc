import { Metadata } from "next";

import { ForgotPasswordForm } from "./form";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forgot Your Password?",
  description: "Forgot your password? Enter your email to reset it.",
  openGraph: {
    title: "Forgot Your Password?",
    description: "Forgot your password? Enter your email to reset it.",
  },
};

export default function ForgotPassword() {
  return (
    <div className="flex flex-col max-w-prose">
      <div>
        <TypographyH1>Forgot Password?</TypographyH1>
        <TypographyParagraph>
          Already have an account?{" "}
          <TypographyLink variant="primary" href="/sign-in">
            Sign in
          </TypographyLink>
        </TypographyParagraph>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
