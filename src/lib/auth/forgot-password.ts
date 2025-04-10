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
    .asyncAndThen(() => {
      const supabase = createClient();
      const origin = getOrigin();
      const combined = ResultAsync.combine([origin, supabase]);

      return combined.andThen(([origin, supabase]) => {
        const response = supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
        });

        return ResultAsync.fromPromise(response, () => ({
          message: "Failed to reset password.",
          code: "DATABASE_ERROR",
        } as ForgotPasswordError));
      }).andThen((result) => {
        if (result.error) {
          return errAsync({
            message: "Failed to reset password: " + result.error.message,
            code: "DATABASE_ERROR",
          } as ForgotPasswordError);
        }
        return okAsync();
      });
    })
  );