import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getPlayerByUsername } from "@/lib/players/query";

export default async function Page(props: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await props.params;

  const playerData = await getPlayerByUsername(username);

  if (!playerData.isOk()) {
    return <ErrorPage error={playerData.error.message} />;
  }

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Player: {username}</TypographyH1>
      <TypographyParagraph>Placeholder for the player page.</TypographyParagraph>
    </div>
  );
}