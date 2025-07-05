"use server";

import { errAsync, okAsync } from "neverthrow";
import { z } from "zod";

import { createPollFormSchema, editPollFormSchema, pollVoteFormSchema } from "@/config/when2dnd";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { createCode } from "@/lib/when2dnd";

export const createWhen2DnDPoll = async (values: z.infer<typeof createPollFormSchema>, authUserUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(createPollFormSchema, values).asyncAndThen(() =>
      runQuery((supabase) =>
        supabase
          .from("when2dnd_polls")
          .insert({
            created_by: authUserUuid,
            title: values.title,
            date_from: values.dateRange.from.toISOString(),
            date_to: values.dateRange.to.toISOString(),
            deadline: values.deadline?.toISOString(),
            code: createCode(),
          })
          .select("code")
          .single(),
      ),
    ),
  );

export const editWhen2DnDPoll = async (values: z.infer<typeof editPollFormSchema>, pollId: string) =>
  resultAsyncToActionResult(
    parseSchema(editPollFormSchema, values).asyncAndThen(() =>
      runQuery((supabase) =>
        supabase
          .from("when2dnd_polls")
          .update({
            title: values.title,
            date_from: values.dateRange.from.toISOString(),
            date_to: values.dateRange.to.toISOString(),
            deadline: values.deadline?.toISOString(),
          })
          .eq("id", pollId),
      ),
    ),
  );

type AddError = {
  code: "INVALID_DATE_RANGE" | "DEADLINE_PASSED";
  message: string;
};

export const addVoteToWhen2DnDPoll = async (
  values: z.infer<typeof pollVoteFormSchema>,
  { pollId, authUserUuid }: { pollId: string; authUserUuid: string },
) =>
  resultAsyncToActionResult(
    parseSchema(pollVoteFormSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase.from("when2dnd_polls").select("date_from, date_to, deadline").eq("id", pollId).single(),
        ),
      )
      .andThen((poll) =>
        values.dateRange.from.toISOString() === new Date(poll.date_from).toISOString() &&
        values.dateRange.to.toISOString() === new Date(poll.date_to).toISOString()
          ? okAsync(poll.deadline)
          : errAsync({
              code: "INVALID_DATE_RANGE",
              message: "The selected date range does not match the poll.",
            } as AddError),
      )
      .andThen((deadline) =>
        deadline && new Date(deadline) < new Date()
          ? errAsync({ code: "DEADLINE_PASSED", message: "The deadline for this poll has passed." } as AddError)
          : okAsync(),
      )
      .andThen(() =>
        runQuery((supabase) =>
          supabase.from("when2dnd_votes").delete().eq("when2dnd_poll_id", pollId).eq("auth_user_uuid", authUserUuid),
        ),
      )
      .andThen(() =>
        runQuery((supabase) =>
          supabase.from("when2dnd_votes").insert(
            values.dateSelections.flatMap((selection) =>
              selection.times.map((time) => ({
                when2dnd_poll_id: pollId,
                start: time.from.toISOString(),
                end: time.to.toISOString(),
              })),
            ),
          ),
        ),
      ),
  );
