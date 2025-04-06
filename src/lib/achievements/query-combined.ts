import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetCombinedAchievementsError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type CombinedAchievement = Tables<"achievements"> & {
  received_achievements: Tables<"received_achievements">[];
};

export function getCombinedAchievements(ids: string[]):
  ResultAsync<CombinedAchievement[], GetCombinedAchievementsError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetCombinedAchievementsError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("achievements")
        .select("*, received_achievements(*)")
        .in("id", ids);

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get achievements' data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetCombinedAchievementsError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get achievements' data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCombinedAchievementsError);
      }
      return okAsync(response.data);
    });
    
  return result;
}