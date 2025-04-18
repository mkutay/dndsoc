import { runQuery } from "@/utils/supabase-run";

export const deleteCharacterRace = ({ characterId }: { characterId: string }) =>
  runQuery((supabase) => supabase
    .from("character_race")
    .delete()
    .eq("character_id", characterId)
  )