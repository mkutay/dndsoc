import { errAsync } from "neverthrow";
import { format } from "date-fns";
import { type Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { CreateJournal } from "./form";
import { ErrorComponent } from "@/components/error-component";
import { TypographyHr } from "@/components/typography/blockquote";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { runServiceQuery } from "@/utils/supabase-run";
import { getCampaigns } from "@/lib/campaigns";
import { getUserRole } from "@/lib/roles";

export const experimental_ppr = true;
export const dynamic = "auto";

export const metadata: Metadata = {
  title: "Journal",
  description: "List of our journals in the KCL Dungeons and Dragons app.",
  openGraph: {
    title: "Journal",
    description: "List of our polls in the KCL Dungeons and Dragons app.",
  },
};

export default async function Page() {
  const journals = await getAllJournals();
  if (journals.isErr()) return <ErrorComponent error={journals.error} caller="/journal/page.tsx" />;

  const infos: React.ReactNode[] = [];

  // Sort journals by date in descending order
  journals.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (let i = 0; i < journals.value.length; i++) {
    const journal = journals.value[i];
    infos.push(
      <div key={journal.id}>
        <Link
          href={`/journal/${journal.shortened}`}
          className="text-foreground hover:text-foreground/80 transition-all w-fit"
        >
          <h2 className="md:text-4xl text-3xl font-medium tracking-normal font-headings flex flex-row items-start w-fit">
            <div className="md:text-5xl text-4xl font-drop-caps font-normal">{journal.title[0]}</div>
            <div>{journal.title.slice(1)}</div>
          </h2>
        </Link>
        <TypographyParagraph className="max-w-prose text-lg">{journal.excerpt}</TypographyParagraph>
        <div className="flex flex-row items-center text-sm italic font-quotes mt-2">
          —
          <Link
            href={`/campaigns/${journal.campaigns.shortened}`}
            className="text-foreground hover:text-foreground/80 transition-all underline"
          >
            {journal.campaigns.name}
          </Link>
          , {format(journal.date, "PP")}
        </div>
        <Button variant="secondary" className="mt-6" asChild>
          <Link href={`/journal/${journal.shortened}`}>Read more</Link>
        </Button>
      </div>,
    );

    if (i !== journals.value.length - 1) {
      infos.push(<TypographyHr key={`hr-${journal.id}`} />);
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex flex-row items-center justify-between flex-wrap gap-2">
        <TypographyH1>Journal</TypographyH1>
        <Suspense>
          <CreateJournalSuspense />
        </Suspense>
      </div>
      <div className="flex flex-col gap-6 mt-8">{infos}</div>
    </div>
  );
}

const CreateJournalSuspense = async () => {
  const campaigns = await getUserRole().andThen((user) =>
    user.role === "admin"
      ? getCampaigns()
      : errAsync({
          code: "NOT_ADMIN" as const,
          message: "You must be an admin to create a journal.",
        }),
  );

  if (campaigns.isErr() && campaigns.error.code !== "NOT_LOGGED_IN" && campaigns.error.code !== "NOT_ADMIN")
    return <ErrorComponent error={campaigns.error} caller="/journal/page.tsx" />;

  return campaigns.isOk() ? <CreateJournal campaigns={campaigns.value} /> : null;
};

const getAllJournals = () => runServiceQuery((supabase) => supabase.from("journal").select("*, campaigns!inner(*)"));
