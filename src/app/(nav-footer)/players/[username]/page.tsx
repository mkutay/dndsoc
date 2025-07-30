import { errAsync, okAsync } from "neverthrow";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Edit } from "lucide-react";
import Image from "next/image";

import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { Campaigns } from "@/components/players/campaigns";
import { ErrorPage } from "@/components/error-page";
import { getWithImage } from "@/lib/storage";
import { TypographyH2 } from "@/components/typography/headings";
import { AchievementCards } from "@/components/achievement-cards";
import { type ReceivedAchievementsPlayer } from "@/types/full-database.types";
import { PlayerEditSheet } from "@/components/players/player-edit-sheet";
import { Button } from "@/components/ui/button";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { Characters } from "@/components/characters";

export const dynamic = "force-dynamic";

const getPlayerByUsername = ({ username }: { username: string }) =>
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
  );

const getPlayer = cache(getPlayerByUsername);

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
      <PlayerAchievements receivedAchievements={player.received_achievements_player} />
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

const PlayerAchievements = ({ receivedAchievements }: { receivedAchievements: ReceivedAchievementsPlayer[] }) => {
  if (!receivedAchievements || receivedAchievements.length === 0) return null;

  return (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <AchievementCards receivedAchievements={receivedAchievements} />
    </>
  );
};
