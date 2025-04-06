import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";

type GetUserError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

export function getUser():
  ResultAsync<User, GetUserError> {

  const supabase = createClient();

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .auth
        .getUser();

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to receive user data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetUserError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get user data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetUserError);
      }
      return okAsync(response.data.user);
    });

  return result;
}