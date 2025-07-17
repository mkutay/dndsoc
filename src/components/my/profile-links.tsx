import { ProfileLinksClient } from "./profile-links-client";
import { type Enums, type Tables } from "@/types/database.types";
import { getPublicUrl } from "@/lib/storage";
import { ErrorPage } from "@/components/error-page";
import { runQuery } from "@/utils/supabase-run";

export async function ProfileLinks({ role, user }: { role: Enums<"role">; user: Tables<"users"> }) {
  const player = await getPlayerByUsername({ username: user.username });
  const dm = role === "admin" || role === "dm" ? await getDMByUsername({ username: user.username }) : null;

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
      }
    : undefined;

  return (
    <ProfileLinksClient
      username={user.username}
      name={user.name}
      dm={dmProps}
      player={{
        imageUrl: playerImageUrl?.value ?? null,
        level: player.value.level,
        achievementsCount: player.value.received_achievements_player.length,
        about: player.value.about,
      }}
    />
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
