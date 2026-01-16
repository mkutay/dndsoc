import { errAsync, okAsync } from "neverthrow";
import { TiPencil } from "react-icons/ti";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Dot } from "lucide-react";
import Image from "next/image";

import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { formatList } from "@/utils/formatting";
import { ErrorPage } from "@/components/error-page";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaign-cards";
import { getWithImage } from "@/lib/storage";
import { getPlayerRoleUser } from "@/lib/players";
import { runQuery } from "@/utils/supabase-run";
import { type ReceivedAchievementsCharacter } from "@/types/full-database.types";
import { AchievementCards } from "@/components/achievements/achievement-cards";
import { PartyCard } from "@/components/party-card";
import { CharacterThingies } from "@/app/(nav-footer)/characters/[shortened]/_components/character-thingies";
import { EditCharacterSheet } from "@/components/edit-character-sheet";
import { Button } from "@/components/ui/button";
import type { Enums } from "@/types/database.types";

export const dynamic = "force-dynamic";

const getCharacterPlayerByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("characters")
      .select(
        "*, races(*), classes(*), players(*, users(*)), received_achievements_character(*, achievements(*)), character_party(*, parties(*)), images(*)",
      )
      .eq("shortened", shortened)
      .single(),
  );

const getCharacter = cache(getCharacterPlayerByShortened);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await getCharacter({ shortened }).andThen(getWithImage);
  if (result.isErr()) return { title: "Character Not Found", description: "This character does not exist." };
  const { data: character, url } = result.value;

  const level = character.level;
  const classes = character.classes;
  const races = character.races;
  const name = character.name;
  const description = `Some statistics about character ${name}: Level ${level} · ${formatList(classes)} · ${formatList(races)}`;
  const title = `Character ${name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [url ?? "/logo-light.png"],
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ shortened: string }>;
  searchParams: Promise<{ edit: string | null }>;
}) {
  const { shortened } = await params;
  const { edit } = await searchParams;
  const result = await getCharacter({ shortened })
    .andThen(getWithImage)
    .andThen((result) =>
      getPlayerRoleUser()
        .orElse((error) => (error.code === "NOT_LOGGED_IN" ? okAsync(null) : errAsync(error)))
        .map((user) => ({ ...result, user })),
    );
  if (result.isErr()) return <ErrorPage error={result.error} caller="/characters/[shortened]/page.tsx" isNotFound />;
  const { data: character, url, user } = result.value;

  const ownsCharacter = character.player_uuid === user?.players.id || user?.roles.role === "admin";
  const parties = Array.from(new Set(character.character_party.map((party) => party.parties)));

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {url ? (
          <Image
            src={url}
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
          <div className="flex flex-row -mt-1">
            <TypographyLarge>Level {character.level}</TypographyLarge>
            {(character.classes.length !== 0 || character.races.length !== 0) && <Dot className="mt-px" />}
            {character.classes.length !== 0 && <TypographyLarge>{formatList(character.classes)}</TypographyLarge>}
            {character.classes.length !== 0 && character.races.length !== 0 && <Dot className="mt-px" />}
            {character.races.length !== 0 && <TypographyLarge>{formatList(character.races)}</TypographyLarge>}
          </div>
          {character.about && character.about.length !== 0 ? (
            <TypographyLead className="indent-6">{character.about}</TypographyLead>
          ) : null}
          {ownsCharacter ? (
            <EditCharacterSheet
              path={`/characters/${character.shortened}`}
              character={{
                races: character.races,
                classes: character.classes,
                about: character.about,
                level: character.level,
                id: character.id,
              }}
              edit={edit === "true"}
            >
              <Button variant="outline" size="default" className="w-fit mt-1.5">
                <TiPencil size={24} className="mr-2" /> Edit
              </Button>
            </EditCharacterSheet>
          ) : null}
        </div>
      </div>
      <Suspense>
        <CharacterAchievements
          receivedAchievements={character.received_achievements_character}
          role={user?.roles.role ?? null}
          characterId={character.id}
          shortened={character.shortened}
          ownsCharacter={character.player_uuid === user?.players.id}
        />
      </Suspense>
      <TypographyH2 className="mt-6">Parties</TypographyH2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {parties.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
      <Suspense>
        <CharacterThingies ownsCharacter={ownsCharacter} characterUuid={character.id} />
      </Suspense>
      <Suspense>
        <Campaigns characterUuid={character.id} />
      </Suspense>
    </div>
  );
}

const CharacterAchievements = async ({
  receivedAchievements,
  role,
  characterId,
  shortened,
  ownsCharacter,
}: {
  receivedAchievements: ReceivedAchievementsCharacter[];
  role: Enums<"role"> | null;
  characterId: string;
  shortened: string;
  ownsCharacter: boolean;
}) => {
  if (receivedAchievements.length === 0 && role !== "admin" && role !== "dm") return null;

  const normal = (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <AchievementCards receivedAchievements={receivedAchievements} owns="outsider" />
    </>
  );

  if (role === "admin" || role === "dm") {
    const achievements = await runQuery((supabase) =>
      supabase
        .from("achievements")
        .select("*, requested:achievement_requests_character(*)")
        .eq("achievement_requests_character.character_id", characterId)
        .eq("type", "character")
        .order("name", { ascending: true }),
    );

    if (achievements.isErr()) return normal;

    return (
      <>
        <TypographyH2 className="mt-6">Achievements</TypographyH2>
        <AchievementCards
          receivedAchievements={receivedAchievements}
          achievements={achievements.value}
          receiverId={characterId}
          receiverType="character"
          path={`/characters/${shortened}`}
          owns="super"
        />
      </>
    );
  } else if (ownsCharacter) {
    const achievements = await runQuery((supabase) =>
      supabase
        .from("achievements")
        .select("*, requested:achievement_requests_character(*)")
        .eq("achievement_requests_character.character_id", characterId)
        .eq("type", "character")
        .eq("is_hidden", false)
        .order("name", { ascending: true }),
    );

    if (achievements.isErr()) return normal;

    return (
      <>
        <TypographyH2 className="mt-6">Achievements</TypographyH2>
        <AchievementCards
          receivedAchievements={receivedAchievements}
          achievements={achievements.value}
          receiverId={characterId}
          receiverType="character"
          path={`/characters/${shortened}`}
          owns="self"
        />
      </>
    );
  }

  return normal;
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

const getCampaignsByCharacterUuid = ({ characterUuid }: { characterUuid: string }) =>
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
