import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { Character } from "@/types/full-database.types";

type GetCharacterByShortenedError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getCharacterByShortened = ({ shortened }: { shortened: string }) =>
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("characters")
        .select("*, races(*), classes(*), campaigns(*)")
        .eq("shortened", shortened)
        .single(),
      (error) => ({
        message: `Failed to get character data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetCharacterByShortenedError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync(response.data as Character)
      : errAsync({
          message: "Failed to get character data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCharacterByShortenedError)
  );