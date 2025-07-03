import { forbidden } from "next/navigation";
import { cache } from "react";
import Link from "next/link";

import { EditPoll } from "./form";
import { ErrorComponent } from "@/components/error-component";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";
import { TypographyH1 } from "@/components/typography/headings";

export const dynamic = "force-dynamic";

const getPoll = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("polls")
      .select(
        `
      *,
      options(*)
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
    title: `Edit Poll: ${result.value.question}`,
    description: "Edit the details of this poll.",
    openGraph: {
      title: `Edit Poll: ${result.value.question}`,
      description: "Edit the details of this poll.",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const user = await getUserRole();
  if (user.isErr() && user.error.code !== "NOT_LOGGED_IN")
    return <ErrorComponent error={user.error} caller="/polls/[shortened]/page.tsx" />;

  if (user.isErr() || user.value.role !== "admin") {
    forbidden();
  }

  const result = await cachedGetPoll({ shortened });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/polls/[shortened]/edit/page.tsx" />;
  const poll = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Link
        href={`/polls/${shortened}`}
        className="text-muted-foreground hover:text-muted-foreground/80 transition-all text-md font-quotes w-fit"
      >
        Go Back
      </Link>
      <TypographyH1>Edit Poll</TypographyH1>
      <EditPoll poll={poll} />
    </div>
  );
}
