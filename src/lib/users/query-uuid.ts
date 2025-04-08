import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetPublicUserError = {
  message: string;
  code: "DATABASE_ERROR" | "PUBLIC_USER_NOT_FOUND";
}

export const getPublicUser = ({ authUserUuid }: { authUserUuid: string }) => createClient()
  .andThen((supabase) => 
    fromPromise(
      supabase
        .from("users")
        .select("*")
        .eq("auth_user_uuid", authUserUuid)
        .single(),
      (error) => ({
        message: `Failed to get user data with uuid from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetPublicUserError)
    )
  )
  .andThen((response) => {
    if (response.error) {
      // Check for not found specifically
      if (response.error.code === 'PGRST116') {
        return errAsync({
          message: `Public user with auth uuid '${authUserUuid}' not found from table users`,
          code: "PUBLIC_USER_NOT_FOUND",
        } as GetPublicUserError);
      }
      return errAsync({
        message: "Failed to get public user data with username from Supabase: " + response.error.message,
        code: "DATABASE_ERROR",
      } as GetPublicUserError);
    }
    return okAsync(response.data);
  });