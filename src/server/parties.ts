"use server";

import { revalidatePath } from "next/cache";
import { okAsync } from "neverthrow";
import { z } from "zod";

import { partyDMEditSchema, partyPlayerEditSchema, createPartySchema } from "@/config/parties";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { convertToShortened } from "@/utils/formatting";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery, supabaseRun } from "@/utils/supabase-run";
import { getDMUser } from "@/lib/dms";
import { createClient } from "@/utils/supabase/server";
import { uploadImageParty } from "@/lib/storage";

export const insertParty = async (values: z.infer<typeof createPartySchema>) =>
  resultAsyncToActionResult(
    parseSchema(createPartySchema, values)
      .asyncAndThen(() => getDMUser())
      .andThen((DMUser) =>
        runQuery(
          (supabase) =>
            supabase
              .from("parties")
              .insert({
                name: values.name,
                shortened: convertToShortened(values.name),
              })
              .select()
              .single(),
          "insertParty",
        ).andThen((party) =>
          runQuery(
            (supabase) =>
              supabase
                .from("dm_party")
                .insert({
                  dm_id: DMUser.id,
                  party_id: party.id,
                })
                .select()
                .single(),
            "insertParty (dm_party)",
          ),
        ),
      )
      .map(() => ({ shortened: convertToShortened(values.name) })),
  );

export const updatePlayerParty = async (values: z.infer<typeof partyPlayerEditSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(partyPlayerEditSchema, values)
      .asyncAndThen(() =>
        runQuery(
          (supabase) =>
            supabase
              .from("parties")
              .update({
                about: values.about,
              })
              .eq("id", values.partyId),
          "updatePlayerParty",
        ),
      )
      .andTee(() => revalidatePath(path)),
  );

export const insertPartyWithCampaign = async (values: z.infer<typeof createPartySchema>, campaignUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(createPartySchema, values)
      .asyncAndThen(() =>
        runQuery(
          (supabase) =>
            supabase
              .from("parties")
              .insert({
                name: values.name,
                shortened: convertToShortened(values.name),
              })
              .select()
              .single(),
          "insertPartyWithCampaign",
        ).andThen((party) =>
          runQuery(
            (supabase) =>
              supabase
                .from("party_campaigns")
                .insert({
                  party_id: party.id,
                  campaign_id: campaignUuid,
                })
                .select()
                .single(),
            "insertPartyWithCampaign (party_campaigns)",
          ),
        ),
      )
      .map(() => ({ shortened: convertToShortened(values.name) })),
  );

export const updateDMParty = async (values: z.infer<typeof partyDMEditSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(partyDMEditSchema, values)
      .asyncAndThen(createClient)
      .andThrough((supabase) =>
        supabaseRun(
          supabase
            .from("parties")
            .update({
              about: values.about,
              level: values.level,
              name: values.name,
              shortened: convertToShortened(values.name),
            })
            .eq("id", values.partyId),
          "updateDMParty",
        ),
      )
      .andThrough((supabase) =>
        supabaseRun(
          supabase.from("character_party").delete().eq("party_id", values.partyId),
          "updateDMParty (character_party delete)",
        ),
      )
      .andThrough((supabase) =>
        supabaseRun(
          supabase.from("character_party").upsert(
            values.characters.map((character) => ({
              character_id: character.id,
              party_id: values.partyId,
            })),
            { onConflict: "character_id, party_id", ignoreDuplicates: false },
          ),
          "updateDMParty (character_party upsert)",
        ),
      )
      .andThen(() =>
        values.image
          ? uploadImageParty({
              file: values.image,
              shortened: convertToShortened(values.name),
              partyId: values.partyId,
            })
          : okAsync(),
      )
      .andTee(() => revalidatePath(path)),
  );

export const addPartyToCampaign = async ({
  partyId,
  campaignId,
  shortened,
}: {
  partyId: string;
  campaignId: string;
  shortened: string;
}) =>
  resultAsyncToActionResult(
    runQuery(
      (supabase) =>
        supabase.from("party_campaigns").insert({
          party_id: partyId,
          campaign_id: campaignId,
        }),
      "addPartyToCampaign",
    ).andTee(() => revalidatePath(`/campaigns/${shortened}`, "page")),
  );
