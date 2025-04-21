import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { PlayerAchievements } from "@/components/player-achievements-section";
import { getPlayerByUsername } from "@/lib/players/query-username";
import { getPlayers } from "@/lib/players/query-all";
import { PlayerEditButton } from "./player-edit-button";
import { Campaigns } from "./campaigns";
import { Characters } from "./characters";

export const dynamic = "force-dynamic";

export default async function Page({ params }: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const playerData = await getPlayerByUsername({ username });
  if (playerData.isErr()) {
    return <ErrorPage error={playerData.error} caller="/players/[username]" />;
  }
  const player = playerData.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">{username}</TypographyH1>
        <PlayerEditButton authUserUuid={player.auth_user_uuid} username={username} />
      </div>
      <TypographyLarge>Level: {player.level}</TypographyLarge>
      {player.about && player.about.length !== 0 && <TypographyLead>{player.about}</TypographyLead>}
      <Characters playerUuid={player.id} />
      <Campaigns player={player} />
      <PlayerAchievements receivedAchievements={player.received_achievements_player} />
    </div>
  );
}

export async function generateStaticParams() {
  const players = await getPlayers();
  if (players.isErr()) return [];
  return players.value.map((player) => ({
    username: player.users.username,
  }));
}