import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetPlayerWithUserError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
};

type PlayerUser = Tables<"players"> & {
  users: Tables<"users">;
};

export function getPlayerWithUser(uuid: string):
  ResultAsync<PlayerUser, GetPlayerWithUserError> {

  const supabase = createClient();

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("players")
        .select("*, users(*)")
        .eq("user_uuid", uuid)
        .single();

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get player with users data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetPlayerWithUserError));
    })
    .andThen((response) => {
      if (response.error) {
        // Check for not found specifically
        if (response.error.code === 'PGRST116') {
          return errAsync({
            message: `Player with user UUID not found`,
            code: "NOT_FOUND",
          } as GetPlayerWithUserError);
        }
        return errAsync({
          message: "Failed to get player and users data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetPlayerWithUserError);
      }
      const playerData = response.data;
      if (!playerData) {
        return errAsync({
          message: "Player and users data not found.",
          code: "NOT_FOUND",
        } as GetPlayerWithUserError);
      }
      return okAsync(playerData);
    });

  return result;
}