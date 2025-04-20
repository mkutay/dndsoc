"use server";

import { z } from "zod";

import { createPartySchema } from "@/config/create-party-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { convertToShortened } from "@/utils/formatting";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { getDMUser } from "@/lib/dms";

export const insertParty = async (values: z.infer<typeof createPartySchema>) => resultAsyncToActionResult(
  parseSchema(createPartySchema, values)
    .asyncAndThen(() => getDMUser())
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
)
