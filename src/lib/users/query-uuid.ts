import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetUserByUuidError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "NOT_FOUND";
}

type User = Tables<"users">;

export function getUserByUuid(uuid: string):
  ResultAsync<User, GetUserByUuidError> {
    
  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as GetUserByUuidError));

  const userResult = supabase.andThen((supabase) => {
    const response = supabase
      .from("users")
      .select("*")
      .eq("user_uuid", uuid)
      .single();

    return ResultAsync.fromPromise(response, (error) => ({
      message: `Failed to get user data with uuid from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      code: "DATABASE_ERROR",
    } as GetUserByUuidError));
  }).andThen((response) => {
    if (response.error) {
      // Check for not found specifically
      if (response.error.code === 'PGRST116') {
        return errAsync({
          message: `User with uuid '${uuid}' not found`,
          code: "NOT_FOUND",
        } as GetUserByUuidError);
      }
      return errAsync({
        message: "Failed to get user data with username from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetUserByUuidError);
    }
    return okAsync(response.data);
  });

  return userResult;
}