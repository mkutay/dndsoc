import Link from "next/link";

import { TypographyH3 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database.types";

export function Campaigns({ campaigns }: { campaigns: Tables<"campaigns">[] }) {
  if (campaigns.length === 0) return null;
  const currentCampaign = campaigns.find((campaign) => campaign.end_date === null);

  return (
    <div className="mt-6 flex flex-col gap-4">
      {currentCampaign && <div className="flex flex-row gap-4 items-center">
        <TypographyH3>Current Campaign:</TypographyH3>
        <div className="flex flex-row gap-2 sm:flex-nowrap flex-wrap">
          <Button variant="secondary" size="default" className="w-fit">
            <Link href={`/campaigns/${currentCampaign.shortened}`}>
              {currentCampaign.name}
            </Link>
          </Button>
        </div>
      </div>}
      <div className="flex flex-row gap-4 items-center">
        <TypographyH3>Campaigns:</TypographyH3>
        <div className="flex flex-row gap-2 sm:flex-nowrap flex-wrap">
          {campaigns.map((campaign, index) => (
            <Button variant="secondary" size="default" key={index} className="w-fit">
              <Link href={`/campaigns/${campaign.shortened}`}>
                {campaign.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}