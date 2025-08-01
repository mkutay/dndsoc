import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Request Sent",
  description: "Your request to sign up is on its way to us.",
  openGraph: {
    title: "Request Sent",
    description: "Your request to sign up is on its way to us.",
  },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;

  return (
    <Card>
      <CardHeader className="md:p-6 p-3">
        <h1>
          <CardTitle className="md:text-left text-center md:pt-0 pt-1">Your Request is On its Way</CardTitle>
        </h1>
      </CardHeader>
      <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
        {email ? (
          <TypographyParagraph>
            Your request to sign up is on its way to us. Once approved, you will receive an email at <i>{email}</i> with
            further instructions on accessing our services.
          </TypographyParagraph>
        ) : (
          <TypographyParagraph>
            Your request to sign up is on its way to us. Once approved, you will receive an email with further
            instructions on accessing our services.
          </TypographyParagraph>
        )}
        <TypographyParagraph>
          We approve requests as soon as possible, but it may take some time. If you have not received an email within a
          few hours, please check your spam folder or contact us at{" "}
          <TypographyLink href="mailto:hello@kcldnd.uk">hello@kcldnd.uk</TypographyLink>
        </TypographyParagraph>
      </CardContent>
    </Card>
  );
}
