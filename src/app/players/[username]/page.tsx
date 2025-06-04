import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { PlayerAchievements } from "@/components/player-achievements-section";
import { PlayerEditButton } from "@/components/players/player-edit-button";
import { Campaigns } from "@/components/players/campaigns";
import { Characters } from "@/components/players/characters";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await DB.Players.Get.Username({ username });
  if (result.isErr()) return { title: "Player Not Found", description: "This player does not exist." };
  const player = result.value;

  const level = player.level;
  const ach = player.received_achievements_player.length;
  const description = `Some statistics about our player ${player.users.name}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Our Player ${player.users.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const result = await DB.Players.Get.Username({ username });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/players/[username]/page.tsx" />;
  const player = result.value;

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/players/[username]/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsPlayer = (player.auth_user_uuid === auth?.auth_user_uuid) || role === "admin";
  const name = player.users.name;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">
          <span className="font-drop-caps mr-0.5">{name.charAt(0)}</span><span>{name.slice(1)}</span>
        </TypographyH1>
        {ownsPlayer && <PlayerEditButton username={username} />}
      </div>
      <TypographyLarge>Level: {player.level}</TypographyLarge>
      {player.about && player.about.length !== 0 && <TypographyLead>{player.about}</TypographyLead>}
      <Characters characters={player.characters} ownsPlayer={ownsPlayer} playerUuid={player.id} />
      <Campaigns playerUuid={player.id} />
      <PlayerAchievements receivedAchievements={player.received_achievements_player} />
    </div>
  );
}

export async function generateStaticParams() {
  const players = await DB.Players.Get.All();
  if (players.isErr()) return [];
  return players.value.map((player) => ({
    username: player.users.username,
  }));
}