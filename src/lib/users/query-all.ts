import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetUsersError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getUsers = () => createClient()
  .andThen((supabase) => {
    const response = supabase
      .from("users")
      .select("*, roles(*)");

    return ResultAsync.fromPromise(response, (error) => ({
      message: `Failed to get users data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      code: "DATABASE_ERROR",
    } as GetUsersError));
  })
  .andThen((response) => {
    if (response.error) {
      return errAsync({
        message: "Failed to get users data from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetUsersError);
    }
    return okAsync(response.data);
  });