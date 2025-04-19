import { TypographyH1 } from "@/components/typography/headings";
import { getCampaigns } from "@/lib/campaigns";
import { CampaignCards } from "@/components/campaigns-cards";
import { ErrorPage } from "@/components/error-page";

export default async function Page() {
  const campaigns = await getCampaigns();
  if (campaigns.isErr()) return <ErrorPage error={campaigns.error} caller="/campaigns/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Campaigns</TypographyH1>
      <CampaignCards campaigns={campaigns.value} link="/campaigns" />
    </div>
  );
}