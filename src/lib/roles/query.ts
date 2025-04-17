import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetUserRoleError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getRole = ({ authUuid }: { authUuid: string }) => createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("roles")
        .select("*")
        .eq("auth_user_uuid", authUuid)
        .single(),
      (error) => ({
        message: `Failed to get user role from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetUserRoleError)
    )
  )
  .andThen((response) =>
    !response.error
      ? okAsync(response.data)
      : errAsync({
          message: "Failed to get user role from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetUserRoleError)
  );