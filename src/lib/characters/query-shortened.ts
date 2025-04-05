import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetCharacterByShortenedError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type Character = Tables<"characters">;

export function getCharacterByShortened(shortened: string):
  ResultAsync<Character, GetCharacterByShortenedError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetCharacterByShortenedError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("characters")
        .select("*")
        .eq("shortened", shortened)
        .single();

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get character data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetCharacterByShortenedError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get character data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCharacterByShortenedError);
      }
      const playerData = response.data;
      return okAsync(playerData);
    });

  return result;
}