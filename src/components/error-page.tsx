import { TypographyH1 } from "./typography/headings";
import { TypographyParagraph } from "./typography/paragraph";

export function ErrorPage({ error }: { error: string }) {
  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Error</TypographyH1>
      <TypographyParagraph>{error}</TypographyParagraph>
    </div>
  );
}