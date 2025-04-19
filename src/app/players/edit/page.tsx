import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getPlayerAuthUserUuid } from "@/lib/players/query-auth-user-uuid";
import { getUser } from "@/lib/auth/user";
import { PlayerEditForm } from "./form";

export default async function Page() {
  const result = await getUser().andThen((user) =>
    getPlayerAuthUserUuid({ authUserUuid: user.id })
  );

  if (result.isErr()) {
    return <ErrorPage error={result.error} caller="/players/edit page" />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/players/${result.value.users.username}`}>
        Go back
      </TypographyLink>
      <TypographyH1 className="mt-2">Edit Your Public Player Page</TypographyH1>
      <PlayerEditForm player={result.value} />
    </div>
  );
}