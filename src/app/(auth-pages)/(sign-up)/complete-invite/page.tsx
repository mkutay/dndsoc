import type { EmailOtpType } from "@supabase/supabase-js";
import type { Metadata } from "next";

import { CompleteInviteForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Complete Invite",
  description: "Complete your invite to access our services.",
  openGraph: {
    title: "Complete Invite",
    description: "Complete your invite to access our services.",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: EmailOtpType }>;
}) {
  const { token_hash: tokenHash, type } = await searchParams;

  if (!tokenHash || type !== "invite") {
    return (
      <Card>
        <CardHeader className="md:p-6 p-3">
          <h1>
            <CardTitle className="md:text-left text-center md:pt-0 pt-1">Invalid Request</CardTitle>
          </h1>
        </CardHeader>
        <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
          <p>Please ensure you have a valid invite link.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="md:p-6 p-3">
        <h1>
          <CardTitle className="md:text-left text-center md:pt-0 pt-1">The Final Step</CardTitle>
        </h1>
        <CardDescription>
          Fill your information to complete the sign-up process and access our services.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
        <CompleteInviteForm tokenHash={tokenHash} />
      </CardContent>
    </Card>
  );
}
