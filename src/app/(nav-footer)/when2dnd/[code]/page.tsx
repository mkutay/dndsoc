import { createHash } from "crypto";

import { OptimisticWrapper } from "./_components/optimistic-wrapper";
import { EditPollSheet } from "./_components/edit-poll-sheet";
import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";
import { ForbiddenSignInButton } from "@/components/forbidden-sign-in-button";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const result = await getUserRole().andThen((user) =>
    runQuery((supabase) =>
      supabase.from("when2dnd_polls").select("*, when2dnd_votes(*)").eq("code", code).single(),
    ).map((poll) => ({ user, poll })),
  );

  if (result.isErr()) {
    return result.error.code === "NOT_LOGGED_IN" ? <NotSignedIn /> : <ErrorPage error={result.error} />;
  }

  const { user, poll } = result.value;

  const canEdit = (user.role === "dm" && poll.created_by === user.auth_user_uuid) || user.role === "admin";

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="flex flex-row justify-between items-start gap-6 flex-wrap">
        <div className="flex flex-col">
          <TypographyH1>Welcome to When2DnD</TypographyH1>
          <p className="text-xl font-quotes text-muted-foreground mt-2">
            The easiest way to schedule your Dungeons & Dragons sessions.
          </p>
        </div>
        {canEdit ? (
          <EditPollSheet
            title={poll.title}
            dateRange={{ from: new Date(poll.date_from), to: new Date(poll.date_to) }}
            deadline={poll.deadline ? new Date(poll.deadline) : undefined}
            pollId={poll.id}
          />
        ) : null}
      </div>
      <OptimisticWrapper
        code={code}
        allVotes={poll.when2dnd_votes.map((vote) => ({
          from: new Date(vote.start),
          to: new Date(vote.end),
          userHash: vote.auth_user_uuid ? createHash("sha256").update(vote.auth_user_uuid).digest("hex") : null,
        }))}
        title={poll.title}
        dateRange={{ from: new Date(poll.date_from), to: new Date(poll.date_to) }}
        deadline={poll.deadline ? new Date(poll.deadline) : undefined}
        pollId={poll.id}
        createdAt={new Date(poll.created_at)}
        authUserUuid={user.auth_user_uuid}
        userVotes={poll.when2dnd_votes
          .filter((vote) => vote.auth_user_uuid === user.auth_user_uuid)
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
