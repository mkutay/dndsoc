import { Player } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";

export const getPlayers = () => 
  runQuery<Player[]>(
    supabase => 
      supabase
        .from("players")
        .select("*, users(*), received_achievements(*, achievements(*))"),
    "getPlayers" // Add the function name for error reporting
  );