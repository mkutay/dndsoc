"use server";

import { z } from "zod";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { actionErr, ActionResult, resultAsyncToActionResult } from "@/utils/error-typing";
import { createClient } from "@/utils/supabase/server";
import { resetPasswordSchema } from "./schema";

type ResetPasswordError = {
  message: string;
  code: "INVALID_FORM" | "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "PASSWORD_MISMATCH";
};

export async function resetPasswordAction(values: z.infer<typeof resetPasswordSchema>):
  Promise<ActionResult<void, ResetPasswordError>> {
  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as ResetPasswordError));

  const password = values.newPassword
  const confirmPassword = values.confirmPassword;

  if (password !== confirmPassword) {
    return actionErr({
      message: "Passwords do not match.",
      code: "PASSWORD_MISMATCH",
    } as ResetPasswordError);
  }

  const updated = supabase.andThen((supabase) => {
    const updated = supabase.auth.updateUser({
      password: password,
    });
    return ResultAsync.fromPromise(updated, () => ({
      message: "Failed to update password.",
      code: "DATABASE_ERROR",
    } as ResetPasswordError));
  }).andThen((result) => {
    if (result.error) {
      return errAsync({
        message: "Failed to update password.",
        code: "DATABASE_ERROR",
      } as ResetPasswordError);
    }
    return okAsync();
  });

  return resultAsyncToActionResult(updated);
};