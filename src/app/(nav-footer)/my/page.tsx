import { forbidden } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { getCharactersByAuthUuid } from "@/lib/characters";
import { getPartiesByDMAuthUuid } from "@/lib/parties";
import { TypographyH1 } from "@/components/typography/headings";
import { getPublicUrl } from "@/lib/storage";
import { runQuery } from "@/utils/supabase-run";
import { MyProfile } from "@/components/my/my-profile";
import { MyCharacters } from "@/components/my/my-characters";
import { MyParties } from "@/components/my/my-parties";
import { MyAssociatesRequests } from "@/components/my/my-associates-requests";
import { ProfileLinksClient } from "@/components/my/profile-links-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // from profile linkes

  const player = await getPlayerByUsername({ username: user.users.username });
  const dm = role === "admin" || role === "dm" ? await getDMByUsername({ username: user.users.username }) : null;

  if (player.isErr()) return <ErrorPage error={player.error} caller="/components/my/profile-links.tsx" />;

  const playerImageUrl = player.value.images ? getPublicUrl({ path: player.value.images.name }) : null;
  const DMImageUrl = dm?.isOk() && dm.value.images ? getPublicUrl({ path: dm.value.images.name }) : null;

  if (playerImageUrl && playerImageUrl.isErr()) {
    return <ErrorPage error={playerImageUrl.error} caller="/components/my/profile-links.tsx" />;
  }

  if (DMImageUrl && DMImageUrl.isErr()) {
    return <ErrorPage error={DMImageUrl.error} caller="/components/my/profile-links.tsx" />;
  }

  const dmProps = dm?.isOk()
    ? {
        imageUrl: DMImageUrl?.value ?? null,
        level: dm.value.level,
        achievementsCount: dm.value.received_achievements_dm.length,
        campaignsCount: (() => {
          const campaignIds = new Set<string>();
          dm.value.dm_party.forEach((party) => {
            party.parties.party_campaigns.forEach((campaign) => {
              campaignIds.add(campaign.campaigns.id);
            });
          });
          return campaignIds.size;
        })(),
        about: dm.value.about,
        id: dm.value.id,
      }
    : undefined;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Your Page</TypographyH1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ProfileLinksClient
          username={user.users.username}
          name={user.users.name}
          dm={dmProps}
          player={{
            imageUrl: playerImageUrl?.value ?? null,
            level: player.value.level,
            achievementsCount: player.value.received_achievements_player.length,
            about: player.value.about,
            id: player.value.id,
          }}
        />
        <MyProfile
          username={user.users.username}
          knumber={user.users.knumber}
          name={user.users.name}
          email={user.users.email}
        />
      </div>

      <div className="mt-10 space-y-10">
        <MyCharacters characters={characters.value} />
        {(role === "admin" || role === "dm") && (
          <MyParties parties={partiesDM.value} dmUuid={partiesDM.value[0]?.dm_party[0].dm_id} />
        )}
        {role === "admin" && <MyAssociatesRequests />}
      </div>
    </div>
  );
}

const getDMByUsername = ({ username }: { username: string }) =>
  runQuery((supabase) =>
    supabase
      .from("dms")
      .select(
        `*, users!inner(*), received_achievements_dm(*, achievements(*)), dm_party(*, parties(*, party_campaigns(*, campaigns(*)))), images(*)`,
      )
      .eq("users.username", username)
      .single(),
  );

const getPlayerByUsername = ({ username }: { username: string }) =>
  runQuery(
    (supabase) =>
      supabase
        .from("players")
        .select(`*, users!inner(*), received_achievements_player(*, achievements(*)), characters(*), images(*)`)
        .eq("users.username", username)
        .single(),
    "getPlayerByUsername",
  );
