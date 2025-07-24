import { forbidden } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { getCharactersByAuthUuid } from "@/lib/characters";
import { getPartiesByDMAuthUuid } from "@/lib/parties";
import { TypographyH1 } from "@/components/typography/headings";
import { ProfileLinks } from "@/components/my/profile-links";
import { MyProfile } from "@/components/my/my-profile";
import { MyCharacters } from "@/components/my/my-characters";
import { MyParties } from "@/components/my/my-parties";
import { MyAssociatesRequests } from "@/components/my/my-associates-requests";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userResult = await getUserRole();
  if (userResult.isErr()) {
    if (userResult.error.code !== "NOT_LOGGED_IN")
      return <ErrorPage error={userResult.error} caller="/my/page.tsx (user)" />;
    else forbidden();
  }

  const user = userResult.value;
  const role = user.role;

  const characters = await getCharactersByAuthUuid({ authUuid: user.auth_user_uuid });
  if (characters.isErr()) return <ErrorPage error={characters.error} caller="/my/page.tsx (characters)" />;

  const partiesDM = await getPartiesByDMAuthUuid({ authUuid: user.auth_user_uuid });
  if (partiesDM.isErr()) return <ErrorPage error={partiesDM.error} caller="/my/page.tsx (parties)" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Your Page</TypographyH1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ProfileLinks role={role} user={user.users} />
        <MyProfile
          username={user.users.username}
          knumber={user.users.knumber}
          name={user.users.name}
          email={user.users.email}
        />
      </div>

      <div className="mt-10 space-y-10">
        <MyCharacters characters={characters.value} />
        <MyParties parties={partiesDM.value} dmUuid={partiesDM.value[0]?.dm_party[0].dm_id} />
        {role === "admin" && <MyAssociatesRequests />}
      </div>
    </div>
  );
}
