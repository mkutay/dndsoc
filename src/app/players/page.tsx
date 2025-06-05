import { Metadata } from "next";
import Link from "next/link";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";
import { Player } from "@/types/full-database.types";
import { Play } from "next/font/google";
import { Dot } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All of Our Players",
  description: "List of all of our players in the KCL Dungeons and Dragons app.",
  openGraph: {
    title: "All of Our Players",
    description: "List of all of our players in the KCL Dungeons and Dragons app.",
  },
};

export default async function Page() {
  const players = await DB.Players.Get.All();
  if (players.isErr()) return <ErrorPage error={players.error} caller="/players/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Players</TypographyH1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {players.value.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const level = `Level ${player.level}`;
  const achievementCount = player.received_achievements_player.length;
  const achievement = `Received ${achievementCount} Achievement${achievementCount === 1 ? "" : "s"}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{player.users.name.toUpperCase()}</CardTitle>
        <CardDescription className="flex flex-row">
          {level}
          {achievementCount > 0 && <Dot />}
          {achievementCount > 0 && achievement}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>
          {player.about || "No about available."}
        </TypographyParagraph>
      </CardContent>
      <CardFooter className="flex flex-row justify-end">
        <Button asChild size="sm" variant="default">
          <Link href={`/players/${player.users.username}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}