import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getCharacterByShortened } from "@/lib/characters/query-shortened";

export default async function Page(props: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await props.params;

  const character = await getCharacterByShortened(shortened);

  if (!character.isOk()) {
    return <ErrorPage error={character.error.message} />;
  }

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Player: {shortened}</TypographyH1>
      <TypographyParagraph>Placeholder for the player page.</TypographyParagraph>
    </div>
  );
}