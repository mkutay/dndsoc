import { createClient } from "@/utils/supabase/server";
import { errAsync, fromPromise, okAsync } from "neverthrow";

type GetPlayerByUuidError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getPlayerByUuid = ({ uuid }: { uuid: string }) =>
  createClient()
    .andThen((supabase) =>
      fromPromise(
        supabase
          .from("players")
          .select("*, users(*)")
          .eq("id", uuid)
          .single(),
        (error) => ({
          message: `Failed to get player data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: "DATABASE_ERROR",
        } as GetPlayerByUuidError)
      )
    )
    .andThen((response) =>
      !response.error
        ? okAsync(response.data)
        : errAsync({
            message: "Failed to get player data from Supabase: " + response.error.message,
            code: "DATABASE_ERROR",
          } as GetPlayerByUuidError)
    )