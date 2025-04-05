import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getCharacters } from "@/lib/characters/query-all";

export default async function Page() {
  const characters = await getCharacters();
  if (!characters.isOk()) return <ErrorPage error={characters.error.message} />;

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Characters</TypographyH1>
      <TypographyParagraph>Placeholder for the characters page, where each character will be shown with a card: {characters.value.length}</TypographyParagraph>
    </div>
  );
}