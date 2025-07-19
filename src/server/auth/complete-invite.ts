"use server";

import { okAsync, errAsync, fromPromise } from "neverthrow";
import type { User } from "@supabase/supabase-js";
import type z from "zod";

import { completeInviteSchema } from "@/config/auth-schemas";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";
import { runQuery } from "@/utils/supabase-run";
import { completeSignUp, verifyOtp } from "@/lib/auth";
import { parseSchema } from "@/utils/parse-schema";

type CompleteInviteError = {
  code: "UPDATE_USER_ERROR" | "OTP_VERIFICATION_FAILURE";
  message: string;
};

export const completeInviteAction = async (values: z.infer<typeof completeInviteSchema>, tokenHash: string) =>
  resultAsyncToActionResult(
    parseSchema(completeInviteSchema, values)
      .asyncAndThen(() => verifyOtp({ type: "invite", tokenHash }))
      .map((response) => response.user)
      .andThen((user) =>
        user
          ? okAsync()
          : errAsync({
              code: "OTP_VERIFICATION_FAILURE",
              message: "Could not verify the given OTP. Maybe the link expired?",
            } as CompleteInviteError),
      )
      .andThen(createClient)
      .andThen((supabase) =>
        fromPromise(
          supabase.auth.updateUser({
            password: values.password,
            data: {
              username: values.username,
            },
          }),
          (error) => ({ code: "UPDATE_USER_ERROR", message: error }) as CompleteInviteError,
        ),
      )
      .andThen((response) =>
        !response.error
          ? okAsync(response.data.user)
          : errAsync({
              code: "UPDATE_USER_ERROR",
              message: response.error.message,
            } as CompleteInviteError),
      )
      .andThrough(completeSignUp)
      .andThen(updateAssociatesRequestsTable),
  );

const updateAssociatesRequestsTable = (user: User) =>
  runQuery((supabase) =>
    supabase.from("associates_requests").update({ user_id: user.id }).eq("id", user.user_metadata.requestId),
  );
