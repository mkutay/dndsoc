import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetPlayersError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type Player = Tables<"players">;

export function getPlayers():
  ResultAsync<Player[], GetPlayersError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetPlayersError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("players")
        .select("*");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get player data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetPlayersError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get player data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetPlayersError);
      }
      const playerData = response.data;
      return okAsync(playerData);
    });

  return result;
}