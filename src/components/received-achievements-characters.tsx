import Link from "next/link";

import { TypographyH2 } from "./typography/headings";
import { ErrorPage } from "./error-page";
import { type Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

export async function ReceivedAchievementsCharacter({ achievement }: { achievement: Tables<"achievements"> }) {
  if (achievement.type !== "character") return null;

  const result = await getReceivedAchievementsCharacter(achievement.id);
  if (result.isErr()) return <ErrorPage error={result.error} caller="received-achievements-character.tsx" />;
  const characters = result.value;

  if (characters.length === 0) {
    return (
      <div className="font-titles-of-tables text-2xl max-w-prose mt-6">
        No character has unlocked this achievement yet.
        <div className="mt-4">Will your hero be the first to claim this honor?</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2>Received Characters</TypographyH2>
      <div className="flex flex-row flex-wrap gap-4 max-w-xl">
        {characters.map((character) => (
          <Link
            key={character.character_uuid}
            className="p-4 bg-card text-card-foreground rounded-2xl shadow hover:bg-card/80 transition-colors text-lg w-fit font-quotes"
            href={`/characters/${character.characters.shortened}`}
          >
            {character.characters.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

const getReceivedAchievementsCharacter = (id: string) =>
  runQuery((supabase) =>
    supabase.from("received_achievements_character").select("*, characters(*)").eq("achievement_uuid", id),
  );
