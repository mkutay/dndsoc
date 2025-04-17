import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetDMsError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

export function getDMs() {
  const supabase = createClient();

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("dms")
        .select("*, users(*)");

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get DM data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetDMsError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get DM data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetDMsError);
      }
      return okAsync(response.data);
    });

  return result;
}