import { notFound } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { getCampaigns } from "@/lib/campaigns/query-all";
import { getCampaign } from "@/lib/campaigns/query-shortened";
import { TypographyLead, TypographyParagraph } from "@/components/typography/paragraph";
import { format } from "date-fns";

export const dynamicParams = false;
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const campaigned = await getCampaign({ shortened });
  if (campaigned.isErr()) {
    console.error(campaigned.error);
    notFound();
  }
  const campaign = campaigned.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>{campaign.name}</TypographyH1>
      <TypographyLead>{format(campaign.start_date, "PP")} - {format(campaign.end_date, "PP")}</TypographyLead>
      <TypographyParagraph>{campaign.description}</TypographyParagraph>
    </div>
  );
}

export async function generateStaticParams() {
  const campaigns = await getCampaigns();
  if (campaigns.isErr()) return [];

  return campaigns.value.map((campaign) => ({
    shortened: campaign.shortened,
  }));
}