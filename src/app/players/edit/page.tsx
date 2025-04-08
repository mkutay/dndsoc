import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { getUser } from "@/lib/auth/user";
import { PlayerEditForm } from "./form";
import { getPlayerAuthUserUuid } from "@/lib/players/query-auth-user-uuid";

export default async function Page() {
  const userResult = await getUser();
  if (userResult.isErr()) return redirect("/sign-in");
  const user = userResult.value;

  const playerResult = await getPlayerAuthUserUuid({ authUserUuid: user.id });
  if (playerResult.isErr()) redirect(`/error?error=${playerResult.error.message}`);
  const player = playerResult.value;

  if (!player.users) redirect(`/error?error=Player with auth UUID not found`);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-6 px-4 gap-6">
      <TypographyH1>Edit Your Public Player Page</TypographyH1>
      <PlayerEditForm player={player} />
    </div>
  );
}