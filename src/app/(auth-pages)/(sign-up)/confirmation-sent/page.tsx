import type { Metadata } from "next";
import Link from "next/link";

import { ResendButton } from "./resend-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";
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
    <Card>
      <CardHeader>
        <h1>
          <CardTitle>Confirmation Email Sent</CardTitle>
        </h1>
      </CardHeader>
      <CardContent>
        {email ? (
          <TypographyParagraph>
            To confirm your account, you need to click on the link sent to your email at <i>{email}</i>. If you have
            already confirmed your account, you can directly sign in.
          </TypographyParagraph>
        ) : (
          <TypographyParagraph>
            To confirm your account, you need to click on the link sent to your email. If you have already confirmed
            your account, you can directly sign in.
          </TypographyParagraph>
        )}
        <TypographyParagraph>
          If you don&apos;t see the email, please check your spam folder, or click the button below to resend the
          confirmation email.
        </TypographyParagraph>
        <TypographyParagraph>
          (ps. With some email providers, it may take a few minutes for the email to arrive.)
        </TypographyParagraph>
      </CardContent>
      <CardFooter className="flex flex-row gap-2">
        <Button className="w-fit" variant="default">
          <Link href="/sign-in">Continue to Sign In</Link>
        </Button>
        {email ? <ResendButton email={email} /> : null}
      </CardFooter>
    </Card>
  );
}
