import Link from "next/link";

import { GiveAchievement } from "./give-achievement";
import { RemoveAchievement } from "./remove-achievement";
import { RequestAchievement } from "./request-achievement";
import { RequestDenied } from "./request-denied";
import type {
  ReceivedAchievementsCharacter,
  ReceivedAchievementsDM,
  ReceivedAchievementsPlayer,
} from "@/types/full-database.types";
import type { Tables } from "@/types/database.types";

type Achievements = (Tables<"achievements"> & {
  requested: (
    | Tables<"achievement_requests_character">
    | Tables<"achievement_requests_dm">
    | Tables<"achievement_requests_player">
  )[];
})[];

type Props = {
  receivedAchievements: ReceivedAchievementsPlayer[] | ReceivedAchievementsDM[] | ReceivedAchievementsCharacter[];
} & (
  | {
      achievements: Achievements; // contains ALL achievements
      receiverType: "player" | "character" | "dm";
      receiverId: string;
      path: string;
      owns: "super"; // for dms and admins
    }
  | {
      achievements: Achievements; // contains non-hidden achievements
      receiverId: string;
      receiverType: "player" | "character" | "dm";
      path: string;
      owns: "character";
    }
  | {
      owns: "outsider";
    }
);

export async function AchievementCards(props: Props) {
  const { receivedAchievements, owns } = props;

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
      {owns === "super" ? (
        <>
          {props.achievements
            .filter((a) => a.requested.length === 1)
            .map((achievement) =>
              achievement.requested[0].status === "pending" ? (
                <Link
                  key={achievement.id}
                  className="w-fit flex flex-row items-center gap-4 px-6 py-4 text-secondary-foreground bg-secondary rounded-2xl shadow-md hover:bg-secondary/80 transition-all"
                  href={`/achievements/${achievement.shortened}`}
                >
                  <div className="font-quotes text-lg">{achievement.name}</div>
                  <div className="w-3.5 h-3.5 bg-linear-to-br from-white/30 to-gray-400 rounded-full shadow-inner border border-white/20"></div>
                  <div className="font-quotes text-sm pt-[3px]">(Requested)</div>
                </Link>
              ) : achievement.requested[0].status === "denied" ? (
                <RequestDenied key={achievement.id} achievement={achievement} />
              ) : null,
            )}
          <GiveAchievement
            achievements={props.achievements}
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
      ) : owns === "character" ? (
        <>
          {props.achievements
            .filter((a) => a.requested.length === 1)
            .map((achievement) =>
              achievement.requested[0].status === "pending" ? (
                <Link
                  key={achievement.id}
                  className="w-fit flex flex-row items-center gap-4 px-6 py-4 text-secondary-foreground bg-secondary rounded-2xl shadow-md hover:bg-secondary/80 transition-all"
                  href={`/achievements/${achievement.shortened}`}
                >
                  <div className="font-quotes text-lg">{achievement.name}</div>
                  <div className="w-3.5 h-3.5 bg-linear-to-br from-white/30 to-gray-400 rounded-full shadow-inner border border-white/20"></div>
                  <div className="font-quotes text-sm pt-[3px]">(Requested)</div>
                </Link>
              ) : achievement.requested[0].status === "denied" ? (
                <RequestDenied key={achievement.id} achievement={achievement} />
              ) : null,
            )}
          <RequestAchievement
            achievements={props.achievements}
            receiverType={props.receiverType}
            receiverId={props.receiverId}
            path={props.path}
          />
        </>
      ) : null}
    </div>
  );
}
