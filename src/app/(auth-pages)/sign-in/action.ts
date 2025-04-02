"use server";

import { z } from "zod";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { actionErr, ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";
import { signInFormSchema } from "../schemas";

type SignInError = {
  message: string;
  code: "INVALID_FORM" | "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
}

export async function signInAction(values: z.infer<typeof signInFormSchema>):
  Promise<ActionResult<void, SignInError>> {
  const validation = signInFormSchema.safeParse(values);
  if (!validation.success) {
    return actionErr({
      message: "Invalid form data.",
      code: "INVALID_FORM",
    });
  }
  
  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as SignInError));

  const signed = supabase.andThen((supabase) => {
    const result = supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    return ResultAsync.fromPromise(result, () => ({
      message: "Failed to sign in.",
      code: "DATABASE_ERROR",
    } as SignInError));
  }).andThen((result) => {
    if (result.error) {
      return errAsync({
        message: "Failed to sign in.",
        code: "DATABASE_ERROR",
      } as SignInError);
    }
    return okAsync();
  });

  return resultAsyncToActionResult(signed);
};