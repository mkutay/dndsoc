import { redirect } from "next/navigation";
import { ResultAsync } from "neverthrow";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { DMForm } from "./form";
import DB from "@/lib/db";
import { UploadWrapper } from "./upload-wrapper";

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return { title: "Party Not Found", description: "This party does not exist." };
  const party = result.value;

  const level = party.level;
  const about = party.about;
  const char = party.character_party.length;
  const description = `${about}${about && ". "}Level ${level} · Has ${char} Character${char === 1 ? "" : "s"}`;
  const title = `Edit Party ${party.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]/edit/dm/page.tsx" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const characteredBy = party.character_party.map((characterParty) => characterParty.characters);

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/parties/[shortened]/edit/dm/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const dmUuid = dmedBy.find((dm) => dm.auth_user_uuid === auth?.auth_user_uuid)?.id;
  const ownsAs = (dmUuid || role === "admin")
  ? "dm"
  : ((characteredBy.some((character) => character.player_uuid === auth?.players.id)) ? "player" : null);
  
  if (ownsAs === "player") {
    redirect(`/parties/${shortened}/edit/player`);
  } else if (ownsAs === null) {
    redirect(`/parties/${shortened}`);
  }

  const currentCampaigns = party.party_campaigns.map((partyCampaign) => partyCampaign.campaigns);
  const currentCharacters = party.character_party.map((characterParty) => characterParty.characters);
  const currentDMs = party.dm_party
    .map((dmParty) => dmParty.dms)
    .map((dm) => ({
      username: dm.users.username,
      name: dm.users.name,
      about: dm.about,
      level: dm.level,
      id: dm.id,
    }));
  
  const all = await ResultAsync.combine([DB.Campaigns.Get.All(), DB.Characters.Get.All(), DB.DMs.Get.All()]);
  if (all.isErr()) return <ErrorPage error={all.error} caller="/parties/[shortened]/edit/dm/page.tsx" />;
  const dms = all.value[2].map((dm) => ({
    username: dm.users.username,
    name: dm.users.name,
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
      name: character.players.users.name,
    }
  }));

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLink href={`/parties/${party.shortened}`} variant="muted" className="tracking-wide font-quotes">
        Go Back
      </TypographyLink>
      <TypographyH1>Edit Party <span className="text-primary">{party.name}</span></TypographyH1>
      <UploadWrapper partyId={party.id} partyShortened={party.shortened} />
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