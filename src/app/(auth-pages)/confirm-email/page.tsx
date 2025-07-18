import type { Metadata } from "next";
import { Suspense } from "react";

import { ConfirmButton } from "./confirm-button";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Confirm Your Account",
  description: "Click the button below to confirm your account.",
  openGraph: {
    title: "Confirm Your Account",
    description: "Click the button below to confirm your account.",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col max-w-prose">
      <TypographyH1>Confirm Your Account</TypographyH1>
      <TypographyParagraph>
        Click the button below to confirm your account. If you have already confirmed your account, you can just{" "}
        <TypographyLink href="/sign-in">sign in</TypographyLink>.
      </TypographyParagraph>
      <Suspense>
        <ConfirmButton />
      </Suspense>
    </div>
  );
}
