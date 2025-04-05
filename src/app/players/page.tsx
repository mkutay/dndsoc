import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getPlayers } from "@/lib/players/query-all";

export default async function Page() {
  const players = await getPlayers();
  if (!players.isOk()) return <ErrorPage error={players.error.message} />;

  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Players</TypographyH1>
      <TypographyParagraph>Placeholder for the players page, where each player will be shown with a card: {players.value.length}</TypographyParagraph>
    </div>
  );
}