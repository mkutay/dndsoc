import type { EmailOtpType } from "@supabase/supabase-js";
import type { Metadata } from "next";

import { ConfirmButton } from "./confirm-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Confirm Invite",
  description: "Complete your sign-up process by confirming your invitation.",
  openGraph: {
    title: "Confirm Invite",
    description: "Complete your sign-up process by confirming your invitation.",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token_hash: string | null; type: EmailOtpType | null }>;
}) {
  const { token_hash: tokenHash, type } = await searchParams;

  if (!tokenHash || !type) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyParagraph className="text-destructive">
            No confirmation URL provided. Please check your invitation link.
          </TypographyParagraph>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h1>
          <CardTitle>I&apos;m Seeing the Light!</CardTitle>
        </h1>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>
          You&apos;re almost there! Click the button below to confirm your account and complete the sign-up process.
        </TypographyParagraph>
      </CardContent>
      <CardFooter>
        <ConfirmButton tokenHash={tokenHash} type={type} />
      </CardFooter>
    </Card>
  );
}
