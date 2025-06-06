import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type Achievement = Tables<"achievements">;
type CombinedAchievement = Achievement & {
  received_achievements_player: Tables<"received_achievements_player">[];
};

export const getAchievementsFromIds = (ids: string[]) =>
  runQuery<Achievement[]>((supabase) =>
    supabase
      .from("achievements")
      .select("*")
      .in("id", ids)
  )

export const getCombinedAchievements = (ids: string[]) =>
  runQuery<CombinedAchievement[]>((supabase) =>
    supabase
      .from("achievements")
      .select("*, received_achievements_player(*)")
      .in("id", ids)
  )