import { TypographyH1, TypographyH2 } from "@/components/typography/headings";
import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getPlayerByUsername } from "@/lib/players/query-username";
import { CampaignCards } from "@/components/campaigns";
import { AchievementCards } from "@/components/achievements";
import { PlayerEditButton } from "@/components/player-edit-button";

export default async function Page(props: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await props.params;

  const playerData = await getPlayerByUsername(username);

  if (!playerData.isOk()) {
    return <ErrorPage error={playerData.error.message} />;
  }

  const player = playerData.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">{username}</TypographyH1>
        <PlayerEditButton userUuid={player.user_uuid}/>
      </div>
      <TypographyLarge>Level: {player.level}</TypographyLarge>
      {player.about && player.about.length != 0 && <TypographyLead>{player.about}</TypographyLead>}
      {player.campaigns && player.campaigns.length != 0 && <>
        <TypographyH2 className="mt-6">Campaigns</TypographyH2>
        <CampaignCards campaigns={player.campaigns} />
      </>}
      {player.achievement_ids && player.achievement_ids.length != 0 && <>
        <TypographyH2 className="mt-6">Achievements</TypographyH2>
        <AchievementCards achievementIds={player.achievement_ids} />
      </>}
    </div>
  );
}