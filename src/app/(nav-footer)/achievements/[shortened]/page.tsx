import { InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import { cache, Suspense } from "react";

import {
  TypographyLarge,
  TypographyLead,
  TypographyParagraph,
  TypographySmall,
} from "@/components/typography/paragraph";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReceivedAchievementsCharacter } from "@/components/achievements/received-achievements-characters";
import { ReceivedAchievementsDM } from "@/components/achievements/received-achievements-dm";
import { ReceivedAchievementsPlayer } from "@/components/achievements/received-achievements-player";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { type Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { EditAchievementSheet } from "@/components/achievements/edit-achievement-sheet";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const getAchievementByShortened = (shortened: string) =>
  runQuery((supabase) => supabase.from("achievements").select("*").eq("shortened", shortened).single());

const cachedGetAchievementByShortened = cache(getAchievementByShortened);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await cachedGetAchievementByShortened(shortened);
  if (result.isErr()) return { title: "Achievement Not Found" };
  const achievement = result.value;

  return {
    title: achievement.name,
    description: achievement.description_long ?? achievement.description,
    openGraph: {
      title: achievement.name,
      description: achievement.description_long ?? achievement.description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetAchievementByShortened(shortened);
  if (result.isErr()) return <ErrorPage error={result.error} />;
  const achievement = result.value;

  const description = achievement.description_long ?? achievement.description;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {achievement.difficulty ? (
        <TypographySmall className="uppercase text-muted-foreground">
          Difficulty: {achievement.difficulty}
        </TypographySmall>
      ) : null}
      <TypographyH1>{achievement.name}</TypographyH1>
      <TypographyLead className="max-w-prose">{description}</TypographyLead>
      {achievement.points ? (
        <div className="mt-6 flex flex-row items-center gap-3 flex-wrap">
          <TypographyLarge>Points: {achievement.points}</TypographyLarge>
          <div className="flex flex-row items-center gap-1 mb-0.5 flex-wrap">
            {Array.from({ length: achievement.points / 5 }, (_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-linear-to-br from-blue-300 to-blue-600 rounded-full shadow-lg border border-blue-200"
              />
            ))}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="mb-px">
                <InfoIcon className="text-foreground hover:text-foreground/80 transition-all" />
              </TooltipTrigger>
              <TooltipContent>
                <TypographyParagraph>
                  This is the experience points awarded for completing this achievement.
                </TypographyParagraph>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : null}
      <Suspense>
        <Edit achievement={achievement} />
      </Suspense>
      <Received achievement={achievement} />
    </div>
  );
}

function Received({ achievement }: { achievement: Tables<"achievements"> }) {
  let received = null;
  if (achievement.type === "player") received = <ReceivedAchievementsPlayer achievement={achievement} />;
  else if (achievement.type === "dm") received = <ReceivedAchievementsDM achievement={achievement} />;
  else if (achievement.type === "character") received = <ReceivedAchievementsCharacter achievement={achievement} />;

  return <div className="mt-6">{received}</div>;
}

async function Edit({ achievement }: { achievement: Tables<"achievements"> }) {
  const user = await getUserRole();
  if (user.isErr()) return null;
  if (user.value.role !== "admin" && user.value.role !== "dm") return null;
  if (user.value.role === "dm" && achievement.type !== "dm") return null;

  return (
    <EditAchievementSheet achievement={achievement} path={`/achievements/${achievement.shortened}`}>
      <Button className="w-fit mt-4 ml-auto" variant="outline">
        Edit Achievement
      </Button>
    </EditAchievementSheet>
  );
}
