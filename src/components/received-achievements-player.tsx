import Link from "next/link";

import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";
import { TypographyH2 } from "./typography/headings";
import { ErrorPage } from "./error-page";

export async function ReceivedAchievementsPlayer({ achievement }: { achievement: Tables<"achievements"> }) {
  if (achievement.type !== "player") return null;

  const result = await getReceivedAchievementsPlayer(achievement.id);
  if (result.isErr()) return <ErrorPage error={result.error} caller="received-achievements-player.tsx" />;
  const players = result.value;

  if (players.length === 0) {
    return (
      <div className="font-titles-of-tables text-2xl max-w-prose mt-6">
        The halls echo with silence... No brave adventurer has claimed this achievement yet.
        <div className="mt-4">Perhaps your legend shall be the first inscribed here?</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2>Received Players</TypographyH2>
      <div className="flex flex-row flex-wrap gap-4 max-w-xl">
        {players.map((player) => (
          <Link key={player.player_uuid} className="p-4 bg-card text-card-foreground rounded-2xl shadow hover:bg-card/80 transition-colors text-lg w-fit font-quotes" href={`/players/${player.players.users.username}`}>
            {player.players.users.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

const getReceivedAchievementsPlayer = (id: string) => runQuery((supabase) => supabase
  .from("received_achievements_player")
  .select("*, players(*, users!inner(*))")
  .eq("achievement_uuid", id)
);