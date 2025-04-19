import { notFound } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getDMByUsername } from "@/lib/dms";

export const dynamic = "force-dynamic";

export default async function Page({ params }: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const dm = await getDMByUsername(username);

  if (!dm.isOk()) {
    console.error(`Failed to get DM data: ${dm.error.message}`);
    notFound();
  }

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>DM: {username}</TypographyH1>
      <TypographyParagraph>Placeholder for the DM page.</TypographyParagraph>
    </div>
  );
}