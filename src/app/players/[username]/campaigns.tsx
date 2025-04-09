import { CampaignCards } from "@/components/campaigns-cards";
import { TypographyH2 } from "@/components/typography/headings";
import { getCampaignsByPlayerUuid } from "@/lib/campaigns/query-player-uuid";
import { Player } from "@/types/full-database.types";
import { redirect } from "next/navigation";

export async function Campaigns({ player }: { player: Player }) {
  const result = await getCampaignsByPlayerUuid({ playerUuid: player.id });
  if (result.isErr()) redirect(`/error?error=${result.error.message}`);
  const campaigns = result.value;

  return (
    <>
      <TypographyH2 className="mt-6">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} />
    </>
  );
}