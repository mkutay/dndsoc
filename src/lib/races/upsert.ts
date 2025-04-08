import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type UpsertRaceError = {
  message: string;
  code: "DATABASE_ERROR";
}

export const upsertRace = ({ race }: { race: string }) =>
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("races")
        .upsert({ name: race }, { ignoreDuplicates: false, onConflict: "name" })
        .select("*")
        .single(),
      (error) => ({
        message: `Failed to update races table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpsertRaceError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync(response.data)
      : errAsync({
        message: "Failed to update races table: " + response.error.message,
        code: "DATABASE_ERROR",
      } as UpsertRaceError)
  );