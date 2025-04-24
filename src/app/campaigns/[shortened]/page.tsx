import { format } from "date-fns";

import { TypographyLead, TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const campaigned = await DB.Campaigns.Get.Shortened({ shortened });
  if (campaigned.isErr()) return { title: "Campaign Not Found", description: "This campaign does not exist." };
  const campaign = campaigned.value;

  const dateMessage = campaign.end_date
    ? `Started on ${format(campaign.start_date, "PP")} and ended on ${format(campaign.end_date, "PP")}.`
    : `Started on ${format(campaign.start_date, "PP")} and is ongoing.`;
  const description = `${campaign.description}. ${dateMessage}`;
  const title = `Campaign ${campaign.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const campaigned = await DB.Campaigns.Get.Shortened({ shortened });
  if (campaigned.isErr()) return <ErrorPage error={campaigned.error} caller="/campaigns/[shortened]/page.tsx" isNotFound />;
  const campaign = campaigned.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>{campaign.name}</TypographyH1>
      <TypographyLead>{format(campaign.start_date, "PP")} - {campaign.end_date ? format(campaign.end_date, "PP") : "Present"}</TypographyLead>
      <TypographyParagraph>{campaign.description}</TypographyParagraph>
    </div>
  );
}

export async function generateStaticParams() {
  const campaigns = await DB.Campaigns.Get.All();
  if (campaigns.isErr()) return [];

  return campaigns.value.map((campaign) => ({
    shortened: campaign.shortened,
  }));
}