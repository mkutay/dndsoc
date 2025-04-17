import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetCharactersError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

export const getCharacters = () =>
  createClient()
    .andThen((supabase) =>
      ResultAsync.fromPromise(
        supabase
          .from("characters")
          .select("*, races(*), classes(*), players(*, users(*))"),
        (error) => ({
          message: `Failed to get character data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: "DATABASE_ERROR",
        } as GetCharactersError)
      )
    )
    .andThen((response) =>
      !response.error
        ? okAsync(response.data)
        : errAsync({
            message: "Failed to get character data from Supabase: " + response.error.message,
            code: "DATABASE_ERROR",
          } as GetCharactersError)
    );