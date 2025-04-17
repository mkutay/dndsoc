import { errAsync, fromPromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";

type GetCampaignsByPlayerUuidError = {
  message: string;
  code: "DATABASE_ERROR" | "NOT_FOUND";
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
          .select(`*, character_campaigns(*, campaigns(*))`)
          .eq("player_uuid", playerUuid),
        (error) => ({
          message: `Could not get campaigns for player with UUID ${playerUuid}: ` + (error as Error).message,
          code: "DATABASE_ERROR",
        } as GetCampaignsByPlayerUuidError)
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
    .andThen((data) =>
      data.length === 0 || data[0].character_campaigns.length === 0
        ? errAsync({
            message: `No campaigns found for player with UUID ${playerUuid}`,
            code: "NOT_FOUND",
          } as GetCampaignsByPlayerUuidError)
        : okAsync(data)
    )
    .map((data) =>
      data[0].character_campaigns
    )
    .map((characterCampaigns) =>
      characterCampaigns.map((characterCampaign) => ({
        ...characterCampaign.campaigns,
      }))
    )