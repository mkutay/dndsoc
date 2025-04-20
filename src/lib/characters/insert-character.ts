"use server";

import { z } from "zod";

import { addCharacterSchema } from "@/config/add-character-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { getPlayerUser } from "@/lib/player-user";
import { runQuery } from "@/utils/supabase-run";
import { convertToShortened } from "@/utils/formatting";

export const insertCharacter = async (values: z.infer<typeof addCharacterSchema>) =>
  resultAsyncToActionResult(
    parseSchema(addCharacterSchema, values)
      .asyncAndThen(() => getPlayerUser())
      .andThen((playerUser) =>
        runQuery((supabase) => supabase
          .from("characters")
          .insert({
            name: values.name,
            player_uuid: playerUser.id,
            shortened: convertToShortened(values.name),
          })
          .select()
          .single(),
          "insertCharacter"
        )
      )
      .map((result) => ({
        shortened: result.shortened
      }))
  );