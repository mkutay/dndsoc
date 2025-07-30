import type { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";

import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { Characters } from "@/components/players/characters";
import { Campaigns } from "@/components/players/campaigns";
import { ErrorPage } from "@/components/error-page";
import { getPublicUrlByUuid } from "@/lib/storage";
import { TypographyH2 } from "@/components/typography/headings";
import { AchievementCards } from "@/components/achievement-cards";
import { getPlayerByUsername, getPlayerRoleUser } from "@/lib/players";
import { type ReceivedAchievementsPlayer } from "@/types/full-database.types";
import { PlayerEditSheet } from "@/components/players/player-edit-sheet";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const cachedGetPlayer = cache(getPlayerByUsername);
const cachedGetPublicUrlByUuid = cache(getPublicUrlByUuid);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await cachedGetPlayer({ username });
  if (result.isErr()) return { title: "Player Not Found", description: "This player does not exist." };
  const player = result.value;

  const level = player.level;
  const ach = player.received_achievements_player.length;
  const description = `Some statistics about player ${player.users.name}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Player ${player.users.name}`;

  const imageUrlResult = player.image_uuid ? await cachedGetPublicUrlByUuid({ imageUuid: player.image_uuid }) : null;
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

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await cachedGetPlayer({ username });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/players/[username]/page.tsx 1" />;
  const player = result.value;

  const combinedAuth = await getPlayerRoleUser();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN")
    return <ErrorPage error={combinedAuth.error} caller="/players/[username]/page.tsx 2" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsPlayer = player.auth_user_uuid === auth?.auth_user_uuid || role === "admin";

  const name = player.users.name;

  const imageUrlResult = player.image_uuid ? await cachedGetPublicUrlByUuid({ imageUuid: player.image_uuid }) : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {imageUrl ? (
          <Image
            src={imageUrl}
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
            <div className="font-drop-caps text-7xl font-medium">{name.charAt(0)}</div>
            <div>{name.slice(1)}</div>
          </h1>
          <TypographyLarge>Level: {player.level}</TypographyLarge>
          {player.about && player.about.length !== 0 ? (
            <TypographyLead className="indent-6">{player.about}</TypographyLead>
          ) : null}
          {ownsPlayer ? (
            <PlayerEditSheet player={{ about: player.about, id: player.id }} path={`/players/${username}`}>
              <Button variant="outline" type="button" className="w-fit">
                Edit
              </Button>
            </PlayerEditSheet>
          ) : null}
        </div>
      </div>
      <Characters characters={player.characters} ownsPlayer={ownsPlayer} playerUuid={player.id} />
      <PlayerAchievements receivedAchievements={player.received_achievements_player} />
      <Campaigns playerUuid={player.id} />
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
