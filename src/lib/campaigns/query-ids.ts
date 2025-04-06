import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type GetCampaignsFromIdsError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

type Campaign = Tables<"campaigns">;

export function getCampaignsFromIds(ids: string[]):
  ResultAsync<Campaign[], GetCampaignsFromIdsError> {

  const supabase = createClient();

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("campaigns")
        .select("*")
        .in("id", ids);

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to get campaigns' data from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as GetCampaignsFromIdsError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to get campaigns' data from Supabase: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCampaignsFromIdsError);
      }
      return okAsync(response.data);
    });

  return result;
}