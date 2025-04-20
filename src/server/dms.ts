"use server";

import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { playersEditSchema } from "@/config/player-edit-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { DMEditSchema } from "@/config/dms";

export const updateDM = async (values: z.infer<typeof DMEditSchema>, dmUuid: string) => 
  resultAsyncToActionResult(
    parseSchema(playersEditSchema, values)
    .asyncAndThen(() =>
      runQuery((supabase) => supabase
        .from("dms")
        .update({
          about: values.about,
        })
        .eq("id", dmUuid)
      )
    )
  );