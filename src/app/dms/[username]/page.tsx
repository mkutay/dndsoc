import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { DMEditButton } from "./dm-edit-button";
import { DMAchievements } from "@/components/dm-achievements-section";
import { Campaigns } from "./campaigns";
import { Parties } from "./parties";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await DB.DMs.Get.Username({ username });
  if (result.isErr()) return { title: "DM Not Found", description: "This DM does not exist." };
  const dm = result.value;

  const level = dm.level;
  const ach = dm.received_achievements_dm.length;
  const description = `Some statistics about our DM ${username}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Our Awesome DM ${username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: 
  { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const result = await DB.DMs.Get.Username({ username });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/dms/[username]" isNotFound />;
  const dm = result.value;

  const roled = await DB.Roles.Get.With.User();
  if (roled.isErr() && roled.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={roled.error} caller="/dms/[username]" />;

  const auth = roled.isOk() ? roled.value : null;
  const role = auth ? auth.role : null;
  const ownsDM = (dm.auth_user_uuid === auth?.auth_user_uuid) || role === "admin";

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">
          <span className="font-drop-caps mr-0.5">{username.charAt(0)}</span>{username.slice(1)}
        </TypographyH1>
        {ownsDM && <DMEditButton username={username} />}
      </div>
      <TypographyLarge>Level: {dm.level}</TypographyLarge>
      {dm.about && dm.about.length !== 0 && <TypographyLead>{dm.about}</TypographyLead>}
      <Parties DMUuid={dm.id} ownsDM={ownsDM} parties={dm.dm_party.map((dmParty) => ({ ...dmParty.parties }))} />
      <Campaigns DMUuid={dm.id} />
      <DMAchievements receivedAchievements={dm.received_achievements_dm} />
    </div>
  );
}

export async function generateStaticParams() {
  const dms = await DB.DMs.Get.All();
  if (dms.isErr()) return [];
  return dms.value.map((dm) => ({
    username: dm.users.username,
  }));
}