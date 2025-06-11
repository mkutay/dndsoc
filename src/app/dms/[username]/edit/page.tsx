import { forbidden } from "next/navigation";
import { cache } from "react";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { UploadWrapper } from "./upload-wrapper";
import { getDMByUsername } from "@/lib/dms";
import { getUserRole } from "@/lib/roles";
import { DMEditForm } from "./form";

export const dynamic = "force-dynamic";

const cachedGetDM = cache(getDMByUsername);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await cachedGetDM({ username });
  if (result.isErr()) return { title: "DM Not Found", description: "This DM does not exist." };
  const dm = result.value;

  const level = dm.level;
  const ach = dm.received_achievements_dm.length;
  const description = `Some statistics about our awesome DM ${username}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Edit DM ${username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/dms/[username]/edit/page.tsx" isForbidden />;

  const dm = await cachedGetDM({ username });
  if (dm.isErr()) return <ErrorPage error={dm.error} caller="/dms/[username]/edit/page.tsx" isNotFound />;

  if (role.value.role !== "admin" && role.value.auth_user_uuid !== dm.value.auth_user_uuid) {
    forbidden();
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLink href={`/dms/${dm.value.users.username}`} className="tracking-wide font-quotes">
        Go back
      </TypographyLink>
      <TypographyH1 className="mt-0.5">Edit Your Public DM Page</TypographyH1>
      <UploadWrapper DMId={dm.value.id} DMShortened={dm.value.users.username} />
      <DMEditForm dm={dm.value} />
    </div>
  );
}