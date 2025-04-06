import { TypographyH1, TypographyH2 } from "@/components/typography/headings";
import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { CampaignCards } from "@/components/campaigns";
import { CharacterEditButton } from "@/components/character-edit-button";
import { getCharacterByShortened } from "@/lib/characters/query-shortened";
import { formatClasses, formatRaces } from "@/utils/formattin";

export default async function Page(props: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await props.params;

  const characterResult = await getCharacterByShortened(shortened);

  if (!characterResult.isOk()) {
    return <ErrorPage error={characterResult.error.message} />;
  }

  const character = characterResult.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">{character.name}</TypographyH1>
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