"use server";

import { z } from "zod";

import { createPartySchema } from "@/config/create-party-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { convertToShortened } from "@/utils/formatting";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { partyDMEditSchema, partyPlayerEditSchema } from "@/config/parties";
import DB from "@/lib/db";

export const insertParty = async (values: z.infer<typeof createPartySchema>) => resultAsyncToActionResult(
  parseSchema(createPartySchema, values)
    .asyncAndThen(() => DB.DMs.Get.With.User())
    .andThen((DMUser) =>
      runQuery((supabase) => supabase
        .from("parties")
        .insert({
          name: values.name,
          shortened: convertToShortened(values.name),
        })
        .select()
        .single(),
        "insertParty"
      )
      .andThen((party) =>
        runQuery((supabase) => supabase
          .from("dm_party")
          .insert({
            dm_id: DMUser.id,
            party_id: party.id,
          })
          .select()
          .single(),
          "insertParty (dm_party)"
        )
      )
    )
    .map(() => ({ shortened: convertToShortened(values.name) }))
);

export const updatePlayerParty = async (values: z.infer<typeof partyPlayerEditSchema>, partyUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(partyPlayerEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) => supabase
          .from("parties")
          .update({
            about: values.about,
          })
          .eq("id", partyUuid),
          "updatePlayerParty"
        )
      )
  );

export const updateDMParty = async (values: z.infer<typeof partyDMEditSchema>, partyUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(partyDMEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) => supabase
          .from("parties")
          .update({
            about: values.about,
            level: values.level,
            name: values.name,
            shortened: convertToShortened(values.name),
          })
          .eq("id", partyUuid),
          "updateDMParty"
        )
      )
      .andThen(() =>
        runQuery((supabase) => supabase
          .from("character_party")
          .delete()
          .eq("party_id", partyUuid),
          "updateDMParty (character_party delete)"
        )
      )
      .andThen(() =>
        runQuery((supabase) => supabase
          .from("character_party")
          .upsert(
            values.characters.map((character) => ({
              character_id: character.id,
              party_id: partyUuid,
            })),
            { onConflict: "character_id, party_id", ignoreDuplicates: false }
          ),
          "updateDMParty (character_party upsert)"
        )
      )
      .andThen(() =>
        runQuery((supabase) => supabase
          .from("dm_party")
          .delete()
          .eq("party_id", partyUuid),
          "updateDMParty (dm_party delete)"
        )
      )
      .andThen(() =>
        runQuery((supabase) => supabase
          .from("dm_party")
          .upsert(
            values.dms.map((dm) => ({
              dm_id: dm.id,
              party_id: partyUuid,
            })),
            { onConflict: "dm_id, party_id", ignoreDuplicates: false }
          ),
          "updateDMParty (dm_party upsert)"
        )
      )
      .andThen(() =>
        runQuery((supabase) => supabase
          .from("party_campaigns")
          .delete()
          .eq("party_id", partyUuid),
          "updateDMParty (party_campaigns delete)"
        )
      )
      .andThen(() =>
        runQuery((supabase) => supabase
          .from("party_campaigns")
          .upsert(
            values.campaigns.map((campaign) => ({
              campaign_id: campaign.id,
              party_id: partyUuid,
            })),
            { onConflict: "campaign_id, party_id", ignoreDuplicates: false }
          ),
          "updateDMParty (party_campaigns upsert)"
        )
      )
  )