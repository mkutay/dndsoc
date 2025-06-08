import { redirect } from "next/navigation";
import Image from "next/image";

import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { Characters } from "@/components/parties/characters";
import { Campaigns } from "@/components/parties/campaigns";
import { getPublicUrlByUuid } from "@/lib/storage";
import DB from "@/lib/db";
import { EditButton } from "@/components/edit-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return { title: "Party Not Found", description: "This party does not exist." };
  const party = result.value;

  const level = party.level;
  const about = party.about;
  const char = party.character_party.length;
  const description = `${about}${about && ". "}Level ${level} · Has ${char} Character${char === 1 ? "" : "s"}`;
  const title = `Party ${party.name}`;

  const imageUrlResult = party.image_uuid ? await getPublicUrlByUuid({ imageUuid: party.image_uuid }) : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl || "/logo-light.png"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]/page.tsx" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const campaigns = party.party_campaigns.map((partyCampaign) => partyCampaign.campaigns);
  const characters = party.character_party.map((characterParty) => characterParty.characters);

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/parties/[shortened]/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsAs = role === "admin"
    ? "admin" : (dmedBy.some((dm) => dm.auth_user_uuid === auth?.auth_user_uuid)) ? "dm" : (characters.some((character) => character.player_uuid === auth?.players.id)) ? "player" : null;

  const allCampaigns = (ownsAs === "dm" || ownsAs === "admin") ? await getAllCampaigns() : undefined;
  const allCharacters = (ownsAs === "dm" || ownsAs === "admin") ? await getAllCharacters() : undefined;

  const imageUrlResult = party.image_uuid ? await getPublicUrlByUuid({ imageUuid: party.image_uuid, transform: {
    width: 1600,
    height: 1000,
    resize: "cover",
  } }) : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex flex-col gap-6">
        {imageUrl ? <Image
          src={imageUrl}
          alt={`Image of ${party.name}`}
          width={1600}
          height={1000}
          className="rounded-lg max-w-2xl mx-auto object-cover"
        /> : <div className="rounded-lg bg-border max-w-2xl w-full mx-auto h-[400px]"></div>}
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          {dmedBy.length !== 0 && <TypographySmall className="text-muted-foreground">
            DM&apos;ed By {dmedBy.map((dm, index) => (
              <TypographyLink key={index} href={`/dms/${dm.users.username}`} variant="muted">
                {dm.users.name}{index + 1 < dmedBy.length ? ", " : ""}
              </TypographyLink>
            ))}
          </TypographySmall>}
          <h1 className="text-primary font-extrabold text-5xl font-headings tracking-wide flex flex-row items-start">
            <div className="font-drop-caps text-7xl font-medium">{party.name[0]}</div>
            <div>{party.name.slice(1)}</div>
          </h1>
          <TypographyLarge>Level: {party.level}</TypographyLarge>
          {party.about && party.about.length !== 0 && <TypographyLead>{party.about}</TypographyLead>}
          {ownsAs && <EditButton href={`/parties/${shortened}/edit/${ownsAs === "admin" ? "dm" : ownsAs}`} />}
        </div>
      </div>
      <Characters characters={characters} ownsAs={ownsAs} partyId={party.id} allCharacters={allCharacters} />
      <Campaigns campaigns={campaigns} ownsAs={ownsAs} partyId={party.id} allCampaigns={allCampaigns} />
      {/* <PlayerAchievements receivedAchievements={player.received_achievements_player} /> */}
    </div>
  );
}

async function getAllCharacters() {
  const allCharacters = await DB.Characters.Get.All();
  if (allCharacters.isErr()) redirect("/error?error=" + allCharacters.error.message);
  return allCharacters.value;
}

async function getAllCampaigns() {
  const allCampaigns = await DB.Campaigns.Get.All();
  if (allCampaigns.isErr()) redirect("/error?error=" + allCampaigns.error.message);
  return allCampaigns.value;
}