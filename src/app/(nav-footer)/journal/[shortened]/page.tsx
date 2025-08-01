import { MapPinIcon } from "lucide-react";
import type { Metadata } from "next";
import { okAsync } from "neverthrow";
import { format } from "date-fns";
import { cache } from "react";
import Link from "next/link";

import { ErrorComponent } from "@/components/error-component";
import { TypographyHr } from "@/components/typography/blockquote";
import { TypographyH1 } from "@/components/typography/headings";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { EditJournalPartySheet } from "@/components/journal/edit-journal-party-sheet";
import { EditJournalAdminSheet } from "@/components/journal/edit-journal-admin-sheet";

export const dynamic = "force-dynamic";

const getJournalWithPartyEntries = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("journal")
      .select(
        `
        *,
        campaigns:campaigns!inner(*, party_campaigns(*, parties!inner(*))),
        party_entries:party_entries(*, parties:parties(*))
        `,
      )
      .eq("shortened", shortened)
      .single(),
  );

const cachedGetJournalWithPartyEntries = cache(getJournalWithPartyEntries);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;

  const result = await cachedGetJournalWithPartyEntries({ shortened });
  if (result.isErr()) return { title: "Journal Not Found" };

  return {
    title: `Journal: ${result.value.title}`,
    description: "View the details of this journal.",
    openGraph: {
      title: `Journal: ${result.value.title}`,
      description: "View the details of this journal.",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const result = await cachedGetJournalWithPartyEntries({ shortened });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/journal/[shortened]/page.tsx" />;
  const journal = result.value;

  const partyIds = journal.party_entries.map((entry) => entry.parties.id);

  const user = await getUserRole();
  const parties = await user.asyncAndThen((user) =>
    user.role === "player"
      ? getPlayerParties({
          authUuid: user.auth_user_uuid,
          partyIds,
        })
      : user.role === "dm"
        ? getDMParties({
            authUuid: user.auth_user_uuid,
            partyIds,
          })
        : okAsync(partyIds),
  );

  if (parties.isErr() && parties.error.code !== "NOT_LOGGED_IN")
    return <ErrorComponent error={parties.error} caller="/journal/[shortened]/page.tsx" />;

  const partyEntries: React.ReactNode[] = [];
  for (let i = 0; i < journal.party_entries.length; i++) {
    const entry = journal.party_entries[i];

    partyEntries.push(
      <div key={entry.journal_id + entry.party_id} className="flex flex-col gap-2">
        {entry.location.length !== 0 && (
          <div className="flex flex-row items-center gap-2 text-sm font-quotes mb-3">
            <MapPinIcon className="mb-0.5" />
            {entry.location}
          </div>
        )}
        {entry.text.length !== 0 ? (
          <div className="max-w-prose text-lg items-start">
            <div className="text-5xl font-drop-caps float-start mr-2.5">{entry.text[0]}</div>
            {entry.text.slice(1)}
          </div>
        ) : (
          <div className="text-lg italic text-muted-foreground">No entry for this party.</div>
        )}
        <div className="flex flex-row items-center text-md italic font-quotes mt-2">
          —
          <Link
            href={`/parties/${entry.parties.shortened}`}
            className="text-foreground hover:text-foreground/80 transition-all underline"
          >
            {entry.parties.name}
          </Link>
        </div>
        {parties.isOk() && parties.value.includes(entry.party_id) && (
          <div className="flex flex-row justify-end w-full mt-2">
            <EditJournalPartySheet
              journal={{
                id: journal.id,
                title: journal.title,
                text: entry.text,
                location: entry.location,
                party: {
                  id: entry.party_id,
                  name: entry.parties.name,
                  shortened: entry.parties.shortened,
                },
              }}
            >
              <Button variant="outline" className="w-fit">
                Edit Entry
              </Button>
            </EditJournalPartySheet>
          </div>
        )}
      </div>,
    );

    if (i !== journal.party_entries.length - 1) {
      partyEntries.push(<TypographyHr key={"hr-" + entry.journal_id + entry.party_id} />);
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>{journal.title}</TypographyH1>
      <div className="text-right italic font-quotes text-lg mt-2">{format(journal.date, "PP")}</div>
      {user.isOk() && user.value.role === "admin" && (
        <div className="flex justify-end w-full mt-4">
          <EditJournalAdminSheet journal={journal}>Edit Journal</EditJournalAdminSheet>
        </div>
      )}
      <div className="flex flex-col gap-6 mt-6">{partyEntries}</div>
    </div>
  );
}

const getPlayerParties = ({ authUuid, partyIds }: { authUuid: string; partyIds: string[] }) =>
  runQuery((supabase) =>
    supabase
      .from("character_party")
      .select(
        `
        *,
        characters!inner(*, players!inner(*)),
        parties!inner(*)
        `,
      )
      .eq("characters.players.auth_user_uuid", authUuid)
      .in("parties.id", partyIds),
  ).map((result) => result.map((v) => v.parties.id));

const getDMParties = ({ authUuid, partyIds }: { authUuid: string; partyIds: string[] }) =>
  runQuery((supabase) =>
    supabase
      .from("dm_party")
      .select(
        `
        *,
        dms!inner(*),
        parties!inner(*)
        `,
      )
      .eq("dms.auth_user_uuid", authUuid)
      .in("parties.id", partyIds),
  ).map((result) => result.map((v) => v.parties.id));
