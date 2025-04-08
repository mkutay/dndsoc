import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type UpsertCharacterRaceError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const upsertCharacterRace = ({ raceId, characterId }: { raceId: string, characterId: string }) =>
  createClient()
  .andThen((supabase) => 
    fromPromise(
      supabase
        .from("character_race")
        .upsert({ character_id: characterId, race_id: raceId }, { ignoreDuplicates: false }),
      (error) => ({
        message: `Failed to update character_race table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpsertCharacterRaceError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync()
      : errAsync({
        message: "Failed to update character_race table: " + response.error.message,
        code: "DATABASE_ERROR",
      } as UpsertCharacterRaceError)
  );