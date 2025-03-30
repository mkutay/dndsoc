import Link from "next/link";

import { FormMessage, Message } from "@/components/form-message";
import { ForgotPasswordForm } from "./form";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <div>
        <TypographyH1>Forgot Password?</TypographyH1>
        <TypographyParagraph>
          Already have an account?{" "}
          <Link className="text-foreground font-medium underline hover:text-foreground/80 transition-colors" href="/sign-in">
            Sign in
          </Link>
        </TypographyParagraph>
      </div>
      <div className="flex flex-col gap-2 mt-8">
        <ForgotPasswordForm />
        <FormMessage message={searchParams} />
      </div>
    </div>
  );
}
