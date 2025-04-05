import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetUserByUsernameError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
}

type User = Tables<"users">;

export function getUserByUsername(username: string):
  ResultAsync<User, GetUserByUsernameError> {
    
  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetUserByUsernameError));

  const userResult = supabase.andThen((supabase) => {
    const response = supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    return ResultAsync.fromPromise(response, (error) => ({
      message: `Failed to get player data with username from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      code: "DATABASE_ERROR",
    } as GetUserByUsernameError));
  }).andThen((response) => {
    if (response.error) {
      // Check for not found specifically
      if (response.error.code === 'PGRST116') {
        return errAsync({
          message: `User with username '${username}' not found`,
          code: "NOT_FOUND",
        } as GetUserByUsernameError);
      }
      return errAsync({
        message: "Failed to get player data with username from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetUserByUsernameError);
    }
    return okAsync(response.data);
  });

  return userResult;
}