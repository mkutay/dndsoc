import { errAsync, okAsync } from "neverthrow";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TypographyLead, TypographyParagraph } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getWithImage } from "@/lib/storage";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";
import { Button } from "@/components/ui/button";
import { AdminEditSheet } from "@/components/admin-edit-sheet";

export const dynamic = "force-dynamic";

const getAdmin = cache(({ username }: { username: string }) =>
  runQuery((supabase) =>
    supabase.from("admins").select(`*, users!inner(*), images(*)`).eq("users.username", username).single(),
  ).andThen(getWithImage),
);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await getAdmin({ username });
  if (result.isErr()) return { title: "Admin Not Found", description: "This admin does not exist." };
  const { data: dm, url } = result.value;

  const name = dm.users.name;
  const description = dm.about;
  const title = `Our Awesome Admin: ${name}`;

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
  const result = await getAdmin({ username });

  if (result.isErr()) return <ErrorPage error={result.error} caller="/admins/[username]" />;
  const { data: admin, url } = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-1.5 justify-between items-start">
        <div className="flex lg:flex-row flex-col gap-6">
          {url ? (
            <Image
              src={url}
              alt={`Image of ${admin.users.name}`}
              width={144}
              height={144}
              className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto object-cover border-border border-2"
            />
          ) : (
            <div className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto bg-border rounded-full"></div>
          )}
          <div className="flex flex-col mt-3 max-w-prose gap-1.5">
            <h1 className="text-primary flex flex-row font-extrabold text-5xl font-headings tracking-wide items-start">
              <div className="font-drop-caps text-7xl font-medium">{admin.users.name.charAt(0)}</div>
              {admin.users.name.slice(1)}
            </h1>
            {admin.about.length !== 0 ? <TypographyLead className="indent-6">{admin.about}</TypographyLead> : null}
          </div>
        </div>
        <Suspense>
          <EditSuspense result={result} />
        </Suspense>
      </div>
      <Button asChild variant="secondary" className="mt-8 w-fit ml-auto">
        <Link href={`/dms/${username}`}>See the DM page</Link>
      </Button>
      <TypographyParagraph>There isn&apos;t much else to see around here, to be honest.</TypographyParagraph>
    </div>
  );
}

async function EditSuspense({ result }: { result: Awaited<ReturnType<typeof getAdmin>> }) {
  const admin = await result
    .asyncAndThen((result) =>
      getUserRole()
        .orElse((error) => (error.code === "NOT_LOGGED_IN" ? okAsync(null) : errAsync(error)))
        .map((user) => ({ ...result, user })),
    )
    .map((result) => ({
      ...result,
      ownsAdmin: result.data.auth_user_uuid === result.user?.auth_user_uuid,
    }));

  if (admin.isErr() || !admin.value.ownsAdmin) return null;
  const {
    about,
    id,
    users: { username },
  } = admin.value.data;

  return (
    <AdminEditSheet admin={{ about, id }} path={`/admins/${username}`}>
      <Button variant="outline" type="button" className="w-fit mt-1.5">
        <Edit className="w-5 h-5 mr-2" /> Edit
      </Button>
    </AdminEditSheet>
  );
}
