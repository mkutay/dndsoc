import { format } from "date-fns";

import { getReceivedAchievements } from "@/lib/received-achievements/query-ids";
import { getAchievementsFromIds } from "@/lib/achievements/query-ids";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { TypographyParagraph, TypographySmall } from "./typography/paragraph";
import { ErrorPage } from "./error-page";

export async function AchievementCards({
  achievementIds,
  userUuid,
}: {
  achievementIds: string[];
  userUuid: string;
}) {
  const achievementsResult = await getAchievementsFromIds(achievementIds);
  if (!achievementsResult.isOk()) {
    return <ErrorPage error={achievementsResult.error.message} />;
  }
  const achievements = achievementsResult.value;

  const receivedAchievementsResult = await getReceivedAchievements(achievementIds, userUuid);
  if (!receivedAchievementsResult.isOk()) {
    return <ErrorPage error={receivedAchievementsResult.error.message} />;
  }
  const receivedAchievements = receivedAchievementsResult.value;

  // combine the achievements and received achievements
  const combinedAchievements = achievements.map((achievement) => {
    const receivedAchievement = receivedAchievements.find((received) => received.achievement_uuid === achievement.id);
    return {
      ...achievement,
      receivedAchievement,
    };
  });

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-8">
      {combinedAchievements.map((achievement) => (
        <Card key={achievement.id} className="w-full">
          <CardHeader>
            <CardTitle>{achievement.name}</CardTitle>
            {achievement.receivedAchievement && <CardDescription>
              Recived {achievement.receivedAchievement.count} times
            </CardDescription>}
          </CardHeader>
          <CardContent>
            <TypographyParagraph>
              {achievement.description}
            </TypographyParagraph>
          </CardContent>
          {achievement.receivedAchievement && <CardFooter>
            {achievement.receivedAchievement.first_received_date !== achievement.receivedAchievement.last_received_date ? <div className="flex flex-col gap-2">
              <TypographySmall>First received on: {format(achievement.receivedAchievement.first_received_date, "PP")}</TypographySmall>
              <TypographySmall>Last received on: {format(achievement.receivedAchievement.last_received_date, "PP")}</TypographySmall>
            </div> : <TypographyParagraph>
              Received on: {format(achievement.receivedAchievement.first_received_date, "PP")}
            </TypographyParagraph>}
          </CardFooter>}
        </Card>
      ))}
    </div>
  )
}