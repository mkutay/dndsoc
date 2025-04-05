import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetUsersError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type User = Tables<"users">;

export function getUsers():
  ResultAsync<User[], GetUsersError> {

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetUsersError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("users")
        .select("*");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get player data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetUsersError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get player data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetUsersError);
      }
      const playerData = response.data;
      return okAsync(playerData);
    });

  return result;
}