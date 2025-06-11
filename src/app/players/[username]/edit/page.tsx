import { forbidden } from "next/navigation";
import { cache } from "react";

import { TypographyLink } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { UploadWrapper } from "./upload-wrapper";
import { PlayerEditForm } from "./form";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

const cachedGetPlayer = cache(DB.Players.Get.Username);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await cachedGetPlayer({ username });
  if (result.isErr()) return { title: "Player Not Found", description: "This player does not exist." };
  const player = result.value;

  const level = player.level;
  const ach = player.received_achievements_player.length;
  const description = `Some statistics about our player ${username}: Level ${level} · Received ${ach} Achievement${ach === 1 ? "" : "s"}`;
  const title = `Edit Player ${username}`;

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
  const result = await cachedGetPlayer({ username });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/players/[username]/edit/page.tsx" />;
  const player = result.value;

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/players/[username]/edit/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsPlayer = (auth && player.auth_user_uuid === auth.auth_user_uuid) || false || role === "admin";

  if (!ownsPlayer) forbidden();

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLink href={`/players/${player.users.username}`} className="tracking-wide font-quotes">
        Go Back
      </TypographyLink>
      <TypographyH1 className="mt-0.5">Edit Your Public Player Page</TypographyH1>
      <UploadWrapper playerId={player.id} playerShortened={player.users.username} />
      <PlayerEditForm player={player} />
    </div>
  );
}