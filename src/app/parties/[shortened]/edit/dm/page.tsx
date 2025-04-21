import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { getPartyByShortened } from "@/lib/parties";
import { getUserRole } from "@/lib/roles";
import { getDMs, getDMUser } from "@/lib/dms";
import { DMForm } from "./form";
import { getCampaigns } from "@/lib/campaigns";
import { ResultAsync } from "neverthrow";
import { getCharacters } from "@/lib/characters/query-all";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/parties/[shortened]" isNotFound />;

  const result = await getPartyByShortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  const currentCampaigns = party.party_campaigns.map((partyCampaign) => partyCampaign.campaigns);
  const currentCharacters = party.character_party.map((characterParty) => characterParty.characters);
  const currentDMs = party.dm_party
    .map((dmParty) => dmParty.dms)
    .map((dm) => ({
      username: dm.users.username,
      about: dm.about,
      level: dm.level,
      id: dm.id,
    }));
  
  const all = await ResultAsync.combine([getCampaigns(), getCharacters(), getDMs()]);
  if (all.isErr()) return <ErrorPage error={all.error} caller="/parties/[shortened]" isNotFound />;
  const dms = all.value[2].map((dm) => ({
    username: dm.users.username,
    about: dm.about,
    level: dm.level,
    id: dm.id,
  }));
  const campaigns = all.value[0];
  const characters = all.value[1].map((character) => ({
    about: character.about,
    id: character.id,
    level: character.level,
    name: character.name,
    player_uuid: character.player_uuid,
    shortened: character.shortened,
    players: {
      about: character.players.about,
      id: character.players.id,
      level: character.players.level,
      username: character.players.users.username,
    }
  }));

  if (role.value.role === "player") redirect(`/parties/${shortened}/edit/player`);

  const dm = await getDMUser();
  if (dm.isErr()) return <ErrorPage error={dm.error} caller="/parties/[shortened]" isNotFound />;

  const hasAccess = party.dm_party.some((dmParty) => dmParty.dms.id === dm.value.id);
  if (!hasAccess) redirect(`/parties/${shortened}`);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Edit Your Party</TypographyH1>
      <DMForm
        about={party.about}
        name={party.name}
        level={party.level}
        partyUuid={party.id}
        currentCharacters={currentCharacters}
        currentCampaigns={currentCampaigns}
        currentDMs={currentDMs}
        characters={characters}
        campaigns={campaigns}
        DMs={dms}
        thisDMUuid={dm.value.id}
      />
    </div>
  )
}