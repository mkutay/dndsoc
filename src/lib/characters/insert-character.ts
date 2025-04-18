"use server";

import { z } from "zod";

import { addCharacterSchema } from "@/config/add-character-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { getPlayerUser } from "@/lib/player-user";
import { runQuery } from "@/utils/supabase-run";

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
  );

// No numbers, no spaces, no special characters
// Only the first name
const convertToShortened = (name: string) => {
  const firstName = name.split(" ")[0];
  const shortened = firstName
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase()
  return shortened;
}