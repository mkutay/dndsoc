import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type Achievement = Tables<"achievements">;

export const getAchievementsFromIds = (ids: string[]) =>
  runQuery<Achievement[]>((supabase) =>
    supabase
      .from("achievements")
      .select("*")
      .in("id", ids)
  )