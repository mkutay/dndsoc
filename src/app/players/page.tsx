import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlayers } from "@/lib/players/query-all";
import { getUsers } from "@/lib/users/query-all";

export default async function Page() {
  const playersResult = await getPlayers();
  if (!playersResult.isOk()) return <ErrorPage error={playersResult.error.message} />;
  const players = playersResult.value;

  const usersResult = await getUsers();
  if (!usersResult.isOk()) return <ErrorPage error={usersResult.error.message} />;
  const users = usersResult.value;

  // combine players and users
  const playersWithUsers = players.map((player) => {
    const user = users.find((user) => user.id === player.user_uuid);
    return {
      ...player,
      username: user?.username || "Unknown",
      knumber: user?.knumber || "Unknown",
    };
  });

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Players</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {playersWithUsers.map((player) => (
          <Card key={player.id}>
            <CardHeader>
              <CardTitle>{player.username}</CardTitle>
              <CardDescription>Level {player.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {player.about || "No description available."}
              </TypographyParagraph>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}