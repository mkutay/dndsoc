"use server";

import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { signUpFormSchema } from "@/config/auth-schemas";
import { parseSchema } from "@/utils/parse-schema";
import { signUpUser } from "@/lib/auth";

export const signUpAction = async (values: z.infer<typeof signUpFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(signUpFormSchema, values)
      .asyncAndThen(() => signUpUser(values))
      .map((user) => ({ email: user.email })),
  );
