import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { getPlayerByUsername } from "@/lib/players/query-username";
import { getPlayerByUuid } from "@/lib/players/query-uuid";
import { getUserByUuid } from "@/lib/users/query-uuid";
import { getUser } from "@/lib/users/user";
import { PlayerEditForm } from "./form";

export default async function Page() {
  const userResult = await getUser();
  if (userResult.isErr()) {
    return <ErrorPage error={userResult.error.message} />;
  }
  const user = userResult.value;

  const playerResult = await getPlayerByUuid(user.id);
  if (playerResult.isErr()) {
    return <ErrorPage error={playerResult.error.message} />;
  }
  const player = playerResult.value;

  const fooUserResult = await getUserByUuid(player.user_uuid);
  if (fooUserResult.isErr()) {
    return <ErrorPage error={fooUserResult.error.message} />;
  }
  const fooUser = fooUserResult.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-6 px-4 gap-6">
      <TypographyH1>Edit Your Public Player Page</TypographyH1>
      <PlayerEditForm player={player} username={fooUser.username} />
    </div>
  );
}