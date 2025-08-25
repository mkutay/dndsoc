import { okAsync, ResultAsync } from "neverthrow";
import { GiBowArrow, GiCrossedSwords, GiCrown } from "react-icons/gi";
import { forbidden } from "next/navigation";
import { cache, Suspense } from "react";

import { MyProfile } from "./_components/my-profile";
import { ProfileLinksClient } from "./_components/profile-links-client";
import { MyParties } from "./_components/my-parties";
import { MyAchievementRequests } from "./_components/my-achievement-requests";
import { MyAssociatesRequests } from "./_components/my-associates-requests";
import { MyAdmin } from "./_components/my-admin";
import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { TypographyH1 } from "@/components/typography/headings";
import { getWithImage } from "@/lib/storage";
import { runQuery } from "@/utils/supabase-run";
import { Characters } from "@/components/characters";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

const getUser = cache(getUserRole);

const getDM = cache((userId: string) =>
  runQuery((supabase) =>
    supabase
      .from("dms")
      .select(`*, received_achievements_dm(count), dm_party(*, parties(*)), images(*)`)
      .eq("auth_user_uuid", userId)
      .single(),
  ).andThen(getWithImage),
);

const getAdmin = cache((userId: string) =>
  runQuery((supabase) => supabase.from("admins").select(`*, images(*)`).eq("auth_user_uuid", userId).single()).andThen(
    getWithImage,
  ),
);

const getPlayer = cache((userId: string) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .select(`*, received_achievements_player(count), characters(*, races(*), classes(*)), images(*)`)
      .eq("auth_user_uuid", userId)
      .single(),
  ).andThen(getWithImage),
);

export default async function Page() {
  const result = await getUser();

  if (result.isErr()) {
    return result.error.code === "NOT_LOGGED_IN" ? (
      forbidden()
    ) : (
      <ErrorPage error={result.error} caller="/my/page.tsx" />
    );
  }

  const user = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4 space-y-8">
      <TypographyH1>Your Page</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-[330px] w-full rounded-lg" />}>
          <ProfileLinksSuspense />
        </Suspense>
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
            Your Characters
          </h3>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[278px] w-full rounded-lg" />
              ))}
            </div>
          }
        >
          <CharactersSuspense />
        </Suspense>
      </div>
      {user.role === "admin" || user.role === "dm" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GiCrown size={36} />
            <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
              Parties You DM
            </h3>
          </div>
          <Suspense>
            <PartiesSuspense
              user={{
                auth_user_uuid: user.users.auth_user_uuid,
                role: user.role,
              }}
            />
          </Suspense>
        </div>
      ) : null}
      {user.role === "dm" || user.role === "admin" ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <GiBowArrow size={36} />
            <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
              Pending Achievement Requests
            </h3>
          </div>
          <Suspense>
            <MyAchievementRequests role={user.role} />
          </Suspense>
        </div>
      ) : null}
      {user.role === "admin" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <GiBowArrow size={36} />
            <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
              Pending Associates Requests
            </h3>
          </div>
          <Suspense>
            <MyAssociatesRequests />
          </Suspense>
        </div>
      )}
      {user.role === "admin" && <MyAdmin />}
    </div>
  );
}

async function PartiesSuspense({ user }: { user: { auth_user_uuid: string; role: "dm" | "admin" } }) {
  const result = await getDM(user.auth_user_uuid);

  if (result.isErr()) {
    return null;
  }

  const { data: dm } = result.value;

  return dm && (user.role === "admin" || user.role === "dm") ? (
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
  ) : null;
}

async function CharactersSuspense() {
  const playerR = await getUser().andThen((user) => getPlayer(user.auth_user_uuid));
  if (playerR.isErr()) {
    return null;
  }
  const { data: player } = playerR.value;

  return <Characters characters={player.characters} playerId={player.id} />;
}

async function ProfileLinksSuspense() {
  const userR = getUser();
  const playerR = userR.andThen((user) => getPlayer(user.auth_user_uuid));

  const DMR = userR.andThen((user) =>
    user.role === "dm" || user.role === "admin"
      ? getDM(user.auth_user_uuid)
      : okAsync({ data: undefined, url: undefined }),
  );

  const adminR = userR.andThen((user) =>
    user.role === "admin" ? getAdmin(user.auth_user_uuid) : okAsync({ data: undefined, url: undefined }),
  );

  const result = await ResultAsync.combine([userR, playerR, DMR, adminR]);

  if (result.isErr()) {
    return null;
  }

  const [user, { data: player, url: playerUrl }, { data: dm, url: DMUrl }, { data: admin, url: adminUrl }] =
    result.value;

  return (
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
      admin={
        admin
          ? {
              imageUrl: adminUrl,
              about: admin.about,
              id: admin.id,
            }
          : undefined
      }
    />
  );
}
