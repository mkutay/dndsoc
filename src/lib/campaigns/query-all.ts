import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetCampaignsError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getCampaigns = () => createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("campaigns")
        .select("*"),
      (error) => ({
        message: "Failed to fetch campaigns: " + (error as Error).message,
        code: "DATABASE_ERROR",
      } as GetCampaignsError)
    )
  )
  .andThen((response) =>
    !response.error
      ? okAsync(response.data)
      : errAsync({
          message: "Failed to fetch campaigns: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCampaignsError)
  )