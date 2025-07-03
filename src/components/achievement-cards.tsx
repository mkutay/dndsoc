import Link from "next/link";

import {
  ReceivedAchievementsCharacter,
  ReceivedAchievementsDM,
  ReceivedAchievementsPlayer,
} from "@/types/full-database.types";

export async function AchievementCards({
  receivedAchievements,
}: {
  receivedAchievements: ReceivedAchievementsPlayer[] | ReceivedAchievementsDM[] | ReceivedAchievementsCharacter[];
}) {
  const times = [
    "Never",
    "Once",
    "Twice",
    "Thrice",
    "Quarce",
    "Five Times",
    "Six Times",
    "Seven Times",
    "Eight Times",
    "Nine Times",
    "Ten Times",
    "Eleven Times",
    "Twelve Times",
    "Thirteen Times",
    "Fourteen Times",
    "Fifteen Times",
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {receivedAchievements.map((achievement) => (
        <Link
          key={achievement.achievement_uuid}
          className="w-fit flex flex-row items-center gap-4 px-6 py-4 bg-card rounded-2xl shadow-md hover:bg-card/80 transition-all"
          href={`/achievements/${achievement.achievements.shortened}`}
        >
          <div className="font-quotes text-lg">{achievement.achievements.name}</div>
          <div className="w-3.5 h-3.5 bg-linear-to-br from-white/30 to-gray-400 rounded-full shadow-inner border border-white/20"></div>
          <div className="tracking-wide">Received {times[achievement.count]}</div>
        </Link>
      ))}
    </div>
  );
}

// Old card, LOL:
{
  /* <Card key={index} className="w-full">
  <CardHeader>
    <CardTitle>{achievement.achievements.name}</CardTitle>
    <CardDescription>
      Recived {times[achievement.count]}
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
</Card> */
}
