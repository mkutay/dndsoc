import type { Metadata } from "next";
import Link from "next/link";

import { ResendButton } from "./resend-button";
import { TypographyParagraph, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Confirmation Email Sent",
  description: "Please check your email to confirm your account.",
  openGraph: {
    title: "Confirmation Email Sent",
    description: "Please check your email to confirm your account.",
  },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;

  return (
    <div className="flex flex-col max-w-prose">
      <TypographyH1>Confirmation Email Sent</TypographyH1>
      {email ? (
        <TypographyParagraph>
          To confirm your account, you need to click on the link sent to your email at <b>{email}</b>, and follow the
          instructions. If you have already confirmed your account, you can directly sign in.
        </TypographyParagraph>
      ) : (
        <TypographyParagraph>
          To confirm your account, you need to click on the link sent to your email. If you have already confirmed your
          account, you can directly sign in.
        </TypographyParagraph>
      )}
      <TypographyParagraph>
        If you don&apos;t see the email, please check your spam folder, or click the button below to resend the
        confirmation email.
      </TypographyParagraph>
      <TypographySmall className="mt-6">
        (ps. If you are using Microsoft email (so @kcl.ac.uk), it might take a few minutes for the email to arrive.)
      </TypographySmall>
      <div className="flex flex-row mt-8 gap-2">
        <Button className="w-fit" variant="default">
          <Link href="/sign-in">Continue to Sign In</Link>
        </Button>
        {email ? <ResendButton email={email} /> : null}
      </div>
    </div>
  );
}
