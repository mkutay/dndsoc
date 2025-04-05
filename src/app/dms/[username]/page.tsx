import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getDMByUsername } from "@/lib/dms/query-username";

export default async function Page(props: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await props.params;

  const dm = await getDMByUsername(username);

  if (!dm.isOk()) {
    return <ErrorPage error={dm.error.message} />;
  }

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>DM: {username}</TypographyH1>
      <TypographyParagraph>Placeholder for the DM page.</TypographyParagraph>
    </div>
  );
}