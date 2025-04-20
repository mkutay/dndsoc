import { format } from "date-fns";

import { TypographyLead, TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { getCampaigns } from "@/lib/campaigns";
import { getCampaign } from "@/lib/campaigns";

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const campaigned = await getCampaign({ shortened });
  if (campaigned.isErr()) return <ErrorPage error={campaigned.error} caller="/campaigns/[shortened]/page.tsx" isNotFound />;
  const campaign = campaigned.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>{campaign.name}</TypographyH1>
      <TypographyLead>{format(campaign.start_date, "PP")} - {campaign.end_date ? format(campaign.end_date, "PP") : "Present"}</TypographyLead>
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