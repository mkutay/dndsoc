import Link from "next/link";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { ForbiddenSignInButton } from "@/components/forbidden-sign-in-button";

export default function Forbidden() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>You Are Not Authorised</TypographyH1>
      <TypographyParagraph>You cannot access this page, maybe sign in?</TypographyParagraph>
      <div className="flex flex-row gap-4 mt-8">
        <ForbiddenSignInButton>Sign In</ForbiddenSignInButton>
        <Button asChild className="w-fit" variant="outline">
          <Link href="/">Go Back To Home</Link>
        </Button>
      </div>
    </div>
  );
}
