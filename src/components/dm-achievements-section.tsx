import { DMAchievementCards } from "@/components/dm-achievements"
import { TypographyH2 } from "@/components/typography/headings"
import { ReceivedAchievementsDM } from "@/types/full-database.types"

export const DMAchievements = ({ receivedAchievements }: { receivedAchievements: ReceivedAchievementsDM[] }) => {
  if (!receivedAchievements || receivedAchievements.length === 0) return null;
  
  return (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <DMAchievementCards receivedAchievements={receivedAchievements} />
    </>
  )
}