import { runQuery } from "@/utils/supabase-run";

export const upsertCharacterRace = ({ raceId, characterId }: { raceId: string, characterId: string }) =>
  runQuery((supabase) => supabase
    .from("character_race")
    .upsert({ character_id: characterId, race_id: raceId }, { ignoreDuplicates: false })
  )