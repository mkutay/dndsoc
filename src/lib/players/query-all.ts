import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { Player } from "@/types/full-database.types";

type GetPlayersError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getPlayers = () => 
  createClient()
    .andThen((supabase) => {
      const response = supabase
        .from("players")
        .select("*, users(*), received_achievements(*, achievements(*))");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get player data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetPlayersError));
    })
    .andThen((response) => 
      !response.error
        ? okAsync(response.data as Player[])
        : errAsync({
          message: "Failed to get player data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetPlayersError)
    );