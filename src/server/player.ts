"use server";

import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { playersEditSchema } from "@/config/player-edit-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

export const updatePlayer = async (values: z.infer<typeof playersEditSchema>, playerUuid: string) => 
  resultAsyncToActionResult(
    parseSchema(playersEditSchema, values)
    .asyncAndThen(() =>
      runQuery((supabase) => supabase
        .from("players")
        .update({
          about: values.about,
        })
        .eq("id", playerUuid)
      )
    )
  );