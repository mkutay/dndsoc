import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { ConfirmButton } from "./confirm-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Confirm Your Account",
  description: "Click the button below to confirm your account.",
  openGraph: {
    title: "Confirm Your Account",
    description: "Click the button below to confirm your account.",
  },
};

/*
 * Thanks to microsoft, we have to have these pages to avoid prefetching issues.
 * Funny that we're also lying to the user here, as the email will be confirmed AFTER they've clicked the button.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: EmailOtpType }>;
}) {
  const { token_hash, type } = await searchParams;

  if (!token_hash || !type) {
    console.error("Missing required query parameters for password reset.");
    redirect("/sign-in");
  }

  const pathname =
    "/auth/reset-password?" +
    new URLSearchParams({
      token_hash,
      type,
    });

  return (
    <Card>
      <CardHeader className="md:p-6 p-3">
        <h1>
          <CardTitle className="md:text-left text-center md:pt-0 pt-1">Email Confirmed!</CardTitle>
        </h1>
      </CardHeader>
      <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
        <TypographyParagraph>Click the button below to continue to reset your password.</TypographyParagraph>
      </CardContent>
      <CardFooter className="md:p-6 md:pt-0 p-3 pt-0">
        <Suspense>
          <ConfirmButton pathname={pathname} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
