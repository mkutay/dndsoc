"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";
import { headers } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import { actionErr, ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { forgotPasswordFormSchema } from "../../config/auth-schemas";
import { getOrigin } from "./origin";

type ForgotPasswordError = {
  message: string;
  code: "INVALID_FORM" | "SUPABASE_CLIENT_ERROR" | "DATABASE_ERROR" | "GET_ORIGIN_ERROR";
}

export async function forgotPasswordAction(values: z.infer<typeof forgotPasswordFormSchema>):
  Promise<ActionResult<void, ForgotPasswordError>> {
  const validation = forgotPasswordFormSchema.safeParse(values);
  if (!validation.success) {
    return actionErr({
      message: "Invalid form data.",
      code: "INVALID_FORM",
    });
  }

  const { email } = values;

  const supabase = createClient();

  const origin = getOrigin();

  const combined = ResultAsync.combine([origin, supabase]);

  const result = combined.andThen(([origin, supabase]) => {
    const response = supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
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
  
  return resultAsyncToActionResult(result);
};