import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { getUser } from "@/lib/users/user";
import { PlayerEditForm } from "./form";
import { getPlayerWithUser } from "@/lib/players/query-with-user";
import { ErrorPage } from "@/components/error-page";

export default async function Page() {
  const userResult = await getUser();
  if (userResult.isErr()) {
    redirect("/sign-in");
  }
  const user = userResult.value;

  const playerResult = await getPlayerWithUser(user.id);
  if (playerResult.isErr()) {
    return <ErrorPage error={playerResult.error.message} />;
  }
  const player = playerResult.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-6 px-4 gap-6">
      <TypographyH1>Edit Your Public Player Page</TypographyH1>
      <PlayerEditForm player={player} username={player.users.username} />
    </div>
  );
}