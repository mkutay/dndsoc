import { notFound } from "next/navigation";

import { TypographyLarge, TypographyLead, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH1, TypographyH2 } from "@/components/typography/headings";
import { CharacterEditButton } from "@/components/character-edit-button";
import { CampaignCards } from "@/components/campaigns-cards";
import { getCharacterByShortened } from "@/lib/characters/query-shortened";
import { getCharacters } from "@/lib/characters/query-all";
import { formatClasses, formatRaces } from "@/utils/formatting";
import { getPlayerByUuid } from "@/lib/players/query-uuid";

export const dynamicParams = false;
export const dynamic = 'force-dynamic';

export default async function Page({ params }: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await params;
  const characterResult = await getCharacterByShortened({ shortened });

  if (characterResult.isErr()) {
    console.error(`Failed to get character data: ${characterResult.error.message}`);
    notFound();
  }
  const character = characterResult.value;

  const player = await getPlayerByUuid({
    uuid: character.player_uuid || "",
  });
  

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4 items-baseline">
          <TypographyH1 className="text-primary">{character.name}</TypographyH1>
          {player.isOk() && <TypographySmall className="text-muted-foreground">
            Played by {player.value.users.username}
          </TypographySmall>}
        </div>
        <CharacterEditButton playerUuid={character.player_uuid} shortened={shortened} />
      </div>
      <TypographyLarge>Level {character.level} | {formatClasses(character.classes)} | {formatRaces(character.races)}</TypographyLarge>
      {character.about && character.about.length !== 0 && <TypographyLead className="mt-2">{character.about}</TypographyLead>}
      {character.campaigns && character.campaigns.length != 0 && <>
        <TypographyH2 className="mt-6">Campaigns</TypographyH2>
        <CampaignCards campaigns={character.campaigns} />
      </>}
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