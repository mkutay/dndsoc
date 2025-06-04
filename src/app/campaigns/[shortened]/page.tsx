import { redirect } from "next/navigation";
import { format } from "date-fns";

import { TypographyLead, TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";
import { Parties } from "@/components/campaigns/parties";

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

  const roled = await DB.Roles.Get.With.User();
  if (roled.isErr() && roled.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={roled.error} caller="/dms/[username]" />;

  const auth = roled.isOk() ? roled.value : null;
  const role = auth ? auth.role : null;
  const isAdmin = role === "admin";
  const parties = isAdmin ? await getAllParties() : undefined;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>
        <span className="font-drop-caps mr-0.5">{campaign.name.charAt(0)}</span><span>{campaign.name.slice(1)}</span>
      </TypographyH1>
      <TypographyLead>{format(campaign.start_date, "PP")} - {campaign.end_date ? format(campaign.end_date, "PP") : "Present"}</TypographyLead>
      <TypographyParagraph>{campaign.description}</TypographyParagraph>
      <Parties
        parties={campaign.party_campaigns.map((partyCampaign) => partyCampaign.parties)}
        campaignUuid={campaign.id}
        isAdmin={isAdmin}
        allParties={parties}
        shortened={shortened}
      />
    </div>
  );
}

async function getAllParties() {
  const result = await DB.Parties.Get.All();
  if (result.isErr()) redirect("/error?error=" + result.error.message);
  return result.value;
}

export async function generateStaticParams() {
  const campaigns = await DB.Campaigns.Get.All();
  if (campaigns.isErr()) return [];

  return campaigns.value.map((campaign) => ({
    shortened: campaign.shortened,
  }));
}