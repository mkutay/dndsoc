import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TypographyParagraph } from "./typography/paragraph";

export function CampaignCards({
  campaigns,
}: {
  campaigns: {
    description: string;
    startDate: string;
    endDate: string;
    name: string;
  }[];
}) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <TypographyParagraph>
        No campaigns found.
      </TypographyParagraph>
    );
  }

  // sort by start date
  campaigns.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });
  campaigns.reverse();

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {campaigns.map((campaign, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription>
              {format(campaign.startDate, "PP")} - {format(campaign.startDate, "PP")}
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