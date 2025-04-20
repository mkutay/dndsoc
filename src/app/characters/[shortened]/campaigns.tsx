import { CampaignCards } from "@/components/campaigns-cards";
import { ErrorPage } from "@/components/error-page";
import { TypographyH2 } from "@/components/typography/headings";
import { getCampaignsByCharacterUuid } from "@/lib/campaigns";

export async function Campaigns({ characterUuid }: { characterUuid: string }) {
  const campaigns = await getCampaignsByCharacterUuid({ characterUuid });
  if (campaigns.isErr()) {
    if (campaigns.error.code === "NOT_FOUND") return null;
    return <ErrorPage error={campaigns.error} caller="/characters/[shortened]/campaigns.tsx" />;
  }
  if (campaigns.value.length === 0) {
    return null;
  }

  return (
    <>
      <TypographyH2 className="mt-6">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns.value} link="/campaigns" />
    </>
  );
}