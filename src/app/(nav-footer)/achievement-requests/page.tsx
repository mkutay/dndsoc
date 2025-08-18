import { forbidden } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getUserRole } from "@/lib/roles";
import type { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";
import { AchievementRequestsTable } from "@/components/achievement-requests-table";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? forbidden() : <ErrorPage error={user.error} />;
  }

  if (user.value.role !== "admin" && user.value.role !== "dm") {
    return forbidden();
  }

  const characterRequests = await getPendingRequests("character");
  const playerRequests = await getPendingRequests("player");
  const dmRequests = user.value.role === "admin" ? await getPendingRequests("dm") : null;

  if (characterRequests.isErr()) {
    return <ErrorPage error={characterRequests.error} />;
  }

  if (playerRequests.isErr()) {
    return <ErrorPage error={playerRequests.error} />;
  }

  if (dmRequests && dmRequests.isErr()) {
    return <ErrorPage error={dmRequests.error} />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="space-y-8">
        <div>
          <TypographyH1>Achievement Requests</TypographyH1>
          <TypographyParagraph className="text-muted-foreground">
            Manage achievement requests for the D&D Society, characters, players, and DMs.
          </TypographyParagraph>
        </div>
        <AchievementRequestsTable
          characterRequests={characterRequests.value}
          playerRequests={playerRequests.value}
          dmRequests={dmRequests?.value}
          path="/achievement-requests"
        />
      </div>
    </div>
  );
}

type AchievementRequestCharacter = Tables<"achievement_requests_character"> & {
  achievements: Tables<"achievements">;
  characters: Tables<"characters">;
  dms:
    | (Tables<"dms"> & {
        users: Tables<"users">;
      })
    | null;
};

type AchievementRequestPlayer = Tables<"achievement_requests_player"> & {
  achievements: Tables<"achievements">;
  players: Tables<"players">;
  dms:
    | (Tables<"dms"> & {
        users: Tables<"users">;
      })
    | null;
};

type AchievementRequestDm = Tables<"achievement_requests_dm"> & {
  achievements: Tables<"achievements">;
  dms: Tables<"dms">;
  users: Tables<"users"> | null;
};

function getPendingRequests(receiver: "character"): ReturnType<typeof runQuery<AchievementRequestCharacter[]>>;
function getPendingRequests(receiver: "player"): ReturnType<typeof runQuery<AchievementRequestPlayer[]>>;
function getPendingRequests(receiver: "dm"): ReturnType<typeof runQuery<AchievementRequestDm[]>>;
function getPendingRequests(receiver: "character" | "player" | "dm") {
  return runQuery((supabase) =>
    supabase
      .from(`achievement_requests_${receiver}`)
      .select(
        `*, achievements(*), ${receiver}s(*), ${receiver === "character" || receiver === "player" ? "dms(*, users(*))" : "users(*)"}`,
      )
      .order("status", { ascending: false })
      .order("created_at", { ascending: false }),
  );
}
