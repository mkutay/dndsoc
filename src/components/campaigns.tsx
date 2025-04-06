import { format } from "date-fns";

import { getCampaignsFromIds } from "@/lib/campaigns/query-ids";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TypographyParagraph } from "./typography/paragraph";
import { ErrorPage } from "./error-page";

export async function CampaignCards({
  campaignIds,
}: {
  campaignIds: string[];
}) {
  const campaignsResult = await getCampaignsFromIds(campaignIds);
  if (!campaignsResult.isOk()) {
    return <ErrorPage error={campaignsResult.error.message} />;
  }

  const campaigns = campaignsResult.value;

  // sort by start date
  campaigns.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA.getTime() - dateB.getTime();
  });
  campaigns.reverse();

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="w-full">
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription>
              {format(campaign.start_date, "PP")} - {format(campaign.end_date, "PP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TypographyParagraph>
              {campaign.description}
            </TypographyParagraph>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}