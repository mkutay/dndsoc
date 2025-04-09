"use server";

import { z } from "zod";
import { errAsync, fromPromise, okAsync, ResultAsync } from "neverthrow";

import { addCharacterSchema } from "@/config/add-character-schema";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { createClient } from "@/utils/supabase/server";
import { getPlayerUser } from "@/lib/player-user";

type InsertCharacterError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const insertCharacter = async (values: z.infer<typeof addCharacterSchema>) =>
  resultAsyncToActionResult(
    parseSchema(addCharacterSchema, values)
      .asyncAndThen(() =>
        ResultAsync.combine([createClient(), getPlayerUser()])
          .andThen(([supabase, playerUser]) =>
            fromPromise(
              supabase
                .from("characters")
                .insert({
                  name: values.name,
                  player_uuid: playerUser.id,
                  shortened: convertToShortened(values.name),
                })
                .select()
                .single(),
              (error) => ({
                message: "Could not insert into characters table: " + (error as Error).message,
                code: "DATABASE_ERROR",
              } as InsertCharacterError)
            )
          )
          .andThen((response) =>
            !response.error
              ? okAsync(response.data)
              : errAsync({
                  message: "Failed to insert character: " + response.error.message,
                  code: "DATABASE_ERROR",
                } as InsertCharacterError)
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