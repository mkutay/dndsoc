import { notFound } from "next/navigation";
import Link from "next/link";

import { TypographyH1 } from "./typography/headings";
import { TypographyParagraph } from "./typography/paragraph";
import { Button } from "./ui/button";

export function ErrorPage({ error, caller, isNotFound }: {
  error: string;
  caller?: string;
  isNotFound?: boolean;
} | {
  error: {
    message: string;
    code: string;
  };
  caller?: string;
  isNotFound?: boolean;
}) {
  const paragraph = typeof error === 'string' ? error : error.message;
  const heading = "Error" + (typeof error !== 'string' ? ` (${error.code})` : "");
  console.error(`${heading}: ${paragraph}${caller ? ` (caller: ${caller})` : ""}`);

  if (isNotFound) notFound();

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>{heading}</TypographyH1>
      <TypographyParagraph>{paragraph}</TypographyParagraph>
      <Button asChild className="mt-8 w-fit">
        <Link href="/">
          Go back to home
        </Link>
      </Button>
    </div>
  );
}