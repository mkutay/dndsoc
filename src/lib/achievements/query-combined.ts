import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type CombinedAchievement = Tables<"achievements"> & {
  received_achievements: Tables<"received_achievements">[];
};

export const getCombinedAchievements = (ids: string[]) =>
  runQuery<CombinedAchievement[]>((supabase) =>
    supabase
      .from("achievements")
      .select("*, received_achievements(*)")
      .in("id", ids)
  )