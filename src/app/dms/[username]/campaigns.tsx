import { TypographyH2 } from "@/components/typography/headings";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaigns-cards";
import DB from "@/lib/db";

export async function Campaigns({ DMUuid }: { DMUuid: string }) {
  const result = await DB.Campaigns.Get.DM({ DMUuid });
  if (result.isErr()) {
    return result.error.code === "NOT_FOUND"
      ? <TypographyH2 className="mt-8">No campaigns found</TypographyH2>
      : <ErrorComponent error={result.error} caller="/players/[username]/campaigns.tsx" />;
  }
  const campaigns = result.value;

  return (
    <>
      <TypographyH2 className="mt-8">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} link="/campaigns" />
    </>
  );
}