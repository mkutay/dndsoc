import { redirect } from "next/navigation";
import { ResultAsync } from "neverthrow";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { DMForm } from "./form";
import DB from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const role = await DB.Roles.Get.With.User();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/parties/[shortened]" isNotFound />;

  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  if (role.value.role === "player") redirect(`/parties/${shortened}/edit/player`);

  let dmUuid: undefined | string = undefined;
  if (role.value.role !== "admin") {
    const dm = await DB.DMs.Get.With.User();
    if (dm.isErr()) return <ErrorPage error={dm.error} caller="/parties/[shortened]" isNotFound />;

    const hasAccess = party.dm_party.some((dmParty) => dmParty.dms.id === dm.value.id);
    if (!hasAccess) redirect(`/parties/${shortened}`);
    dmUuid = dm.value.id;
  }

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
  
  const all = await ResultAsync.combine([DB.Campaigns.Get.All(), DB.Characters.Get.All(), DB.DMs.Get.All()]);
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

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/parties/${party.shortened}`} variant="muted">
        Go back
      </TypographyLink>
      <TypographyH1>Edit Party <span className="text-primary">{party.name}</span></TypographyH1>
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
        thisDMUuid={dmUuid}
      />
    </div>
  )
}