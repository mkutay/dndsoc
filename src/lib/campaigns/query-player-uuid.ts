import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetCampaignsByPlayerUuidError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const getCampaignsByPlayerUuid = ({
  playerUuid,
}: {
  playerUuid: string;
}) =>
  createClient()
    .andThen((supabase) =>
      fromPromise(
        supabase
          .from("characters")
          .select(`*, character_campaigns!inner(*, campaigns(*))`)
          .eq("player_uuid", playerUuid)
          .single(),
        (error) => ({
          message: `Could not get campaigns for player with UUID ${playerUuid}: ` + (error as Error).message,
          code: "DATABASE_ERROR",
        })
      )
    )
    .andThen((response) =>
      !response.error
        ? okAsync(response.data)
        : errAsync({
            message: `Could not get campaigns for player with UUID ${playerUuid}: ` + response.error.message,
            code: "DATABASE_ERROR",
          } as GetCampaignsByPlayerUuidError)
    )
    .map((data) =>
      data.character_campaigns
        .map((characterCampaign) => (
          characterCampaign.campaigns
        ))
    )