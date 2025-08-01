"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { journalAllEditSchema, journalCreateSchema, journalPartyEntryEditSchema } from "@/config/journal-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { convertToShortened } from "@/utils/formatting";

export const updateJournalAll = async (data: z.infer<typeof journalAllEditSchema>, path: string) => {
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
        .eq("id", data.journalId),
    ),
  );

  // const partyEntries = parsed.asyncAndThen(() =>
  //   runQuery((supabase) =>
  //     supabase.from("party_entries").upsert(
  //       data.entries.map((entry) => ({
  //         party_id: entry.partyId,
  //         journal_id: data.journalId,
  //         text: entry.text,
  //       })),
  //       { onConflict: "party_id,journal_id" },
  //     ),
  //   ),
  // );

  return resultAsyncToActionResult(journal.andTee(() => revalidatePath(path)));
};

export const updateJournalPartyEntry = async (data: z.infer<typeof journalPartyEntryEditSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(journalPartyEntryEditSchema, data)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("party_entries")
            .update({ text: data.text, location: data.location })
            .eq("journal_id", data.journalId)
            .eq("party_id", data.partyId),
        ),
      )
      .andTee(() => revalidatePath(path)),
  );

export const createJournal = async (data: z.infer<typeof journalCreateSchema>) => {
  const parsed = parseSchema(journalCreateSchema, data);

  const journal = parsed
    .asyncAndThen(() =>
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
          .single(),
      ),
    )
    .andThen((journal) =>
      runQuery((supabase) =>
        supabase.rpc("create_party_entries_for_campaign", {
          a_campaign_id: journal.campaign_id,
          a_journal_id: journal.id,
        }),
      ).map(() => journal),
    )
    .map((result) => result.shortened);

  return resultAsyncToActionResult(journal);
};
