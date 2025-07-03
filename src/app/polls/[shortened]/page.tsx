import { format } from "date-fns";
import { cache } from "react";
import Link from "next/link";

import { ErrorComponent } from "@/components/error-component";
import { Options } from "@/components/option";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";

export const dynamic = "force-dynamic";

const getPoll = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("polls")
      .select(
        `
      *,
      options(*, votes(*))
    `,
      )
      .eq("shortened", shortened)
      .single(),
  );

const cachedGetPoll = cache(getPoll);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const result = await cachedGetPoll({ shortened });
  if (result.isErr()) return { title: "Poll Not Found" };

  return {
    title: `Poll: ${result.value.question}`,
    description: "View the details of this poll and vote on it.",
    openGraph: {
      title: `Poll: ${result.value.question}`,
      description: "View the details of this poll and vote on it.",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const result = await cachedGetPoll({ shortened });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/polls/[shortened]/page.tsx" />;
  const poll = result.value;

  const user = await getUserRole();
  if (user.isErr() && user.error.code !== "NOT_LOGGED_IN")
    return <ErrorComponent error={user.error} caller="/polls/[shortened]/page.tsx" />;

  const expired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1 className="flex flex-row flex-wrap">
        <div className="mr-4">{poll.question}</div>
        {expired ? <div className="font-quotes text-destructive">EXPIRED</div> : null}
      </TypographyH1>
      <div className="text-right italic font-quotes text-lg mt-2">
        <div>Created at: {format(poll.created_at, "PP")}</div>
        {poll.expires_at ? (
          expired ? (
            <div>Expired on: {format(poll.expires_at, "PP")}</div>
          ) : (
            <div>Expires at: {format(poll.expires_at, "PP")}</div>
          )
        ) : null}
      </div>
      {user.isOk() && user.value.role === "admin" && (
        <div className="flex flex-row justify-end w-full mt-4">
          <Button variant="outline" asChild className="w-fit">
            <Link href={`/polls/${poll.shortened}/edit`}>Edit Poll</Link>
          </Button>
        </div>
      )}
      <Options
        options={poll.options.map((option) => ({
          id: option.id,
          text: option.text,
          votes: option.votes.length,
        }))}
        votedId={
          user.isOk()
            ? (poll.options.find((option) =>
                option.votes.some((vote) => vote.auth_user_uuid === user.value.auth_user_uuid),
              )?.id ?? null)
            : undefined
        }
        pollId={poll.id}
        expired={poll.expires_at ? new Date(poll.expires_at) < new Date() : false}
      />
    </div>
  );
}
