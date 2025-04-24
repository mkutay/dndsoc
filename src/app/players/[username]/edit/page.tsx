import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { PlayerEditForm } from "./form";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await DB.Players.Get.Username({ username });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/players/[username]" />;
  const player = result.value;

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/players/[username]" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsPlayer = (auth && player.auth_user_uuid === auth.auth_user_uuid) || false || role === "admin";

  if (!ownsPlayer) return <ErrorPage error={{ code: "NOT_AUTHORIZED", message: "You do not have permission to edit this player." }} caller="/players/[username]" isForbidden />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/players/${player.users.username}`} className="tracking-wide font-quotes">
        Go Back
      </TypographyLink>
      <TypographyH1 className="mt-0.5">Edit Your Public Player Page</TypographyH1>
      <PlayerEditForm player={player} />
    </div>
  );
}