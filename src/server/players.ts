"use server";

import { z } from "zod";
import { okAsync } from "neverthrow";
import { revalidatePath } from "next/cache";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { playersEditSchema } from "@/config/player-edit-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { uploadImagePlayer } from "@/lib/storage";

export async function updatePlayer(values: z.infer<typeof playersEditSchema>, path: string) {
  return resultAsyncToActionResult(
    parseSchema(playersEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("players")
            .update({
              about: values.about,
            })
            .eq("id", values.playerId)
            .select("users(username)")
            .single(),
        ),
      )
      .andThen(({ users }) =>
        values.image
          ? uploadImagePlayer({
              image: values.image,
              shortened: users.username,
              playerUuid: values.playerId,
            })
          : okAsync(),
      )
      .andTee(() => revalidatePath(path)),
  );
}
