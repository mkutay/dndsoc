import { notFound } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { getPlayerByUsername } from "@/lib/players/query-username";
import { getUsers } from "@/lib/users";
import { getRole } from "@/lib/roles";
import { AdminRoleEditForm } from "./role-form";

export const dynamicParams = false;
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const player = await getPlayerByUsername({ username });
  if (player.isErr()) {
    console.error(player.error);
    notFound();
  }

  const role = await getRole({ authUuid: player.value.auth_user_uuid });
  if (role.isErr()) {
    console.error(role.error);
    notFound();
  }

  // if (role.value.role === "admin") {
  //   return (
  //     <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
  //       <TypographyH1>{username}</TypographyH1>
  //       <TypographyParagraph>You cannot edit an admin.</TypographyParagraph>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>{username}</TypographyH1>
      <AdminRoleEditForm role={role.value} />
    </div>
  );
}

export async function generateStaticParams() {
  const users = await getUsers();
  if (users.isErr()) return [];

  return users.value.map((user) => ({
    username: user.username,
  }));
}