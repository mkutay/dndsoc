import { errAsync, okAsync } from "neverthrow";
import Image from "next/image";
import { cache } from "react";

import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { Parties } from "@/components/parties";
import { getPublicUrlByUuid } from "@/lib/storage";
import { EditButton } from "@/components/edit-button";
import { ReceivedAchievementsDM } from "@/types/full-database.types";
import { TypographyH2 } from "@/components/typography/headings";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaign-cards";
import { getDMByUsername } from "@/lib/dms";
import { getUserRole } from "@/lib/roles";
import { getParties } from "@/lib/parties";
import { runQuery } from "@/utils/supabase-run";
import { AchievementCards } from "@/components/achievement-cards";

export const dynamic = "force-dynamic";

const cachedGetDM = cache(getDMByUsername);
const cachedGetPublicUrlByUuid = cache(getPublicUrlByUuid);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await cachedGetDM({ username });
  if (result.isErr()) return { title: "DM Not Found", description: "This DM does not exist." };
  const dm = result.value;

  const level = dm.level;
  const ach = dm.received_achievements_dm.length;
  const name = dm.users.name;
  const description = `Some statistics about our DM ${name}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Our Awesome DM ${name}`;

  const imageUrlResult = dm.image_uuid ? await cachedGetPublicUrlByUuid({ imageUuid: dm.image_uuid }) : null;
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

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await cachedGetDM({ username });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/dms/[username]" isNotFound />;
  const dm = result.value;

  const roled = await getUserRole();
  if (roled.isErr() && roled.error.code !== "NOT_LOGGED_IN")
    return <ErrorPage error={roled.error} caller="/dms/[username]" />;

  const auth = roled.isOk() ? roled.value : null;
  const role = auth ? auth.role : null;
  const ownsDM = dm.auth_user_uuid === auth?.auth_user_uuid || role === "admin";
  const name = dm.users.name;

  const parties = ownsDM ? await getParties() : undefined;
  if (parties && parties.isErr()) return <ErrorPage error={parties.error} caller="/dms/[username]/page.tsx" />;

  const imageUrlResult = dm.image_uuid ? await cachedGetPublicUrlByUuid({ imageUuid: dm.image_uuid }) : null;
  const imageUrl = imageUrlResult?.isOk() ? imageUrlResult.value : null;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Image of ${dm.users.name}`}
            width={144}
            height={144}
            className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto object-cover border-border border-2"
          />
        ) : (
          <div className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto bg-border rounded-full"></div>
        )}
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          <h1 className="text-primary flex flex-row font-extrabold text-5xl font-headings tracking-wide items-start">
            <div className="font-drop-caps text-7xl font-medium">{name.charAt(0)}</div>
            {name.slice(1)}
          </h1>
          <TypographyLarge>Level: {dm.level}</TypographyLarge>
          {dm.about && dm.about.length !== 0 ? <TypographyLead>{dm.about}</TypographyLead> : null}
          {ownsDM ? <EditButton href={`/dms/${username}/edit`} /> : null}
        </div>
      </div>
      <DMAchievements receivedAchievements={dm.received_achievements_dm} />
      <div className="mt-6 flex flex-col">
        <TypographyH2>Parties</TypographyH2>
        <Parties
          DMUuid={dm.id}
          ownsDM={ownsDM}
          parties={dm.dm_party.map((dmParty) => ({ ...dmParty.parties }))}
          allParties={parties?.value}
        />
      </div>
      <Campaigns DMUuid={dm.id} />
    </div>
  );
}

async function Campaigns({ DMUuid }: { DMUuid: string }) {
  const notFound = <TypographyH2 className="mt-8">No campaigns found</TypographyH2>;
  const result = await getCampaignsByDMUuid({ DMUuid });
  if (result.isErr()) {
    return result.error.code === "NOT_FOUND" ? (
      notFound
    ) : (
      <ErrorComponent error={result.error} caller="/players/[username]/campaigns.tsx" />
    );
  }
  const campaigns = result.value;

  if (campaigns.length === 0) return notFound;

  return (
    <>
      <TypographyH2 className="mt-8">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns} />
    </>
  );
}

function DMAchievements({ receivedAchievements }: { receivedAchievements: ReceivedAchievementsDM[] }) {
  if (!receivedAchievements || receivedAchievements.length === 0) return null;

  return (
    <>
      <TypographyH2 className="mt-6">Achievements</TypographyH2>
      <AchievementCards receivedAchievements={receivedAchievements} />
    </>
  );
}

export const getCampaignsByDMUuid = ({ DMUuid }: { DMUuid: string }) =>
  runQuery(
    (supabase) =>
      supabase
        .from("parties")
        .select(`*, party_campaigns!inner(*, campaigns(*)), dm_party(*, dms!inner(*))`)
        .eq("dm_party.dms.id", DMUuid),
    "getCampaignsByDMUuid",
  )
    .andThen((data) =>
      data.length === 0
        ? errAsync({
            message: `No campaigns found for DM with UUID ${DMUuid}`,
            code: "NOT_FOUND" as const,
          })
        : okAsync(data),
    )
    .map((parties) =>
      parties.flatMap((party) =>
        party.party_campaigns.map((partyCampaign) => ({
          ...partyCampaign.campaigns,
        })),
      ),
    )
    .map((campaigns) => {
      // Remove duplicates based on campaign id
      const uniqueCampaigns = new Map<string, (typeof campaigns)[0]>();
      campaigns.forEach((campaign) => {
        if (!uniqueCampaigns.has(campaign.id)) {
          uniqueCampaigns.set(campaign.id, campaign);
        }
      });
      return Array.from(uniqueCampaigns.values());
    });
