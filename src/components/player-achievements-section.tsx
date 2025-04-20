import { PlayerAchievementCards } from "@/components/player-achievements"
import { TypographyH2 } from "@/components/typography/headings"
import { ReceivedAchievementsPlayer } from "@/types/full-database.types"

export const PlayerAchievements = ({ receivedAchievements }: { receivedAchievements: ReceivedAchievementsPlayer[] }) => {
  if (!receivedAchievements || receivedAchievements.length === 0) return null;
  
  return (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <PlayerAchievementCards receivedAchievements={receivedAchievements} />
    </>
  )
}