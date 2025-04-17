import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetCampaignsError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getCampaign = ({ shortened }: { shortened: string }) => createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("campaigns")
        .select("*, character_campaigns(*, characters(*))")
        .eq("shortened", shortened)
        .single(),
      (error) => ({
        message: "Failed to fetch campaign: " + (error as Error).message,
        code: "DATABASE_ERROR",
      } as GetCampaignsError)
    )
  )
  .andThen((response) =>
    !response.error
      ? okAsync(response.data)
      : errAsync({
          message: "Failed to fetch campaign: " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetCampaignsError)
  )