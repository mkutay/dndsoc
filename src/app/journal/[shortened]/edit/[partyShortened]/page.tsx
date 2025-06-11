import { forbidden } from "next/navigation";
import { cache } from "react";
import Link from "next/link";

import { ErrorComponent } from "@/components/error-component";
import { TypographyH1 } from "@/components/typography/headings";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { PartyEntryForm } from "./form";

export const dynamic = "force-dynamic";

const getPartyEntry = ({ journalShortened, partyShortened }: { journalShortened: string, partyShortened: string }) =>
  runQuery((supabase) => supabase
    .from("party_entries")
    .select(`
      *,
      journal!inner(*),
      parties!inner(*)
    `)
    .eq("journal.shortened", journalShortened)
    .eq("parties.shortened", partyShortened)
    .single()
  );

const cachedGetPartyEntry = cache(getPartyEntry);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string, partyShortened: string }> }) {
  const { shortened, partyShortened } = await params;

  const result = await cachedGetPartyEntry({ journalShortened: shortened, partyShortened });
  if (result.isErr()) return { title: "Party Entry Not Found" };

  return {
    title: `Edit ${result.value.parties.name}'s Journal Entry`,
    description: `Edit the details of this party's journal entry for ${result.value.journal.title}.`,
    openGraph: {
      title: `Edit ${result.value.parties.name}'s Journal Entry`,
      description: `Edit the details of this party's journal entry for ${result.value.journal.title}.`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ shortened: string, partyShortened: string }> }) {
  const { shortened, partyShortened } = await params;

  const user = await getUserRole();
  if (user.isErr() && user.error.code !== "NOT_LOGGED_IN") return <ErrorComponent error={user.error} caller="/journal/[shortened]/edit/[partyShortened]/page.tsx" />;
  if (user.isErr()) {
    forbidden();
  }

  if (user.value.role === "dm") {
    const access = await doesDMHaveAccessToParty({ partyShortened, authUuid: user.value.auth_user_uuid });
    if (access.isErr() || !access.value) forbidden();
  }

  if (user.value.role === "player") {
    const access = await doesPlayerHaveAccessToParty({ partyShortened, authUuid: user.value.auth_user_uuid });
    if (access.isErr() || !access.value) forbidden();
  }

  const result = await cachedGetPartyEntry({ journalShortened: shortened, partyShortened });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/journal/[id]/edit/[partyShortened]/page.tsx" />;
  const entry = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Link href={`/journal/${entry.journal.shortened}`} className="text-muted-foreground hover:text-muted-foreground/80 transition-all text-md font-quotes w-fit">
        Go Back to Entry
      </Link>
      <TypographyH1>Edit {entry.parties.name}&apos;s Journal Entry</TypographyH1>
      <PartyEntryForm
        entry={entry}
      />
    </div>
  );
}

const doesDMHaveAccessToParty = ({ partyShortened, authUuid }: { partyShortened: string, authUuid: string }) => {
  return runQuery((supabase) => supabase
    .from("dms")
    .select("*, dm_party(*, parties!inner(*))")
    .eq("auth_user_uuid", authUuid)
    .eq("dm_party.parties.shortened", partyShortened)
    .single()
  )
  .map((result) => {
    for (const dm of result.dm_party) {
      if (dm.parties.shortened === partyShortened) {
        return true;
      }
    }
    return false;
  })
}

const doesPlayerHaveAccessToParty = ({ partyShortened, authUuid }: { partyShortened: string, authUuid: string }) => {
  return runQuery((supabase) => supabase
    .from("players")
    .select("*, characters!inner(*, character_party!inner(*, parties!inner(*)))")
    .eq("auth_user_uuid", authUuid)
    .eq("characters.character_party.parties.shortened", partyShortened)
    .single()
  )
  .map((result) => {
    for (const character of result.characters) {
      for (const characterParty of character.character_party) {
        if (characterParty.parties.shortened === partyShortened) {
          return true;
        }
      }
    }
    return false;
  })
}