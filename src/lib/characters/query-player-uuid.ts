import { Character } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";

export const getCharactersByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
  runQuery<Character[]>((supabase) => supabase
    .from("characters")
    .select(`*, races(*), classes(*), campaigns(*)`)
    .eq("player_uuid", playerUuid)
  )