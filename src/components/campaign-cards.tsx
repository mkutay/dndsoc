import { TypographyParagraph } from "./typography/paragraph";
import { CampaignCard } from "./campaign-card";
import { type Tables } from "@/types/database.types";

export function CampaignCards({ campaigns }: { campaigns: Tables<"campaigns">[] }) {
  if (campaigns.length === 0) {
    return <TypographyParagraph>No campaigns found.</TypographyParagraph>;
  }

  // sort by start date
  campaigns.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
