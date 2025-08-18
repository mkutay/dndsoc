import { GiBowArrow } from "react-icons/gi";
import Link from "next/link";

import { AchievementRequestsTable } from "@/components/achievement-requests-table";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";
import { runQuery } from "@/utils/supabase-run";

export async function MyAchievementRequests({ role }: { role: "dm" | "admin" }) {
  const characterRequests = await getPendingRequests("character");
  const playerRequests = await getPendingRequests("player");
  const dmRequests = role === "admin" ? await getPendingRequests("dm") : null;

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <GiBowArrow size={36} />
        <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
          Pending Achievement Requests
        </h3>
      </div>
      <AchievementRequestsTable
        characterRequests={characterRequests.value}
        playerRequests={playerRequests.value}
        dmRequests={dmRequests?.value}
        path="/my"
      />
      <div className="flex justify-end">
        <Button variant="outline" asChild className="w-fit" size="lg">
          <Link href="/achievement-requests">See All Requests</Link>
        </Button>
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
  players: Tables<"players"> & {
    users: Tables<"users">;
  };
  dms:
    | (Tables<"dms"> & {
        users: Tables<"users">;
      })
    | null;
};

type AchievementRequestDm = Tables<"achievement_requests_dm"> & {
  achievements: Tables<"achievements">;
  dms: Tables<"dms"> & {
    users: Tables<"users">;
  };
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
        `*, achievements(*), ${receiver}s(*${receiver !== "character" ? ", users(*)" : ""}), ${receiver === "character" || receiver === "player" ? "dms(*, users(*))" : "users(*)"}`,
      )
      .order("created_at", { ascending: false })
      .eq("status", "pending"),
  );
}
