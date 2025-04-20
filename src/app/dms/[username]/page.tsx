import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { getDMByUsername, getDMs } from "@/lib/dms";
import { ErrorPage } from "@/components/error-page";
import { DMEditButton } from "./dm-edit-button";
import { DMAchievements } from "@/components/dm-achievements-section";
import { Campaigns } from "./campaigns";
import { Parties } from "./parties";

export const dynamic = "force-dynamic";

export default async function Page({ params }: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const result = await getDMByUsername({ username });
  if (!result.isOk()) {
    return <ErrorPage error={result.error} caller="/dms/[username]" isNotFound />;
  }
  const dm = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">{username}</TypographyH1>
        <DMEditButton authUserUuid={dm.auth_user_uuid} />
      </div>
      <TypographyLarge>Level: {dm.level}</TypographyLarge>
      {dm.about && dm.about.length !== 0 && <TypographyLead>{dm.about}</TypographyLead>}
      <Parties DMUuid={dm.id} />
      <Campaigns DMUuid={dm.id} />
      <DMAchievements receivedAchievements={dm.received_achievements_dm} />
    </div>
  );
}

export async function generateStaticParams() {
  const dms = await getDMs();
  if (dms.isErr()) return [];
  return dms.value.map((dm) => ({
    username: dm.users.username,
  }));
}