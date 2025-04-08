import { TypographyH1 } from "./typography/headings";
import { TypographyParagraph } from "./typography/paragraph";

export function ErrorPage({ error }: { error: string }) {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Error</TypographyH1>
      <TypographyParagraph>{error}</TypographyParagraph>
    </div>
  );
}