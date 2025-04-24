import { CampaignCards } from "@/components/campaigns-cards";
import { ErrorComponent } from "@/components/error-component";
import { TypographyH2 } from "@/components/typography/headings";
import DB from "@/lib/db";

export async function Campaigns({ characterUuid }: { characterUuid: string }) {
  const notFound = <TypographyH2 className="mt-6">No campaigns found</TypographyH2>;

  const campaigns = await DB.Campaigns.Get.Character({ characterUuid });
  if (campaigns.isErr()) {
    return campaigns.error.code === "NOT_FOUND"
      ? notFound
      : <ErrorComponent error={campaigns.error} caller="/characters/[username]/campaigns.tsx" />;
  }
  if (campaigns.value.length === 0) {
    return notFound;
  }

  return (
    <>
      <TypographyH2 className="mt-6">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns.value} link="/campaigns" />
    </>
  );
}