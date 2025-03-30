import Link from "next/link";

import { FormMessage, Message } from "@/components/form-message";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { SignUpForm } from "./form";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

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
        <FormMessage message={searchParams} />
      </div>
    </div>
  );
}
