import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLarge } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getPlayerByUsername } from "@/lib/players";
import { getRole } from "@/lib/roles";
import { AdminRoleEditForm } from "./role-form";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const player = await getPlayerByUsername({ username });
  if (player.isErr()) {
    return <ErrorPage error={player.error} isNotFound />;
  }

  const role = await getRole({ authUuid: player.value.auth_user_uuid });
  if (role.isErr()) {
    return <ErrorPage error={role.error} isNotFound />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>{username}</TypographyH1>
      {role.value.role === "admin" && (
        <TypographyLarge className="mt-2">NOTE: You cannot edit an admin.</TypographyLarge>
      )}
      <AdminRoleEditForm role={role.value} />
    </div>
  );
}