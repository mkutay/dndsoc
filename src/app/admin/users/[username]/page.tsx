import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLarge } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { AdminRoleEditForm } from "./role-form";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const player = await DB.Players.Get.Username({ username });
  if (player.isErr()) return { title: "Player Not Found", description: "This player does not exist." };
  const role = await DB.Roles.Get.Auth({ authUuid: player.value.auth_user_uuid });
  if (role.isErr()) return { title: "Role Not Found", description: "This role does not exist." };

  const name = player.value.users.name;
  const title = `Admin View: ${name} (${username})`;
  const description = `Admin view of ${name}'s role.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const player = await DB.Players.Get.Username({ username });
  if (player.isErr()) return <ErrorPage error={player.error} caller="/admin/users/[username]/page.tsx" isNotFound />;

  const role = await DB.Roles.Get.Auth({ authUuid: player.value.auth_user_uuid });
  if (role.isErr()) return <ErrorPage error={role.error} caller="/admin/users/[username]/page.tsx" />;

  const name = player.value.users.name;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>{name} ({username})</TypographyH1>
      {role.value.role === "admin" && (
        <TypographyLarge className="mt-2">NOTE: You cannot edit an admin.</TypographyLarge>
      )}
      <AdminRoleEditForm role={role.value} />
    </div>
  );
}

export async function generateStaticParams() {
  const users = await DB.Users.Get.All();
  if (users.isErr()) return [];
  return users.value.map((user) => ({ username: user.username }));
}