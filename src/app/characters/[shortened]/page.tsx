import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { CharacterEditButton } from "@/components/character-edit-button";
import { getCharacterPlayerByShortened } from "@/lib/characters/query-shortened";
import { getCharacters } from "@/lib/characters/query-all";
import { formatClasses, formatRaces } from "@/utils/formatting";
import { ErrorPage } from "@/components/error-page";
import { Campaigns } from "./campaigns";

export const dynamicParams = false;
export const dynamic = 'force-dynamic';

export default async function Page({ params }: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await params;
  const result = await getCharacterPlayerByShortened({ shortened });

  if (result.isErr()) return <ErrorPage error={result.error} caller="/characters/[shortened]/page.tsx" isNotFound />;
  const character = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1 items-baseline">
          {character.players && <TypographySmall className="text-muted-foreground">
            Played by <TypographyLink href={`/players/${character.players.users.username}`} variant="muted">{character.players.users.username}</TypographyLink>
          </TypographySmall>}
          <TypographyH1 className="text-primary">{character.name}</TypographyH1>
        </div>
        <CharacterEditButton playerUuid={character.player_uuid} shortened={shortened} />
      </div>
      <TypographyLarge>
        Level {character.level}
        {character.classes.length !== 0 ? " | " + formatClasses(character.classes) : ""}
        {character.races.length !== 0 ? " | " + formatRaces(character.races) : ""}
      </TypographyLarge>
      {character.about && character.about.length !== 0 && <TypographyLead className="mt-2">{character.about}</TypographyLead>}
      <Campaigns campaigns={character.campaigns} />
      {/* Add achievements */}
    </div>
  );
}

export async function generateStaticParams() {
  const characters = await getCharacters();
  if (characters.isErr()) return [];
  return characters.value.map((character) => ({
    shortened: character.shortened,
  }));
}