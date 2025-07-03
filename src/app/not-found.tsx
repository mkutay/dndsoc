import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

export default function NotFound() {
  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-6">
      <TypographyH1>404 - Not Found</TypographyH1>
      <TypographyParagraph>The page you are looking for does not exist, maybe for now.</TypographyParagraph>
    </div>
  );
}
