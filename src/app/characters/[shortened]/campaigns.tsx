import { CampaignCards } from "@/components/campaigns-cards";
import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";

export function Campaigns({ campaigns }: { campaigns: Tables<"campaigns">[] }) {
  if (campaigns.length === 0) {
    return null;
  }

  return (
    <>
      <TypographyH2 className="mt-6">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} link="/campaigns" />
    </>
  );
}