import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetDMByUuidError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type DM = Tables<"dms">;

export function getDMByUuid(uuid: string):
  ResultAsync<DM, GetDMByUuidError> {

  const supabase = createClient();

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("dms")
        .select("*")
        .eq("auth_user_uuid", uuid)
        .single();

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get DM data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetDMByUuidError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get DM data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetDMByUuidError);
      }
      const playerData = response.data;
      return okAsync(playerData);
    });

  return result;
}