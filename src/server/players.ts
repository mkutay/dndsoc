"use server";

import { z } from "zod";

import { okAsync } from "neverthrow";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { playersEditSchema } from "@/config/player-edit-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { uploadImagePlayer } from "@/lib/storage";

export const updatePlayer = async (values: z.infer<typeof playersEditSchema>, playerUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(playersEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("players")
            .update({
              about: values.about,
            })
            .eq("id", playerUuid)
            .select("users(username)")
            .single(),
        ),
      )
      .andThen(({ users }) =>
        values.image
          ? uploadImagePlayer({
              image: values.image,
              shortened: users.username,
              playerUuid,
            })
          : okAsync(),
      ),
  );
