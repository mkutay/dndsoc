import Link from "next/link";

import { TypographyH2 } from "../../../../../components/typography/headings";
import { ErrorPage } from "../../../../../components/error-page";
import { type Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

export async function ReceivedAchievementsDM({ achievement }: { achievement: Tables<"achievements"> }) {
  if (achievement.type !== "dm") return null;

  const result = await getReceivedAchievementsDM(achievement.id);
  if (result.isErr()) return <ErrorPage error={result.error} caller="received-achievements-dm.tsx" />;
  const dms = result.value;

  if (dms.length === 0) {
    return (
      <div className="font-titles-of-tables text-2xl max-w-prose mt-6">
        The realm awaits your recognition... No dungeon master has earned this honor yet.
        <div className="mt-4">Perhaps your stories shall be the first to achieve this accolade?</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2>Received DMS</TypographyH2>
      <div className="flex flex-row flex-wrap gap-4 max-w-xl">
        {dms.map((dm) => (
          <Link
            key={dm.dm_uuid}
            className="p-4 bg-card text-card-foreground rounded-2xl shadow hover:bg-card/80 transition-colors text-lg w-fit font-quotes"
            href={`/dms/${dm.dms.users.username}`}
          >
            {dm.dms.users.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

const getReceivedAchievementsDM = (id: string) =>
  runQuery((supabase) =>
    supabase.from("received_achievements_dm").select("*, dms(*, users!inner(*))").eq("achievement_uuid", id),
  );
