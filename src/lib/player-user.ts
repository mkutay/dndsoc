import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "./auth/user";

type GetPlayerUserError = {
  message: string;
  code: "DATABASE_ERROR" | "NOT_FOUND";
};

export const getPlayerUser = () => {
  const user = getUser();
  const supabase = createClient();

  return ResultAsync.combine([user, supabase])
    .andThen(([user, supabase]) => 
      fromPromise(
        supabase
          .from("players")
          .select(`*, users(*)`)
          .eq("auth_user_uuid", user.id)
          .single(),
        (error) => ({
          message: `Could not get player with auth uuid ${user.id}: ` + (error as Error).message,
          code: "DATABASE_ERROR",
        } as GetPlayerUserError)
      )
    )
    .andThen((response) =>
      !response.error
        ? okAsync(response.data)
        : errAsync({
            message: `Player could not be found in the database: ` + response.error.message,
            code: "NOT_FOUND",
          } as GetPlayerUserError)
    );
}