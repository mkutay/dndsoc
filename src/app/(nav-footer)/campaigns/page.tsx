import { type Metadata } from "next";

import { TypographyH1 } from "@/components/typography/headings";
import { CampaignCards } from "@/components/campaign-cards";
import { ErrorPage } from "@/components/error-page";
import { getCampaigns } from "@/lib/campaigns";

export const metadata: Metadata = {
  title: "Campaigns Being Played In Our Society",
  description: "A list of campaigns being played in our society.",
  openGraph: {
    title: "Campaigns Being Played In Our Society",
    description: "A list of campaigns being played in our society.",
  },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const campaigns = await getCampaigns();
  if (campaigns.isErr()) return <ErrorPage error={campaigns.error} caller="/campaigns/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Campaigns</TypographyH1>
      <CampaignCards campaigns={campaigns.value} />
    </div>
  );
}
