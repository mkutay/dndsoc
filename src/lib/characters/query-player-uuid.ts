import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { Character } from "@/types/full-database.types";

type GetCharactersError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

export const getCharactersByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("characters")
        .select(`*, races(*), classes(*), campaigns(*)`)
        .eq("player_uuid", playerUuid),
      (error) => ({
        message: `Failed to get character data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetCharactersError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync(response.data as Character[])
      : errAsync({
        message: "Failed to get character data from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetCharactersError)
  )