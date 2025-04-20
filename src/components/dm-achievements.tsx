import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { TypographyParagraph, TypographySmall } from "./typography/paragraph";
import { ReceivedAchievementsDM } from "@/types/full-database.types";

export async function DMAchievementCards({
  receivedAchievements,
}: {
  receivedAchievements: ReceivedAchievementsDM[];
}) {
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {receivedAchievements.map((achievement, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <CardTitle>{achievement.achievements.name}</CardTitle>
            <CardDescription>
              Recived {achievement.count} times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TypographyParagraph>
              {achievement.achievements.description}
            </TypographyParagraph>
          </CardContent>
          <CardFooter>
            {achievement.first_received_date !== achievement.last_received_date ? <div className="flex flex-col gap-2">
              <TypographySmall>First received on: {format(achievement.first_received_date, "PP")}</TypographySmall>
              <TypographySmall>Last received on: {format(achievement.last_received_date, "PP")}</TypographySmall>
            </div> : <TypographyParagraph>
              Received on: {format(achievement.first_received_date, "PP")}
            </TypographyParagraph>}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}