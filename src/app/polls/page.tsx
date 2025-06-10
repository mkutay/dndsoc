import Link from "next/link";

import { ErrorComponent } from "@/components/error-component";
import { TypographyHr } from "@/components/typography/blockquote";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { CreatePoll } from "./form";

export default async function Page() {
  const polls = await getAllPolls();
  if (polls.isErr()) return <ErrorComponent error={polls.error} caller="/polls/page.tsx" />;

  const user = await getUserRole();
  if (user.isErr() && user.error.code !== "NOT_LOGGED_IN") return <ErrorComponent error={user.error} caller="/polls/page.tsx" />;

  const pollsList: React.ReactNode[] = [];
  for (let i = 0; i < polls.value.length; i++) {
    const poll = polls.value[i];
    const expired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;
    pollsList.push(
      <div key={poll.id}>
        <Link href={`/polls/${poll.shortened}`} className="text-foreground hover:text-foreground/80 transition-all w-fit">
          <h2 className="md:text-4xl text-3xl font-medium tracking-normal font-headings flex flex-row items-start w-fit flex-wrap">
            <div className="md:text-5xl text-4xl font-drop-caps font-normal">{poll.question[0]}</div>
            <div className="mr-2">{poll.question.slice(1)}</div>
            {expired && <div className="font-quotes text-destructive hover:text-destructive/80 transition-all">EXPIRED</div>}
          </h2>
        </Link>
        <ul className="pl-5 space-y-1 mt-2">
          {poll.options.map((option) => (
            <li key={option.id} className="flex flex-row items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-primary mt-[3px]"></div>
              <div className="uppercase font-quotes">{option.text} — Votes: {option.votes[0].count}</div>
            </li>
          ))}
        </ul>
        <Button asChild variant="secondary" className="mt-4">
          <Link href={`/polls/${poll.shortened}`}>
            See More
          </Link>
        </Button>
      </div>
    );

    if (i !== polls.value.length - 1) {
      pollsList.push(<TypographyHr key={`hr-${poll.id}`} />);
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Polls</TypographyH1>
      {user.isOk() && user.value.role === "admin" && <CreatePoll />}
      <div className="mt-6">
        {pollsList}
      </div>
    </div>
  );
}

const getAllPolls = () => runQuery((supabase) => supabase
  .from("polls")
  .select("*, options(*, votes(count))")
  .order("created_at", { ascending: false })
)