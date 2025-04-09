"use server";

import { z } from "zod";
import { errAsync, fromPromise, okAsync } from "neverthrow";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { resetPasswordSchema } from "@/config/auth-schemas";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";

type ResetPasswordError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const resetPasswordAction = async (values: z.infer<typeof resetPasswordSchema>) =>
  resultAsyncToActionResult(
    parseSchema(resetPasswordSchema, values)
      .asyncAndThen(() =>
        createClient()
          .andThen((supabase) =>
            fromPromise(
              supabase.auth.updateUser({
                password: values.newPassword,
              }),
              (error) => ({
                message: "Failed to reset password: " + (error as Error).message,
                code: "DATABASE_ERROR",
              } as ResetPasswordError)
            )
          )
          .andThen((result) =>
            !result.error
              ? okAsync()
              : errAsync({
                  message: "Failed to reset password (supabase): " + result.error.message,
                  code: "DATABASE_ERROR",
                } as ResetPasswordError)
          )
      )
  );