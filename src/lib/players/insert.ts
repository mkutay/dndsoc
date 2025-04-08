import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type InsertPlayerError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
}

type Player = Tables<"players">;
type PlayerArgument = {
  about?: string;
  achievement_ids?: string[];
  id?: string;
  level?: number;
  auth_user_uuid: string;
}

export const insertPlayer = (player: PlayerArgument): ResultAsync<Player, InsertPlayerError> =>
  createClient()
  .andThen((supabase) => fromPromise(
    supabase
      .from("players")
      .insert(player)
      .select("*")
      .single(),
    () => ({
      message: "Failed to insert player into table \"players\".",
      code: "DATABASE_ERROR",
    } as InsertPlayerError))
  )
  .andThen((result) =>
    !result.error
      ? okAsync(result.data)
      : errAsync({
          message: "Failed to insert player into table \"players\": " + result.error.message,
          code: "DATABASE_ERROR",
        } as InsertPlayerError)
  );