import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type DeleteCharacterRaceError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const deleteCharacterRace = ({ characterId }: { characterId: string }) =>
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("character_race")
        .delete()
        .eq("character_id", characterId),
      (error) => ({
        message: "Could not delete from character_race table: " + (error as Error).message,
        code: "DATABASE_ERROR",
      } as DeleteCharacterRaceError)
    )
  )
  .andThen((response) =>
    !response.error
      ? okAsync()
      : errAsync({
        code: "DATABASE_ERROR",
        message: "Could not delete from character_race table (supabase): " + response.error.message,
      } as DeleteCharacterRaceError)
    )