"use server";

import { ResultAsync } from "neverthrow";
import { z } from "zod";

import { journalAllEditSchema, journalCreateSchema, journalPartyEntryEditSchema } from "@/config/journal-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { convertToShortened } from "@/utils/formatting";

export const updateJournalAll = async (journalId: string, data: z.infer<typeof journalAllEditSchema>) => {
  const parsed = parseSchema(journalAllEditSchema, data);

  const journal = parsed.asyncAndThen(() =>
    runQuery((supabase) =>
      supabase
        .from("journal")
        .update({
          excerpt: data.excerpt,
          date: data.date.toISOString(),
          title: data.title,
          shortened: data.shortened,
        })
        .eq("id", journalId)
    )
  );

  const partyEntries = parsed.asyncAndThen(() =>
    runQuery((supabase) =>
      supabase
        .from("party_entries")
        .upsert(
          data.entries.map((entry) => ({
            party_id: entry.partyId,
            journal_id: journalId,
            text: entry.text,
          })),
          { onConflict: "party_id,journal_id" }
        )
    )
  );

  return resultAsyncToActionResult(ResultAsync.combine([journal, partyEntries]));
}

export const updateJournalPartyEntry = async (journalId: string, partyId: string, data: z.infer<typeof journalPartyEntryEditSchema>) => {
  const parsed = parseSchema(journalPartyEntryEditSchema, data);

  const partyEntry = parsed.asyncAndThen(() =>
    runQuery((supabase) =>
      supabase
        .from("party_entries")
        .update({ text: data.text })
        .eq("journal_id", journalId)
        .eq("party_id", partyId)
    )
  );
  
  return resultAsyncToActionResult(partyEntry);
};

export const createJournal = async (data: z.infer<typeof journalCreateSchema>) => {
  const parsed = parseSchema(journalCreateSchema, data);

  const journal = parsed.asyncAndThen(() =>
    runQuery((supabase) =>
      supabase
        .from("journal")
        .insert({
          campaign_id: data.campaignId,
          title: data.title,
          shortened: convertToShortened(data.title),
          date: new Date().toISOString(),
          excerpt: "",
        })
        .select()
        .single()
    )
  )
  .andThen((journal) => 
    runQuery((supabase) => 
      supabase.rpc("create_party_entries_for_campaign", {
        a_campaign_id: journal.campaign_id,
        a_journal_id: journal.id,
      })
    )
    .map(() => journal)
  )
  .map((result) => result.shortened)

  return resultAsyncToActionResult(journal);
}