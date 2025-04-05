import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetReceivedAchievementsError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type ReceivedAchievement = Tables<"received_achievements">;

export function getReceivedAchievements(ids: string[], user_uuid: string):
  ResultAsync<ReceivedAchievement[], GetReceivedAchievementsError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetReceivedAchievementsError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("received_achievements")
        .select("*")
        .eq("user_uuid", user_uuid)
        .in("achievement_uuid", ids);

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get received achievement data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetReceivedAchievementsError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get received achievement data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetReceivedAchievementsError);
      }
      return okAsync(response.data);
    });

  return result;
}