import { Player } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";

export const getPlayerByUsername = ({ username }: { username: string }) =>
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .select(`*, users!inner(*), received_achievements_player(*, achievements(*))`)
      .eq("users.username", username)
      .single()
  )