import { redirect } from "next/navigation";
import Link from "next/link";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlayers } from "@/lib/players/query-all";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const playersResult = await getPlayers();
  if (playersResult.isErr()) return redirect("/error?error=" + playersResult.error.message);
  const players = playersResult.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Players</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {players.map((player) => (
          <Card key={player.id}>
            <CardHeader>
              <CardTitle>{player.users.username}</CardTitle>
              <CardDescription>Level {player.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {player.about || "No about available."}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href={`/players/${player.users.username}`}>
                  View Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}