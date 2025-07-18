import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { ConfirmButton } from "./confirm-button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Confirm Your Account",
  description: "Click the button below to confirm your account.",
  openGraph: {
    title: "Confirm Your Account",
    description: "Click the button below to confirm your account.",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: EmailOtpType; next?: string }>;
}) {
  const { token_hash, type, next } = await searchParams;

  if (!token_hash || !type || !next) {
    console.error("Missing required query parameters for email confirmation.");
    redirect("/sign-in");
  }

  const pathname =
    "/auth/confirm-signup?" +
    new URLSearchParams({
      token_hash,
      type,
      next,
    });

  return (
    <Card>
      <CardHeader>
        <h1>
          <CardTitle>Confirm Your Account</CardTitle>
        </h1>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>
          Click the button below to confirm your account and go to your dashboard.
        </TypographyParagraph>
      </CardContent>
      <CardFooter>
        <Suspense>
          <ConfirmButton pathname={pathname} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
