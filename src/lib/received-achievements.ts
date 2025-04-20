import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type ReceivedAchievementPlayer = Tables<"received_achievements_player">;

export const getReceivedAchievements = (ids: string[], user_uuid: string) =>
  runQuery<ReceivedAchievementPlayer[]>((supabase) => supabase
    .from("received_achievements_player")
    .select("*")
    .eq("user_uuid", user_uuid)
    .in("achievement_uuid", ids)
  )