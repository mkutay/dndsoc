import { createHash } from "crypto";
import Link from "next/link";
import { Edit } from "lucide-react";

import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";
import { OptimisticWrapper } from "@/components/when2dnd/optimistic-wrapper";
import { ForbiddenSignInButton } from "@/components/forbidden-sign-in-button";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? <NotSignedIn /> : <ErrorPage error={user.error} />;
  }

  const poll = await getPollWithVotes({ code });
  if (poll.isErr()) return <ErrorPage error={poll.error} />;

  const canEdit =
    (user.value.role === "dm" && poll.value.created_by === user.value.auth_user_uuid) || user.value.role === "admin";

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose lg:mx-0 mx-auto">
        <TypographyH1>Welcome to When2DnD</TypographyH1>
        <p className="text-xl font-quotes text-muted-foreground mt-2">
          The easiest way to schedule your Dungeons & Dragons sessions.
        </p>
        {canEdit ? (
          <div className="mt-6 w-full flex justify-start">
            <Button className="w-fit" asChild>
              <Link href={`/when2dnd/${code}/edit`} className="flex items-center gap-2">
                <Edit className="w-5 h-5 mb-0.5" />
                Edit the Poll
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
      <OptimisticWrapper
        code={code}
        allVotes={poll.value.when2dnd_votes.map((vote) => ({
          from: new Date(vote.start),
          to: new Date(vote.end),
          userHash: vote.auth_user_uuid ? createHash("sha256").update(vote.auth_user_uuid).digest("hex") : null,
        }))}
        title={poll.value.title}
        dateRange={{ from: new Date(poll.value.date_from), to: new Date(poll.value.date_to) }}
        deadline={poll.value.deadline ? new Date(poll.value.deadline) : undefined}
        pollId={poll.value.id}
        createdAt={new Date(poll.value.created_at)}
        authUserUuid={user.value.auth_user_uuid}
        userVotes={poll.value.when2dnd_votes
          .filter((vote) => vote.auth_user_uuid === user.value.auth_user_uuid)
          .map((vote) => ({
            from: new Date(vote.start),
            to: new Date(vote.end),
          }))}
      />
    </div>
  );
}

function NotSignedIn() {
  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose">
        <TypographyH1>When2DnD</TypographyH1>
        <p className="text-base font-quotes text-muted-foreground mt-0.5">
          The easiest way to schedule your Dungeons & Dragons sessions.
        </p>
        <p className="mt-6 text-lg">If you were given this link by your DM, you can sign in to vote on the poll.</p>
        <ForbiddenSignInButton className="mt-8">Sign In to Get Started!</ForbiddenSignInButton>
      </div>
    </div>
  );
}

const getPollWithVotes = ({ code }: { code: string }) =>
  runQuery((supabase) => supabase.from("when2dnd_polls").select("*, when2dnd_votes(*)").eq("code", code).single());
