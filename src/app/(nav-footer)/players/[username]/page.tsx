import { errAsync, okAsync } from "neverthrow";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Edit } from "lucide-react";
import Image from "next/image";

import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getWithImage } from "@/lib/storage";
import { TypographyH2 } from "@/components/typography/headings";
import { AchievementCards } from "@/components/achievements/achievement-cards";
import { type ReceivedAchievementsPlayer } from "@/types/full-database.types";
import { PlayerEditSheet } from "@/components/player-edit-sheet";
import { Button } from "@/components/ui/button";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { Characters } from "@/components/characters";
import type { Enums } from "@/types/database.types";
import { CampaignCards } from "@/components/campaign-cards";

export const dynamic = "force-dynamic";

const getPlayer = cache(({ username }: { username: string }) =>
  runQuery(
    (supabase) =>
      supabase
        .from("players")
        .select(
          `*, users!inner(*), received_achievements_player(*, achievements(*)), characters(*, races(*), classes(*)), images(*)`,
        )
        .eq("users.username", username)
        .single(),
    "getPlayerByUsername",
  ),
);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await getPlayer({ username }).andThen(getWithImage);
  if (result.isErr()) return { title: "Player Not Found", description: "This player does not exist." };
  const { data: player, url } = result.value;

  const level = player.level;
  const ach = player.received_achievements_player.length;
  const description = `Some statistics about player ${player.users.name}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Player ${player.users.name}`;

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

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getPlayer({ username })
    .andThen(getWithImage)
    .andThen((result) =>
      getUserRole()
        .orElse((error) => (error.code === "NOT_LOGGED_IN" ? okAsync(null) : errAsync(error)))
        .map((user) => ({ ...result, user })),
    );

  if (result.isErr()) return <ErrorPage error={result.error} caller="/players/[username]/page.tsx" />;
  const { data: player, url, user } = result.value;

  const ownsPlayer = player.auth_user_uuid === user?.auth_user_uuid || user?.role === "admin";

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {url ? (
          <Image
            src={url}
            alt={`Image of ${player.users.name}`}
            width={144}
            height={144}
            className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto object-cover border-border border-2"
          />
        ) : (
          <div className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto bg-border rounded-full"></div>
        )}
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          <h1 className="text-primary flex flex-row font-extrabold text-5xl font-headings tracking-wide items-start">
            <div className="font-drop-caps text-7xl font-medium">{player.users.name.charAt(0)}</div>
            <div>{player.users.name.slice(1)}</div>
          </h1>
          <TypographyLarge className="-mt-1.5">Level: {player.level}</TypographyLarge>
          {player.about && player.about.length !== 0 ? (
            <TypographyLead className="indent-6">{player.about}</TypographyLead>
          ) : null}
          {ownsPlayer ? (
            <PlayerEditSheet player={{ about: player.about, id: player.id }} path={`/players/${username}`}>
              <Button variant="outline" type="button" className="w-fit mt-1.5">
                <Edit className="w-5 h-5 mr-2" /> Edit
              </Button>
            </PlayerEditSheet>
          ) : null}
        </div>
      </div>
      <PlayerAchievements
        receivedAchievements={player.received_achievements_player}
        role={user?.role ?? null}
        playerId={player.id}
        username={username}
        ownsPlayer={player.auth_user_uuid === user?.auth_user_uuid}
      />
      <div className="flex flex-col mt-6 space-y-6">
        <TypographyH2>Characters</TypographyH2>
        <Characters characters={player.characters} playerId={ownsPlayer ? player.id : undefined} />
      </div>
      <Suspense>
        <Campaigns playerUuid={player.id} />
      </Suspense>
    </div>
  );
}

const PlayerAchievements = async ({
  receivedAchievements,
  role,
  playerId,
  username,
  ownsPlayer,
}: {
  receivedAchievements: ReceivedAchievementsPlayer[];
  role: Enums<"role"> | null;
  playerId: string;
  username: string;
  ownsPlayer: boolean;
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
        .select("*, requested:achievement_requests_player(*)")
        .eq("achievement_requests_player.player_id", playerId)
        .eq("type", "player")
        .order("name", { ascending: true }),
    );

    if (achievements.isErr()) return normal;

    return (
      <>
        <TypographyH2 className="mt-6">Achievements</TypographyH2>
        <AchievementCards
          receivedAchievements={receivedAchievements}
          achievements={achievements.value}
          receiverId={playerId}
          receiverType="player"
          path={`/players/${username}`}
          owns="super"
        />
      </>
    );
  } else if (ownsPlayer) {
    const achievements = await runQuery((supabase) =>
      supabase
        .from("achievements")
        .select("*, requested:achievement_requests_player(*)")
        .eq("achievement_requests_player.player_id", playerId)
        .eq("type", "player")
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
          receiverId={playerId}
          receiverType="player"
          path={`/players/${username}`}
          owns="self"
        />
      </>
    );
  }

  return normal;
};

async function Campaigns({ playerUuid }: { playerUuid: string }) {
  const result = await getCampaignsByPlayerUuid({ playerUuid });
  if (result.isErr()) {
    return result.error.code === "NOT_FOUND" ? <TypographyH2 className="mt-8">No campaigns found</TypographyH2> : null;
  }
  const campaigns = result.value;

  return (
    <>
      <TypographyH2 className="mt-8">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} />
    </>
  );
}

const getCampaignsByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
  runQuery(
    (supabase) =>
      supabase
        .from("parties")
        .select(`*, party_campaigns!inner(*, campaigns(*)), character_party!inner(*, characters!inner(*))`)
        .eq("character_party.characters.player_uuid", playerUuid),
    "getCampaignsByPlayerUuid",
  )
    .andThen((data) =>
      data.length === 0
        ? errAsync({
            message: `No campaigns found for player with UUID ${playerUuid}`,
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
