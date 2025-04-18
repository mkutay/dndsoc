import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type ReceivedAchievement = Tables<"received_achievements">;

export const getReceivedAchievements = (ids: string[], user_uuid: string) =>
  runQuery<ReceivedAchievement[]>((supabase) => supabase
    .from("received_achievements")
    .select("*")
    .eq("user_uuid", user_uuid)
    .in("achievement_uuid", ids)
  )