import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

export default function Page() {
  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Players</TypographyH1>
      <TypographyParagraph>Placeholder for the players page, where each player will be shown with a card.</TypographyParagraph>
    </div>
  );
}