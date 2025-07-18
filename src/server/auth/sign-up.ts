"use server";

import { errAsync, okAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { resendConfirmationEmail, signUpUser } from "@/lib/auth";
import { signUpFormSchema } from "@/config/auth-schemas";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { getOrigin } from "@/lib/origin";

export const signUpAction = async (values: z.infer<typeof signUpFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(signUpFormSchema, values)
      .asyncAndThrough(checkUniqueness)
      .andThen(signUpUser)
      .andThen(() => okAsync()),
  );

export const resendSignUpEmailConfirmationAction = async (email: string) =>
  resultAsyncToActionResult(
    getOrigin().andThen((origin) => resendConfirmationEmail({ email, redirectTo: `${origin}/my` })),
  );

type CheckUniquenessError = {
  message: string;
  code: "UNIQUE_VIOLATION";
};

const checkUniqueness = (values: z.infer<typeof signUpFormSchema>) =>
  runQuery((supabase) =>
    supabase.from("users").select("*").or(`username.eq.${values.username}, knumber.eq.${values.knumber}`),
  ).andThen((data) =>
    data.length !== 0
      ? errAsync({
          message: "Username or K-Number already exists.",
          code: "UNIQUE_VIOLATION",
        } as CheckUniquenessError)
      : okAsync(),
  );
