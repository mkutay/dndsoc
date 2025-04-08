import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { Player } from "@/types/full-database.types";

type GetPlayerByUsernameError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getPlayerByUsername = ({ username }: { username: string }) =>
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("players")
        .select(`*, users(*), received_achievements(*, achievements(*))`)
        .eq("users.username", username)
        .single(),
      (error) => ({
        message: `Could not get player with username ${username}: ` + (error as Error).message,
        code: "DATABASE_ERROR",
      } as GetPlayerByUsernameError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync(response.data as Player)
      : errAsync({
          message: `Could not get player with username ${username}: ` + response.error.message,
          code: "DATABASE_ERROR",
        } as GetPlayerByUsernameError)
  )