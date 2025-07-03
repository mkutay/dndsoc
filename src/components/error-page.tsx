import { forbidden, notFound } from "next/navigation";
import Link from "next/link";

import { TypographyH1 } from "./typography/headings";
import { TypographyParagraph } from "./typography/paragraph";
import { Button } from "./ui/button";

export function ErrorPage({
  error,
  caller,
  isNotFound,
  isForbidden,
}: {
  error:
    | string
    | {
        message: string;
        code: string;
      };
  caller?: string;
  isNotFound?: boolean;
  isForbidden?: boolean;
}) {
  const paragraph = typeof error === "string" ? error : error.message;
  const heading = "Error" + (typeof error !== "string" ? ` (${error.code})` : "");
  console.error(`${heading}: ${paragraph}${caller ? ` (caller: ${caller})` : ""}`);

  if (isNotFound) notFound();
  if (isForbidden) forbidden();

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>{heading}</TypographyH1>
      <TypographyParagraph>{paragraph}</TypographyParagraph>
      <Button asChild className="mt-8 w-fit">
        <Link href="/">Go Back To Home</Link>
      </Button>
    </div>
  );
}
