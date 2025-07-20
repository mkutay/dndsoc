"use server";

import { errAsync, fromSafePromise, okAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { forgotPasswordFormSchema } from "@/config/auth-schemas";
import { createClient } from "@/utils/supabase/server";
import { parseSchema } from "@/utils/parse-schema";

type ForgotPasswordError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const forgotPasswordAction = async (values: z.infer<typeof forgotPasswordFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(forgotPasswordFormSchema, values)
      .asyncAndThen(createClient)
      .andThen((supabase) => fromSafePromise(supabase.auth.resetPasswordForEmail(values.email)))
      .andThen((result) =>
        !result.error
          ? okAsync()
          : errAsync({
              message: "Failed to reset password (in supabase): " + result.error.message,
              code: "DATABASE_ERROR",
            } as ForgotPasswordError),
      ),
  );
