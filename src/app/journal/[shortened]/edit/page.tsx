import { forbidden } from "next/navigation";
import Link from "next/link";

import { ErrorComponent } from "@/components/error-component";
import { TypographyH1 } from "@/components/typography/headings";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { JournalEditForm } from "./form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const result = await getJournalWithPartyEntries({ shortened });
  if (result.isErr()) return { title: "Journal Not Found" };

  return {
    title: `Edit Journal: ${result.value.title}`,
    description: "Edit the details of all of the entries in this journal.",
    openGraph: {
      title: `Edit Journal: ${result.value.title}`,
      description: "Edit the details of all of the entries in this journal.",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const user = await getUserRole();
  if (user.isErr() && user.error.code !== "NOT_LOGGED_IN") return <ErrorComponent error={user.error} caller="/journal/[shortened]/edit/page.tsx" />;
  if (user.isErr() || user.value.role !== "admin") {
    forbidden();
  }

  const result = await getJournalWithPartyEntries({ shortened });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/journal/[shortened]/edit/page.tsx" />;
  const journal = result.value;

  const allParties = journal.campaigns.party_campaigns.map(pc => pc.parties);
  const partyEntries = journal.party_entries;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Link href={`/journal/${journal.shortened}`} className="text-muted-foreground hover:text-muted-foreground/80 transition-all text-md font-quotes w-fit">
        Go Back to Entry
      </Link>
      <TypographyH1>Edit Journal Entry</TypographyH1>
      <JournalEditForm
        journal={journal}
        allParties={allParties}
        partyEntries={partyEntries}
      />
    </div>
  );
}

const getJournalWithPartyEntries = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) => supabase
    .from("journal")
    .select(`
      *,
      campaigns!inner(*, party_campaigns(*, parties!inner(*))),
      party_entries(*, parties(*))
    `)
    .eq("shortened", shortened)
    .single()
  );