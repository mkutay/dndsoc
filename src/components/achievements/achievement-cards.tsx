import Link from "next/link";

import { GiveAchievement } from "./give-achievement";
import { RemoveAchievement } from "./remove-achievement";
import type {
  ReceivedAchievementsCharacter,
  ReceivedAchievementsDM,
  ReceivedAchievementsPlayer,
} from "@/types/full-database.types";
import type { Tables } from "@/types/database.types";

type Props = {
  receivedAchievements: ReceivedAchievementsPlayer[] | ReceivedAchievementsDM[] | ReceivedAchievementsCharacter[];
} & (
  | {
      achievements: Tables<"achievements">[];
      receiverType: "player" | "character" | "dm";
      receiverId: string;
      path: string;
    }
  | { achievements?: never }
);

export async function AchievementCards(props: Props) {
  const { receivedAchievements, achievements } = props;

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
          {achievement.count > 1 ? <div className="tracking-wide">Received {times[achievement.count]}</div> : null}
        </Link>
      ))}
      {achievements ? (
        <>
          <GiveAchievement
            achievements={achievements}
            receiverType={props.receiverType}
            receiverId={props.receiverId}
            path={props.path}
          />
          <RemoveAchievement
            achievements={receivedAchievements}
            removalType={props.receiverType}
            removalId={props.receiverId}
            path={props.path}
          />
        </>
      ) : null}
    </div>
  );
}
