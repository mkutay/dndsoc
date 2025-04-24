import { TypographyH2 } from "@/components/typography/headings";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaigns-cards";
import DB from "@/lib/db";

export async function Campaigns({ DMUuid }: { DMUuid: string }) {
  const notFound = <TypographyH2 className="mt-8">No campaigns found</TypographyH2>
  const result = await DB.Campaigns.Get.DM({ DMUuid });
  if (result.isErr()) {
    return result.error.code === "NOT_FOUND"
      ? notFound
      : <ErrorComponent error={result.error} caller="/players/[username]/campaigns.tsx" />;
  }
  const campaigns = result.value;

  if (campaigns.length === 0) return notFound;

  return (
    <>
      <TypographyH2 className="mt-8">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} link="/campaigns" />
    </>
  );
}