"use server";

import { z } from "zod";

import { okAsync } from "neverthrow";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { signUpFormSchema } from "@/config/auth-schemas";
import { parseSchema } from "@/utils/parse-schema";
import { resendConfirmationEmail, signUpUser } from "@/lib/auth";
import { getOrigin } from "@/lib/origin";

export const signUpAction = async (values: z.infer<typeof signUpFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(signUpFormSchema, values)
      .asyncAndThen(() => signUpUser(values))
      .andThen(() => okAsync()),
  );

export const resendSignUpEmailConfirmationAction = async (email: string) =>
  resultAsyncToActionResult(
    getOrigin().andThen((origin) => resendConfirmationEmail({ email, redirectTo: `${origin}/my` })),
  );
