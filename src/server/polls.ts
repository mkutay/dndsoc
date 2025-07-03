"use server";

import { z } from "zod";

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

export const editPoll = async (pollId: string, data: z.infer<typeof editPollSchema>) => {
  const parsed = parseSchema(editPollSchema, data);

  const polls = parsed
    .asyncAndThen(() =>
      runQuery((supabase) =>
        supabase
          .from("polls")
          .update({
            question: data.question,
            shortened: data.shortened,
            expires_at: data.expiresAt ? data.expiresAt.toISOString() : null,
          })
          .eq("id", pollId),
      ),
    )
    .andThen(() =>
      runQuery((supabase) =>
        supabase
          .from("options")
          .upsert(
            data.options.map((option) => ({
              text: option.text,
              id: option.id ? option.id : crypto.randomUUID(),
              poll_id: pollId,
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
          .eq("poll_id", pollId)
          .not("id", "in", `(${result.map((option) => `${option.id}`).join(",")})`),
      ),
    );

  return resultAsyncToActionResult(polls);
};
