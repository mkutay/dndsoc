import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetAchievementsFromIdsError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type Achievement = Tables<"achievements">;

export function getAchievementsFromIds(ids: string[]):
  ResultAsync<Achievement[], GetAchievementsFromIdsError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetAchievementsFromIdsError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("achievements")
        .select("*")
        .in("id", ids);

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get achievements' data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetAchievementsFromIdsError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get achievements' data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetAchievementsFromIdsError);
      }
      return okAsync(response.data);
    });

  return result;
}