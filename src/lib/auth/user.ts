import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetUserError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getUser = () => createClient()
  .andThen((supabase) =>
    ResultAsync.fromPromise(
      supabase
        .auth
        .getUser(),
      (error) => ({
        message: `Failed to receive user data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetUserError))
  )
  .andThen((response) =>
    !response.error
      ? okAsync(response.data.user)
      : errAsync({
        message: "Failed to get user data from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetUserError));