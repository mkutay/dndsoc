import { errAsync, okAsync } from "neverthrow";

import { TypographyH2 } from "@/components/typography/headings";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaign-cards";
import { runQuery } from "@/utils/supabase-run";

export async function Campaigns({ playerUuid }: { playerUuid: string }) {
  const result = await getCampaignsByPlayerUuid({ playerUuid });
  if (result.isErr()) {
    return result.error.code === "NOT_FOUND"
      ? <TypographyH2 className="mt-8">No campaigns found</TypographyH2>
      : <ErrorComponent error={result.error} caller="/players/[username]/campaigns.tsx" />;
  }
  const campaigns = result.value;

  return (
    <>
      <TypographyH2 className="mt-8">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} />
    </>
  );
}

const getCampaignsByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
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
        code: "NOT_FOUND" as const,
      })
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