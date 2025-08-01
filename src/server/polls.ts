"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { createPollSchema, editPollSchema } from "@/config/poll-schema";
import { convertToShortened } from "@/utils/formatting";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { getUser } from "@/lib/auth";

export const createPoll = async (data: z.infer<typeof createPollSchema>) =>
  resultAsyncToActionResult(
    parseSchema(createPollSchema, data)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("polls")
            .insert({
              question: data.question,
              shortened: convertToShortened(data.question),
            })
            .select("*")
            .single(),
        ),
      )
      .map((result) => result.shortened),
  );

export const voteOnPoll = async ({ optionId, pollId }: { optionId: string; pollId: string }) =>
  resultAsyncToActionResult(
    getUser().andThen((user) =>
      runQuery((supabase) =>
        supabase.rpc("vote_on", {
          a_option_id: optionId,
          a_auth_user_uuid: user.id,
          a_poll_id: pollId,
        }),
      ),
    ),
  );

export const editPoll = async (data: z.infer<typeof editPollSchema>, path: string) =>
  resultAsyncToActionResult(
    parseSchema(editPollSchema, data)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("polls")
            .update({
              question: data.question,
              shortened: data.shortened,
              expires_at: data.expiresAt ? data.expiresAt.toISOString() : null,
            })
            .eq("id", data.pollId),
        ),
      )
      .andThen(() =>
        runQuery((supabase) =>
          supabase
            .from("options")
            .upsert(
              data.options.map((option) => ({
                text: option.text,
                id: option.id ?? crypto.randomUUID(),
                poll_id: data.pollId,
              })),
            )
            .select("*"),
        ),
      )
      .andThen((result) =>
        runQuery((supabase) =>
          supabase
            .from("options")
            .delete()
            .eq("poll_id", data.pollId)
            .not("id", "in", `(${result.map((option) => `${option.id}`).join(",")})`),
        ),
      )
      .andTee(() => revalidatePath(path)),
  );
