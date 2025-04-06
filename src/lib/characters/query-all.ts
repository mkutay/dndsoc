import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetCharactersError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type Character = Tables<"characters"> & {
  races: Tables<"races">[];
  classes: Tables<"classes">[];
}

export function getCharacters():
  ResultAsync<Character[], GetCharactersError> {

  const supabase = createClient();

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("characters")
        .select("*, races(*), classes(*)");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get character data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetCharactersError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get character data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCharactersError);
      }
      return okAsync(response.data);
    });

  return result;
}