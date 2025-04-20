import { runQuery } from "@/utils/supabase-run";

export const getCharactersByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
  runQuery((supabase) => supabase
    .from("characters")
    .select(`*`)
    .eq("player_uuid", playerUuid)
  )