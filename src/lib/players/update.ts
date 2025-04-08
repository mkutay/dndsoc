"use server";

import { errAsync, fromPromise, okAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { playersEditSchema } from "@/config/player-edit-schema";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";

type UpdatePlayerError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const updatePlayer = async (values: z.infer<typeof playersEditSchema>, playerUuid: string) => 
  resultAsyncToActionResult(
    parseSchema(playersEditSchema, values)
    .asyncAndThen(() =>
      createClient()
        .andThen((supabase) =>
          fromPromise(
            supabase
              .from("players")
              .update({
                about: values.about,
              })
              .eq("id", playerUuid),
            (error) => ({
              message: `Failed to update player data: ${error instanceof Error ? error.message : 'Unknown error'}`,
              code: "DATABASE_ERROR",
            } as UpdatePlayerError)
          )
        )
        .andThen((response) =>
          !response.error
            ? okAsync()
            : errAsync({
                message: "Failed to update player data: " + response.error.message,
                code: "DATABASE_ERROR",
              } as UpdatePlayerError)
        )
    )
  );