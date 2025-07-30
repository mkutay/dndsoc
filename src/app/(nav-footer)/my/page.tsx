import { forbidden } from "next/navigation";
import { ok, okAsync, ResultAsync } from "neverthrow";

import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { TypographyH1 } from "@/components/typography/headings";
import { getPublicUrl } from "@/lib/storage";
import { runQuery } from "@/utils/supabase-run";
import { MyProfile } from "@/components/my/my-profile";
import { MyCharacters } from "@/components/my/my-characters";
import { MyParties } from "@/components/my/my-parties";
import { MyAssociatesRequests } from "@/components/my/my-associates-requests";
import { ProfileLinksClient } from "@/components/my/profile-links-client";
import { MyAdmin } from "@/components/my/my-admin";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userR = getUserRole();

  const playerR = userR.andThen((user) =>
    getPlayer(user.auth_user_uuid)
      .andThen((player) =>
        player.images
          ? getPublicUrl({ path: player.images.name }).map((url) => ({ url, player }))
          : ok({ player, url: undefined }),
      )
      .map(({ player, url }) => ({ player, url })),
  );

  const DMR = userR.andThen((user) =>
    user.role === "dm" || user.role === "admin"
      ? getDM(user.auth_user_uuid).andThen((dm) =>
          dm.images ? getPublicUrl({ path: dm.images.name }).map((url) => ({ url, dm })) : ok({ dm, url: undefined }),
        )
      : okAsync({ dm: undefined, url: undefined }),
  );

  const result = await ResultAsync.combine([userR, playerR, DMR]);

  if (result.isErr()) {
    return result.error.code === "NOT_LOGGED_IN" ? (
      forbidden()
    ) : (
      <ErrorPage error={result.error} caller="/my/page.tsx" />
    );
  }

  const [user, { player, url: playerUrl }, { dm, url: DMUrl }] = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4 space-y-8">
      <TypographyH1>Your Page</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileLinksClient
          username={user.users.username}
          name={user.users.name}
          dm={
            dm
              ? {
                  imageUrl: DMUrl,
                  level: dm.level,
                  achievementsCount: dm.received_achievements_dm
                    .map(({ count }) => count)
                    .reduce((prev, now) => prev + now, 0),
                  about: dm.about,
                  id: dm.id,
                }
              : undefined
          }
          player={{
            imageUrl: playerUrl,
            level: player.level,
            achievementsCount: player.received_achievements_player
              .map(({ count }) => count)
              .reduce((prev, now) => prev + now, 0),
            about: player.about,
            id: player.id,
          }}
        />
        <MyProfile
          username={user.users.username}
          knumber={user.users.knumber}
          name={user.users.name}
          email={user.users.email}
        />
      </div>
      <MyCharacters characters={player.characters} playerId={player.id} />
      {dm && (user.role === "admin" || user.role === "dm") ? (
        <MyParties
          parties={dm.dm_party.map((dp) => ({
            about: dp.parties.about,
            id: dp.parties.id,
            image_uuid: dp.parties.image_uuid,
            level: dp.parties.level,
            name: dp.parties.name,
            shortened: dp.parties.shortened,
          }))}
          dmUuid={dm.id}
          role={user.role}
        />
      ) : null}
      {user.role === "admin" && <MyAssociatesRequests />}
      {user.role === "admin" && <MyAdmin />}
    </div>
  );
}

const getDM = (userId: string) =>
  runQuery((supabase) =>
    supabase
      .from("dms")
      .select(`*, received_achievements_dm(count), dm_party(*, parties(*)), images(*)`)
      .eq("auth_user_uuid", userId)
      .single(),
  );

const getPlayer = (userId: string) =>
  runQuery(
    (supabase) =>
      supabase
        .from("players")
        .select(`*, received_achievements_player(count), characters(*, races(*), classes(*)), images(*)`)
        .eq("auth_user_uuid", userId)
        .single(),
    "getPlayerByUsername",
  );
