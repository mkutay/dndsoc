"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { journalEditSchema, journalCreateSchema, journalPartyEntryEditSchema } from "@/config/journal-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { convertToShortened } from "@/utils/formatting";

export const updateJournalAll = async (data: z.infer<typeof journalEditSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(journalEditSchema, data)
      .asyncAndThen(() =>
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
      )
      .andTee(() => {
        revalidatePath(path);
        revalidatePath("/journal");
      }),
  );

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
      .andTee(() => {
        revalidatePath(path);
        revalidatePath("/journal");
      }),
  );

export const createJournal = async (data: z.infer<typeof journalCreateSchema>) =>
  resultAsyncToActionResult(
    parseSchema(journalCreateSchema, data)
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
      .map((result) => result.shortened)
      .andTee((shortened) => {
        revalidatePath("/journal");
        revalidatePath(`/journal/${shortened}`);
      }),
  );
