import { okAsync, ResultAsync } from "neverthrow";
import { GiCrossedSwords } from "react-icons/gi";
import { forbidden } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { TypographyH1 } from "@/components/typography/headings";
import { getWithImage } from "@/lib/storage";
import { runQuery } from "@/utils/supabase-run";
import { MyProfile } from "@/components/my/my-profile";
import { Characters } from "@/components/characters";
import { MyParties } from "@/components/my/my-parties";
import { MyAssociatesRequests } from "@/components/my/my-associates-requests";
import { ProfileLinksClient } from "@/components/my/profile-links-client";
import { MyAdmin } from "@/components/my/my-admin";
import { MyAchievementRequests } from "@/components/my/my-achievement-requests";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userR = getUserRole();

  const playerR = userR.andThen((user) => getPlayer(user.auth_user_uuid).andThen(getWithImage));

  const DMR = userR.andThen((user) =>
    user.role === "dm" || user.role === "admin"
      ? getDM(user.auth_user_uuid).andThen(getWithImage)
      : okAsync({ data: undefined, url: undefined }),
  );

  const result = await ResultAsync.combine([userR, playerR, DMR]);

  if (result.isErr()) {
    return result.error.code === "NOT_LOGGED_IN" ? (
      forbidden()
    ) : (
      <ErrorPage error={result.error} caller="/my/page.tsx" />
    );
  }

  const [user, { data: player, url: playerUrl }, { data: dm, url: DMUrl }] = result.value;

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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GiCrossedSwords size={36} />
          <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
            Your Characters ({player.characters.length})
          </h3>
        </div>
        <Characters characters={player.characters} playerId={player.id} />
      </div>
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
      {user.role === "dm" || user.role === "admin" ? <MyAchievementRequests role={user.role} /> : null}
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
