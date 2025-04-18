"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { forgotPasswordFormSchema } from "@/config/auth-schemas";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";
import { getOrigin } from "./origin";

type ForgotPasswordError = {
  message: string;
  code: "DATABASE_ERROR";
}

export const forgotPasswordAction = async (values: z.infer<typeof forgotPasswordFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(forgotPasswordFormSchema, values)
    .asyncAndThen(() => ResultAsync.combine([getOrigin(), createClient()]))
    .andThen(([origin, supabase]) => ResultAsync
      .fromSafePromise(
        supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
        }
      )
    )
    .andThen((result) => !result.error
      ? okAsync(result.data)
      : errAsync({
          message: "Failed to reset password (in supabase): " + result.error.message,
          code: "DATABASE_ERROR",
        } as ForgotPasswordError)
      )
    )
  )