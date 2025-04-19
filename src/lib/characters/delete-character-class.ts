import { runQuery } from "@/utils/supabase-run";

export const deleteCharacterClass = ({ characterId }: { characterId: string; }) => 
  runQuery((supabase) =>
    supabase
      .from("character_class")
      .delete()
      .eq("character_id", characterId),
    "deleteCharacterClass"
  )