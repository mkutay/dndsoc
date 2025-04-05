"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { playersEditSchema } from "@/app/players/edit/schema";
import { actionErr, ActionResult, resultAsyncToActionResult } from "@/types/error-typing";

type UpdatePlayerError = {
  message: string;
  code: "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "INVALID_FORM" | "NO_CHANGES";
};

export async function updatePlayer(values: z.infer<typeof playersEditSchema>, userUuid: string):
  Promise<ActionResult<void, UpdatePlayerError>> {

  const validation = playersEditSchema.safeParse(values);
  if (!validation.success) {
    return actionErr({
      message: "Invalid input data.",
      code: "INVALID_FORM",
    });
  }

  // Make sure there are actual changes
  if (values.about === values.originalAbout) {
    return actionErr({
      message: "No changes were made.",
      code: "NO_CHANGES",
    });
  }

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as UpdatePlayerError));

  const result = supabase
    .andThen((supabase) => {
      const response = supabase
        .from("players")
        .update({
          about: values.about,
        })
        .eq("user_uuid", userUuid);

      return ResultAsync.fromPromise(response, (error) => ({
        message: `Failed to update player data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpdatePlayerError));
    })
    .andThen((response) => {
      if (response.error) {
        return errAsync({
          message: "Failed to update player data: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpdatePlayerError);
      }
      return okAsync();
    });

  return resultAsyncToActionResult(result);
}