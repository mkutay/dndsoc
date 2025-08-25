import { forbidden } from "next/navigation";
import Link from "next/link";

import { EditPollForm } from "./_components/edit-poll-form";
import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { TypographyH1 } from "@/components/typography/headings";
import { runQuery } from "@/utils/supabase-run";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await getUserRole().andThen((user) =>
    runQuery((supabase) => supabase.from("when2dnd_polls").select("*").eq("code", code).single()).map((poll) => ({
      user,
      poll,
    })),
  );

  if (result.isErr()) {
    return result.error.code === "NOT_LOGGED_IN" ? forbidden() : <ErrorPage error={result.error} />;
  }

  const { user, poll } = result.value;

  const isDM = (user.role === "dm" && poll.created_by === user.auth_user_uuid) || user.role === "admin";

  if (!isDM) {
    return forbidden();
  }

  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <Link
        href={`/when2dnd/${code}`}
        className="text-muted-foreground hover:text-muted-foreground/80 transition-all font-quotes text-base underline"
      >
        Go Back
      </Link>
      <TypographyH1>Edit When2DnD Poll</TypographyH1>
      <p className="text-xl font-quotes text-muted-foreground mt-2">
        The easiest way to schedule your Dungeons & Dragons sessions.
      </p>
      <EditPollForm
        title={poll.title}
        dateRange={{ from: new Date(poll.date_from), to: new Date(poll.date_to) }}
        deadline={poll.deadline ? new Date(poll.deadline) : undefined}
        pollId={poll.id}
      />
    </div>
  );
}
