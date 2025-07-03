import { errAsync, okAsync } from "neverthrow";
import { Dot } from "lucide-react";
import Image from "next/image";
import { cache } from "react";

import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { formatClasses, formatRaces } from "@/utils/formatting";
import { ErrorPage } from "@/components/error-page";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaign-cards";
import { getPublicUrlByUuid } from "@/lib/storage";
import { EditButton } from "@/components/edit-button";
import { getCharacterPlayerByShortened } from "@/lib/characters";
import { getPlayerRoleUser } from "@/lib/players";
import { runQuery } from "@/utils/supabase-run";
import { type ReceivedAchievementsCharacter } from "@/types/full-database.types";
import { AchievementCards } from "@/components/achievement-cards";
import { PartyCard } from "@/components/party-card";

export const dynamic = "force-dynamic";

const cachedGetCharacter = cache(getCharacterPlayerByShortened);
const cachedGetPublicUrlByUuid = cache(getPublicUrlByUuid);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetCharacter({ shortened });
  if (result.isErr()) return { title: "Character Not Found", description: "This character does not exist." };
  const character = result.value;

  const level = character.level;
  const classes = character.classes;
  const races = character.races;
  const name = character.name;
  const description = `Some statistics about character ${name}: Level ${level} · ${formatClasses(classes)} · ${formatRaces(races)}`;
  const title = `Character ${name}`;

  const imageUrlResult = character.image_uuid
    ? await cachedGetPublicUrlByUuid({ imageUuid: character.image_uuid })
    : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl ?? "/logo-light.png"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetCharacter({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/characters/[shortened]/page.tsx" isNotFound />;
  const character = result.value;

  const combinedAuth = await getPlayerRoleUser();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN")
    return <ErrorPage error={combinedAuth.error} caller="/characters/[shortened]/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsCharacter = character.player_uuid === auth?.players.id || role === "admin";

  const imageUrlResult = character.image_uuid
    ? await cachedGetPublicUrlByUuid({ imageUuid: character.image_uuid })
    : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  const parties = Array.from(new Set(character.character_party.map((party) => party.parties)));

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Image of ${character.name}`}
            width={144}
            height={144}
            className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto object-cover border-border border-2"
          />
        ) : (
          <div className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto bg-border rounded-full"></div>
        )}
        <div className="flex flex-col max-w-prose gap-1.5 mt-3">
          <div className="flex flex-col gap-1">
            {character.players ? (
              <TypographySmall className="text-muted-foreground">
                Played By{" "}
                <TypographyLink href={`/players/${character.players.users.username}`} variant="muted">
                  {character.players.users.name}
                </TypographyLink>
              </TypographySmall>
            ) : null}
            <h1 className="text-primary text-5xl font-extrabold font-headings tracking-wide flex flex-row items-start">
              <div className="font-drop-caps text-7xl font-medium">{character.name.charAt(0)}</div>
              <div>{character.name.slice(1)}</div>
            </h1>
          </div>
          <div className="flex flex-row">
            <TypographyLarge>Level {character.level}</TypographyLarge>
            {(character.classes.length !== 0 || character.races.length !== 0) && <Dot className="mt-px" />}
            {character.classes.length !== 0 && <TypographyLarge>{formatClasses(character.classes)}</TypographyLarge>}
            {character.classes.length !== 0 && character.races.length !== 0 && <Dot className="mt-px" />}
            {character.races.length !== 0 && <TypographyLarge>{formatRaces(character.races)}</TypographyLarge>}
          </div>
          {character.about && character.about.length !== 0 ? (
            <TypographyLead className="indent-6">{character.about}</TypographyLead>
          ) : null}
          {ownsCharacter ? <EditButton href={`/characters/${shortened}/edit`} /> : null}
        </div>
      </div>
      <CharacterAchievements receivedAchievements={character.received_achievements_character} />
      <Campaigns characterUuid={character.id} />
      <TypographyH2 className="mt-6">Parties</TypographyH2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {parties.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
    </div>
  );
}

export const CharacterAchievements = ({
  receivedAchievements,
}: {
  receivedAchievements: ReceivedAchievementsCharacter[];
}) => {
  if (!receivedAchievements || receivedAchievements.length === 0) return null;

  return (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <AchievementCards receivedAchievements={receivedAchievements} />
    </>
  );
};

async function Campaigns({ characterUuid }: { characterUuid: string }) {
  const notFound = <TypographyH2 className="mt-6">No campaigns found</TypographyH2>;

  const campaigns = await getCampaignsByCharacterUuid({ characterUuid });
  if (campaigns.isErr()) {
    return campaigns.error.code === "NOT_FOUND" ? (
      notFound
    ) : (
      <ErrorComponent error={campaigns.error} caller="/characters/[username]/campaigns.tsx" />
    );
  }
  if (campaigns.value.length === 0) {
    return notFound;
  }

  return (
    <>
      <TypographyH2 className="mt-6">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns.value} />
    </>
  );
}

export const getCampaignsByCharacterUuid = ({ characterUuid }: { characterUuid: string }) =>
  runQuery(
    (supabase) =>
      supabase
        .from("parties")
        .select(`*, party_campaigns!inner(*, campaigns(*)), character_party!inner(*, characters!inner(*))`)
        .eq("character_party.characters.id", characterUuid),
    "getCampaignsByCharacterUuid",
  )
    .andThen((data) =>
      data.length === 0
        ? errAsync({
            message: `No campaigns found for character with UUID ${characterUuid}`,
            code: "NOT_FOUND" as const,
          })
        : okAsync(data),
    )
    .map((parties) =>
      parties.flatMap((party) =>
        party.party_campaigns.map((partyCampaign) => ({
          ...partyCampaign.campaigns,
        })),
      ),
    )
    .map((campaigns) => {
      // Remove duplicates based on campaign id
      const uniqueCampaigns = new Map<string, (typeof campaigns)[0]>();
      campaigns.forEach((campaign) => {
        if (!uniqueCampaigns.has(campaign.id)) {
          uniqueCampaigns.set(campaign.id, campaign);
        }
      });
      return Array.from(uniqueCampaigns.values());
    });
