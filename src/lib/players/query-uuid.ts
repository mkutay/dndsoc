import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetPlayerByUuidError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
};

type Player = Tables<"players">;

export function getPlayerByUuid(uuid: string):
  ResultAsync<Player, GetPlayerByUuidError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetPlayerByUuidError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("players")
        .select("*")
        .eq("user_uuid", uuid)
        .single();

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get player data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetPlayerByUuidError));
    })
    .andThen((response) => {
      if (response.error) {
        // Check for not found specifically
        if (response.error.code === 'PGRST116') {
          return errAsync({
            message: `Player with user UUID not found`,
            code: "NOT_FOUND",
          } as GetPlayerByUuidError);
        }
        return errAsync({
          message: "Failed to get player data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetPlayerByUuidError);
      }
      const playerData = response.data;
      if (!playerData) {
        return errAsync({
          message: "Player data not found.",
          code: "NOT_FOUND",
        } as GetPlayerByUuidError);
      }
      return okAsync(playerData);
    });

  return result;
}