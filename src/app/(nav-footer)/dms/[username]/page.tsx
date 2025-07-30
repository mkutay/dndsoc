import { errAsync, okAsync } from "neverthrow";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Edit } from "lucide-react";
import Image from "next/image";

import { TypographyLarge, TypographyLead } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { Parties } from "@/components/parties";
import { getWithImage } from "@/lib/storage";
import { type ReceivedAchievementsDM } from "@/types/full-database.types";
import { TypographyH2 } from "@/components/typography/headings";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaign-cards";
import { getUserRole } from "@/lib/roles";
import { getParties } from "@/lib/parties";
import { runQuery } from "@/utils/supabase-run";
import { AchievementCards } from "@/components/achievement-cards";
import { DMEditSheet } from "@/components/dm-edit-sheet";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const getDMByUsername = ({ username }: { username: string }) =>
  runQuery((supabase) =>
    supabase
      .from("dms")
      .select(`*, users!inner(*), received_achievements_dm(*, achievements(*)), dm_party(*, parties(*)), images(*)`)
      .eq("users.username", username)
      .single(),
  );

const getDM = cache(getDMByUsername);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await getDM({ username }).andThen(getWithImage);
  if (result.isErr()) return { title: "DM Not Found", description: "This DM does not exist." };
  const { data: dm, url } = result.value;

  const level = dm.level;
  const ach = dm.received_achievements_dm.length;
  const name = dm.users.name;
  const description = `Some statistics about our DM ${name}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Our Awesome DM ${name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [url ?? "/logo-light.png"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getDM({ username })
    .andThen(getWithImage)
    .andThen((result) =>
      getUserRole()
        .orElse((error) => (error.code === "NOT_LOGGED_IN" ? okAsync(null) : errAsync(error)))
        .map((user) => ({ ...result, user })),
    )
    .map((result) => ({
      ...result,
      ownsDM: result.data.auth_user_uuid === result.user?.auth_user_uuid || result.user?.role === "admin",
    }))
    .andThen((result) =>
      result.ownsDM
        ? getParties().map((parties) => ({ ...result, parties }))
        : okAsync({ ...result, parties: undefined }),
    );

  if (result.isErr()) return <ErrorPage error={result.error} caller="/dms/[username]" />;
  const { data: dm, url, user, ownsDM, parties } = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {url ? (
          <Image
            src={url}
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
            <div className="font-drop-caps text-7xl font-medium">{dm.users.name.charAt(0)}</div>
            {dm.users.name.slice(1)}
          </h1>
          <TypographyLarge>Level: {dm.level}</TypographyLarge>
          {dm.about && dm.about.length !== 0 ? <TypographyLead className="indent-6">{dm.about}</TypographyLead> : null}
          {ownsDM ? (
            <DMEditSheet dm={{ about: dm.about, id: dm.id }} path={`/dms/${username}`}>
              <Button variant="outline" type="button" className="w-fit mt-1.5">
                <Edit className="w-5 h-5 mr-2" /> Edit
              </Button>
            </DMEditSheet>
          ) : null}
        </div>
      </div>
      <DMAchievements receivedAchievements={dm.received_achievements_dm} />
      <div className="mt-6 flex flex-col">
        <TypographyH2>Parties</TypographyH2>
        {user?.role === "player" || (user?.role === "dm" && !ownsDM) ? (
          <Parties
            role={user?.role === "player" ? "player" : "otherDM"}
            parties={dm.dm_party.map((dmParty) => ({ ...dmParty.parties }))}
          />
        ) : user?.role === "dm" ? (
          <Parties role="dm" DMUuid={dm.id} parties={dm.dm_party.map((dmParty) => ({ ...dmParty.parties }))} />
        ) : user?.role === "admin" && parties ? (
          <Parties
            role="admin"
            DMUuid={dm.id}
            parties={dm.dm_party.map((dmParty) => ({ ...dmParty.parties }))}
            allParties={parties}
            revalidate={`/dms/${username}`}
            mine={username === user?.users.username}
          />
        ) : null}
      </div>
      <Suspense>
        <Campaigns DMUuid={dm.id} />
      </Suspense>
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

const getCampaignsByDMUuid = ({ DMUuid }: { DMUuid: string }) =>
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
