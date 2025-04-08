import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { Player } from "@/types/full-database.types";

type GetPlayerAuthUserUuidError = {
  message: string;
  code: "DATABASE_ERROR" | "NOT_FOUND";
};

export const getPlayerAuthUserUuid = ({ authUserUuid }: { authUserUuid: string }) => 
  createClient()
    .andThen((supabase) =>
      fromPromise(
        supabase
          .from("players")
          .select(`*, users(*), received_achievements(*, achievements(*))`)
          .eq("auth_user_uuid", authUserUuid)
          .single(),
        (error) => ({
          message: `Could not get player with auth uuid ${authUserUuid}: ` + (error as Error).message,
          code: "DATABASE_ERROR",
        } as GetPlayerAuthUserUuidError)
      )
    )
    .andThen((response) =>
      !response.error
        ? okAsync(response.data as Player)
        : errAsync({
            message: `Player with auth uuid ${authUserUuid} not found`,
            code: "NOT_FOUND",
          } as GetPlayerAuthUserUuidError)
    )