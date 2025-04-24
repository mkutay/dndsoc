import Link from "next/link";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>You Are Not Authorised</TypographyH1>
      <TypographyParagraph>You cannot access this page, maybe sign in?</TypographyParagraph>
      <div className="flex flex-row gap-4">
        <Button asChild className="mt-8 w-fit">
          <Link href="/sign-in">
            Sign In
          </Link>
        </Button>
        <Button asChild className="mt-8 w-fit" variant="outline">
          <Link href="/">
            Go Back To Home
          </Link>
        </Button>
      </div>
    </div>
  );
}