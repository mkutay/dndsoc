import { forbidden } from "next/navigation";
import Link from "next/link";

import { getWhen2DnDPollFromCode } from "@/lib/when2dnd";
import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { TypographyH1 } from "@/components/typography/headings";
import { EditPollForm } from "@/components/when2dnd/edit-poll-form";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? forbidden() : <ErrorPage error={user.error} />;
  }

  const isDM = user.value.role === "dm" || user.value.role === "admin";
  if (!isDM) {
    return forbidden();
  }

  const poll = await getWhen2DnDPollFromCode(code);
  if (poll.isErr()) return <ErrorPage error={poll.error} />;

  if (poll.value.created_by !== user.value.auth_user_uuid) return forbidden();

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
        title={poll.value.title}
        dateRange={{ from: new Date(poll.value.date_from), to: new Date(poll.value.date_to) }}
        deadline={poll.value.deadline ? new Date(poll.value.deadline) : undefined}
        pollId={poll.value.id}
      />
    </div>
  );
}
