import { redirect } from "next/navigation";
import Image from "next/image";

import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { DMAchievements } from "@/components/dm-achievements-section";
import { Campaigns } from "@/components/dms/campaigns";
import { Parties } from "@/components/dms/parties";
import { getPublicUrlByUuid } from "@/lib/storage";
import { EditButton } from "@/components/edit-button";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await DB.DMs.Get.Username({ username });
  if (result.isErr()) return { title: "DM Not Found", description: "This DM does not exist." };
  const dm = result.value;

  const level = dm.level;
  const ach = dm.received_achievements_dm.length;
  const name = dm.users.name;
  const description = `Some statistics about our DM ${name}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Our Awesome DM ${name}`;

  const imageUrlResult = dm.image_uuid ? await getPublicUrlByUuid({ imageUuid: dm.image_uuid }) : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl || "/logo-light.png"],
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
  const name = dm.users.name;

  const parties = ownsDM ? await getAllParties() : undefined;

  const imageUrlResult = dm.image_uuid ? await getPublicUrlByUuid({ imageUuid: dm.image_uuid }) : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {imageUrl ? <Image
          src={imageUrl}
          alt={`Image of ${dm.users.name}`}
          width={144}
          height={144}
          className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto object-cover border-border border-2"
        /> : <div className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto bg-border rounded-full"></div>}
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          <h1 className="text-primary flex flex-row font-extrabold text-5xl font-headings tracking-wide items-start">
            <div className="font-drop-caps text-7xl font-medium">{name.charAt(0)}</div>
            {name.slice(1)}
          </h1>
          <TypographyLarge>Level: {dm.level}</TypographyLarge>
          {dm.about && dm.about.length !== 0 && <TypographyLead>{dm.about}</TypographyLead>}
          {ownsDM && <EditButton href={`/dms/${username}/edit`} />}
        </div>
      </div>
      <Parties
        DMUuid={dm.id}
        ownsDM={ownsDM}
        parties={dm.dm_party.map((dmParty) => ({ ...dmParty.parties }))}
        allParties={parties}
      />
      <Campaigns DMUuid={dm.id} />
      <DMAchievements receivedAchievements={dm.received_achievements_dm} />
    </div>
  );
}

async function getAllParties() {
  const result = await DB.Parties.Get.All();
  if (result.isErr()) redirect("/error?error=" + result.error.message);
  return result.value;
}