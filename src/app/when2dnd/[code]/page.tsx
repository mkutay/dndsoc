import Link from "next/link";
import { Edit } from "lucide-react";

import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { PollVoteForm } from "@/components/when2dnd/poll-vote-form";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";
import { VotedTime } from "@/components/when2dnd/voted-time";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? <NotSignedIn code={code} /> : <ErrorPage error={user.error} />;
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
      <VotedTime
        votes={poll.value.when2dnd_votes.map((vote) => ({
          from: new Date(vote.start),
          to: new Date(vote.end),
          userUuid: vote.auth_user_uuid,
          id: vote.id,
        }))}
      />
      <PollVoteForm
        title={poll.value.title}
        dateRange={{ from: new Date(poll.value.date_from), to: new Date(poll.value.date_to) }}
        deadline={poll.value.deadline ? new Date(poll.value.deadline) : undefined}
        pollId={poll.value.id}
        createdAt={new Date(poll.value.created_at)}
        authUserUuid={user.value.auth_user_uuid}
        votes={poll.value.when2dnd_votes
          .filter((vote) => vote.auth_user_uuid === user.value.auth_user_uuid)
          .map((vote) => ({
            from: new Date(vote.start),
            to: new Date(vote.end),
            id: vote.id,
          }))}
      />
    </div>
  );
}

function NotSignedIn({ code }: { code: string }) {
  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose">
        <TypographyH1>When2DnD</TypographyH1>
        <p className="text-base font-quotes text-muted-foreground mt-0.5">
          The easiest way to schedule your Dungeons & Dragons sessions.
        </p>
        <p className="mt-6 text-lg">If you were given this link by your DM, you can sign in to vote on the poll.</p>
        <Button asChild className="mt-8">
          <Link href={`/sign-in?redirect=/when2dnd/${code}`}>Sign In to Get Started</Link>
        </Button>
      </div>
    </div>
  );
}

const getPollWithVotes = ({ code }: { code: string }) =>
  runQuery((supabase) => supabase.from("when2dnd_polls").select("*, when2dnd_votes(*)").eq("code", code).single());
