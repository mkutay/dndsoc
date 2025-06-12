import { format } from "date-fns";
import { cache } from "react";

import { TypographyLead, TypographyParagraph } from "@/components/typography/paragraph";
import { Parties } from "@/components/campaigns/parties";
import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { getParties } from "@/lib/parties";
import { runQuery } from "@/utils/supabase-run";

export const dynamic = "force-dynamic";

export const getCampaign = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("campaigns")
      .select("*, party_campaigns(*, parties!inner(*))")
      .eq("shortened", shortened)
      .single(),
    "getCampaign"
  );

const cachedGetCampaign = cache(getCampaign);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const campaigned = await cachedGetCampaign({ shortened });
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

  const campaigned = await cachedGetCampaign({ shortened });
  if (campaigned.isErr()) return <ErrorPage error={campaigned.error} caller="/campaigns/[shortened]/page.tsx" isNotFound />;
  const campaign = campaigned.value;

  const roled = await getUserRole();
  if (roled.isErr() && roled.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={roled.error} caller="/dms/[username]" />;

  const auth = roled.isOk() ? roled.value : null;
  const role = auth ? auth.role : null;
  const isAdmin = role === "admin";
  const parties = isAdmin ? await getParties() : undefined;
  if (parties && parties.isErr()) return <ErrorPage error={parties.error} caller="/campaigns/[shortened]/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <h1 className="text-primary flex flex-row font-extrabold text-5xl font-headings tracking-wide items-start">
        <div className="font-drop-caps font-medium text-7xl">{campaign.name.charAt(0)}</div>
        <div>{campaign.name.slice(1)}</div>
      </h1>
      <TypographyLead>{format(campaign.start_date, "PP")} - {campaign.end_date ? format(campaign.end_date, "PP") : "Present"}</TypographyLead>
      <TypographyParagraph>{campaign.description}</TypographyParagraph>
      <Parties
        parties={campaign.party_campaigns.map((partyCampaign) => partyCampaign.parties)}
        campaignUuid={campaign.id}
        isAdmin={isAdmin}
        allParties={parties?.value}
        shortened={shortened}
      />
    </div>
  );
}