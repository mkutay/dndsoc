import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getPlayerByUsername } from "@/lib/players";
import { getUserRole } from "@/lib/roles";
import { PlayerEditForm } from "./form";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/players/[username]/edit page" />;

  const player = await getPlayerByUsername({ username });
  if (player.isErr()) return <ErrorPage error={player.error} caller="/players/edit page" />;
  if (role.value.role !== "admin" && player.value.auth_user_uuid !== role.value.auth_user_uuid) {
    return <ErrorPage error="You are not authorized to edit this player." caller="/players/[username]/edit page" />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/players/${player.value.users.username}`}>
        Go back
      </TypographyLink>
      <TypographyH1 className="mt-2">Edit Your Public Player Page</TypographyH1>
      <PlayerEditForm player={player.value} />
    </div>
  );
}