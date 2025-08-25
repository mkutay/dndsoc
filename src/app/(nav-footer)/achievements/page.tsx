import { type Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { runQuery } from "@/utils/supabase-run";
import { type Tables } from "@/types/database.types";
import { truncateText } from "@/utils/formatting";
import { Button } from "@/components/ui/button";
import { CreateAchievement } from "@/app/(nav-footer)/achievements/_components/create-achievement";
import { getUserRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Explore the achievements you can earn in our game. Each achievement has its own unique challenges and rewards.",
  openGraph: {
    title: "Achievements",
    description:
      "Explore the achievements you can earn in our game. Each achievement has its own unique challenges and rewards.",
  },
};

export default async function Page() {
  const achievements = await getAllAchievements();
  if (achievements.isErr()) return <ErrorPage error={achievements.error} />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Achievements</TypographyH1>
      <Suspense>
        <Create />
      </Suspense>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {achievements.value.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

async function Create() {
  const user = await getUserRole();
  if (user.isErr()) return null;
  if (user.value.role !== "admin" && user.value.role !== "dm") return null;
  return (
    <CreateAchievement>
      <Button variant="outline" type="button" className="w-fit ml-auto mt-4">
        Create Achievement
      </Button>
    </CreateAchievement>
  );
}

function AchievementCard({ achievement }: { achievement: Tables<"achievements"> }) {
  const points = achievement.points + " point" + (achievement.points !== 1 ? "s" : "");
  const difficulty = achievement.difficulty ? `(${achievement.difficulty})` : null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="sm:text-3xl text-2xl sm:tracking-widest tracking-wide">{achievement.name}</CardTitle>
        <CardDescription className="flex flex-row">
          {points}
          {difficulty ? " " : null}
          {difficulty}
        </CardDescription>
      </CardHeader>
      <CardContent className="sm:text-base text-sm">{truncateText(achievement.description, 100)}</CardContent>
      <CardFooter className="flex flex-row justify-end">
        <Button asChild size="sm" variant="default">
          <Link href={`/achievements/${achievement.shortened}`}>See More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

const getAllAchievements = () =>
  runQuery((supabase) =>
    supabase.from("achievements").select("*").eq("is_hidden", false).order("points", { ascending: true }),
  );
