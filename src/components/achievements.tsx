import { format } from "date-fns";

import { getCombinedAchievements } from "@/lib/achievements/query-combined";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { TypographyParagraph, TypographySmall } from "./typography/paragraph";
import { ErrorPage } from "./error-page";

export async function AchievementCards({
  achievementIds,
}: {
  achievementIds: string[];
}) {
  const combinedResult = await getCombinedAchievements(achievementIds);
  if (combinedResult.isErr()) {
    return <ErrorPage error={combinedResult.error.message} />;
  }
  const combined = combinedResult.value;

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {combined.map((achievement) => (
        <Card key={achievement.id} className="w-full">
          <CardHeader>
            <CardTitle>{achievement.name}</CardTitle>
            {achievement.received_achievements && <CardDescription>
              Recived {achievement.received_achievements[0].count} times
            </CardDescription>}
          </CardHeader>
          <CardContent>
            <TypographyParagraph>
              {achievement.description}
            </TypographyParagraph>
          </CardContent>
          {achievement.received_achievements && <CardFooter>
            {achievement.received_achievements[0].first_received_date !== achievement.received_achievements[0].last_received_date ? <div className="flex flex-col gap-2">
              <TypographySmall>First received on: {format(achievement.received_achievements[0].first_received_date, "PP")}</TypographySmall>
              <TypographySmall>Last received on: {format(achievement.received_achievements[0].last_received_date, "PP")}</TypographySmall>
            </div> : <TypographyParagraph>
              Received on: {format(achievement.received_achievements[0].first_received_date, "PP")}
            </TypographyParagraph>}
          </CardFooter>}
        </Card>
      ))}
    </div>
  )
}