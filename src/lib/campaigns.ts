import { errAsync, okAsync } from "neverthrow";

import { runQuery } from "@/utils/supabase-run";

type GetCampaignsByPlayerUuidError = {
  message: string;
  code: "NOT_FOUND";
};

export const getCampaigns = () => 
  runQuery((supabase) =>
    supabase
      .from("campaigns")
      .select("*"),
    "getCampaigns"
  );

export const getCampaignsByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("character_campaigns")
      .select(`*, campaigns(*), characters!inner(*)`)
      .eq("characters.player_uuid", playerUuid),
    "getCampaignsByPlayerUuid"
  )
  .andThen((data) =>
    data.length === 0
      ? errAsync({
          message: `No campaigns found for player with UUID ${playerUuid}`,
          code: "NOT_FOUND",
        } as GetCampaignsByPlayerUuidError)
      : okAsync(data)
  )
  .map((characterCampaigns) =>
    characterCampaigns.map((characterCampaign) => ({
      ...characterCampaign.campaigns,
    }))
  );

export const getCampaign = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("campaigns")
      .select("*, character_campaigns(*, characters(*))")
      .eq("shortened", shortened)
      .single(),
    "getCampaign"
  );