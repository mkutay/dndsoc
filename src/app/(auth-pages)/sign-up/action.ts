"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { actionErr, ActionResult, resultAsyncToActionResult } from "@/utils/error-typing";
import { signUpFormSchema } from "../schemas";

type SignUpError = {
  message: string;
  code: "INVALID_FORM" | "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR";
};

export async function signUpAction(values: z.infer<typeof signUpFormSchema>):
  Promise<ActionResult<void, SignUpError>> {
  const validation = signUpFormSchema.safeParse(values);

  if (!validation.success) {
    return actionErr({
      message: "Invalid form data.",
      code: "INVALID_FORM",
    });
  }

  const supabase = ResultAsync.fromPromise(createClient(), () => ({
    message: "Failed to create Supabase client.",
    code: "SUPABASE_CLIENT_ERROR",
  } as SignUpError));

  const origin = ResultAsync.fromPromise(headers(), () => ({
    message: "Failed to get headers.",
    code: "SUPABASE_CLIENT_ERROR",
  } as SignUpError)).andThen((headers) => {
    const origin = headers.get("origin");
    if (!origin) {
      return errAsync({
        message: "Origin header not found.",
        code: "SUPABASE_CLIENT_ERROR",
      } as SignUpError);
    }
    return okAsync(origin);
  });

  const combined = ResultAsync.combine([origin, supabase]);

  const result = combined.andThen(([origin, supabase]) => {
    const response = supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    return ResultAsync.fromPromise(response, () => ({
      message: "Failed to sign up.",
      code: "DATABASE_ERROR",
    } as SignUpError));
  }).andThen((result) => {
    if (result.error) {
      return errAsync({
        message: "Failed to sign up: " + result.error.message,
        code: "DATABASE_ERROR",
      } as SignUpError);
    }
    return okAsync();
  });

  return resultAsyncToActionResult(result);
}