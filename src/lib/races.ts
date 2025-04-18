import { runQuery } from "@/utils/supabase-run";

export const deleteCharacterRace = ({ characterId }: { characterId: string }) =>
  runQuery((supabase) => supabase
    .from("character_race")
    .delete()
    .eq("character_id", characterId)
  )

export const upsertCharacterRace = ({ raceId, characterId }: { raceId: string, characterId: string }) =>
  runQuery((supabase) => supabase
    .from("character_race")
    .upsert({ character_id: characterId, race_id: raceId }, { ignoreDuplicates: false })
  )

export const upsertRace = ({ race }: { race: string }) =>
  runQuery((supabase) => supabase
    .from("races")
    .upsert({ name: race }, { ignoreDuplicates: false, onConflict: "name" })
    .select("*")
    .single()
  )