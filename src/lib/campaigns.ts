import { errAsync, okAsync } from "neverthrow";

import { runQuery } from "@/utils/supabase-run";

type GetCampaignsByUuidError = {
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
      .from("parties")
      .select(`*, party_campaigns!inner(*, campaigns(*)), character_party!inner(*, characters!inner(*))`)
      .eq("character_party.characters.player_uuid", playerUuid),
    "getCampaignsByPlayerUuid"
  )
  .andThen((data) => data.length === 0
    ? errAsync({
        message: `No campaigns found for player with UUID ${playerUuid}`,
        code: "NOT_FOUND",
      } as GetCampaignsByUuidError)
    : okAsync(data)
  )
  .map((parties) => 
    parties.flatMap((party) =>
      party.party_campaigns.map((partyCampaign) => ({
        ...partyCampaign.campaigns,
      }))
    )
  )
  .map((campaigns) => {
    // Remove duplicates based on campaign id
    const uniqueCampaigns = new Map<string, typeof campaigns[0]>();
    campaigns.forEach((campaign) => {
      if (!uniqueCampaigns.has(campaign.id)) {
        uniqueCampaigns.set(campaign.id, campaign);
      }
    });
    return Array.from(uniqueCampaigns.values());
  });

export const getCampaignsByCharacterUuid = ({ characterUuid }: { characterUuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("parties")
      .select(`*, party_campaigns!inner(*, campaigns(*)), character_party!inner(*, characters!inner(*))`)
      .eq("character_party.characters.id", characterUuid),
    "getCampaignsByCharacterUuid"
  )
  .andThen((data) => data.length === 0
    ? errAsync({
        message: `No campaigns found for character with UUID ${characterUuid}`,
        code: "NOT_FOUND",
      } as GetCampaignsByUuidError)
    : okAsync(data)
  )
  .map((parties) => 
    parties.flatMap((party) =>
      party.party_campaigns.map((partyCampaign) => ({
        ...partyCampaign.campaigns,
      }))
    )
  )
  .map((campaigns) => {
    // Remove duplicates based on campaign id
    const uniqueCampaigns = new Map<string, typeof campaigns[0]>();
    campaigns.forEach((campaign) => {
      if (!uniqueCampaigns.has(campaign.id)) {
        uniqueCampaigns.set(campaign.id, campaign);
      }
    });
    return Array.from(uniqueCampaigns.values());
  });

export const getCampaignsByDMUuid = ({ DMUuid }: { DMUuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("parties")
      .select(`*, party_campaigns!inner(*, campaigns(*)), dm_party(*, dms!inner(*))`)
      .eq("dm_party.dms.id", DMUuid),
    "getCampaignsByDMUuid"
  )
  .andThen((data) => data.length === 0
    ? errAsync({
        message: `No campaigns found for DM with UUID ${DMUuid}`,
        code: "NOT_FOUND",
      } as GetCampaignsByUuidError)
    : okAsync(data)
  )
  .map((parties) => 
    parties.flatMap((party) =>
      party.party_campaigns.map((partyCampaign) => ({
        ...partyCampaign.campaigns,
      }))
    )
  );

export const getCampaign = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("campaigns")
      .select("*, party_campaigns(*, parties!inner(*))")
      .eq("shortened", shortened)
      .single(),
    "getCampaign"
  );