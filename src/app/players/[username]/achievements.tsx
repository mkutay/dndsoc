import { AchievementCards } from "@/components/achievements"
import { TypographyH2 } from "@/components/typography/headings"
import { ReceivedAchievements } from "@/types/full-database.types"

export const Achievements = ({ receivedAchievements }: { receivedAchievements: ReceivedAchievements[] }) => {
  if (!receivedAchievements || receivedAchievements.length === 0) return null;
  
  return (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <AchievementCards receivedAchievements={receivedAchievements} />
    </>
  )
}