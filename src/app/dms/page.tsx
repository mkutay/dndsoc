import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getDMs } from "@/lib/dms/query-all";

export default async function Page() {
  const dms = await getDMs();
  if (!dms.isOk()) return <ErrorPage error={dms.error.message} />;

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>DMs</TypographyH1>
      <TypographyParagraph>Placeholder for the DMs page, where each DM will be shown with a card: {dms.value.length}</TypographyParagraph>
    </div>
  );
}