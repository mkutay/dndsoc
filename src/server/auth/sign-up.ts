"use server";

import { errAsync, fromSafePromise, okAsync } from "neverthrow";
import { z } from "zod";

import { associatesSignUpFormSchema, signUpFormSchema } from "@/config/auth-schemas";
import { sendAssociatesSignUpRequest } from "@/lib/associates-requests";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { resendConfirmationEmail, signUpUser } from "@/lib/auth";
import { parseSchema } from "@/utils/parse-schema";
import { runServiceQuery } from "@/utils/supabase-run";
import { getOrigin } from "@/lib/origin";
import { sendNewAssociatesSignUpRequestToAdmin } from "@/lib/email";
import { createServiceClient } from "@/utils/supabase/server";

export const signUpAction = async (values: z.infer<typeof signUpFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(signUpFormSchema, values)
      .asyncAndThrough(checkUniqueness)
      .andThen(signUpUser)
      .andThen(() => okAsync()),
  );

export const associatesSignUpAction = async (values: z.infer<typeof associatesSignUpFormSchema>) =>
  resultAsyncToActionResult(
    parseSchema(associatesSignUpFormSchema, values)
      .asyncAndThrough(checkUniquenessEmail)
      .andThen(sendAssociatesSignUpRequest)
      .andThen(sendNewAssociatesSignUpRequestToAdmin)
      .andThen(() => okAsync()),
  );

export const resendSignUpEmailConfirmationAction = async (email: string) =>
  resultAsyncToActionResult(
    getOrigin().andThen((origin) => resendConfirmationEmail({ email, redirectTo: `${origin}/my` })),
  );

type CheckUniquenessError = {
  message: string;
  code: "UNIQUE_VIOLATION" | "DATABASE_ERROR";
};

const checkUniqueness = (values: z.infer<typeof signUpFormSchema>) =>
  runServiceQuery((supabase) =>
    supabase.from("users").select("*").or(`username.eq.${values.username}, knumber.eq.${values.knumber}`),
  )
    .andThen((data) =>
      data.length !== 0
        ? errAsync({
            message: "Username or K-Number already exists.",
            code: "UNIQUE_VIOLATION",
          } as CheckUniquenessError)
        : okAsync(),
    )
    .andThen(() =>
      runServiceQuery((supabase) => supabase.from("associates_requests").select("email").eq("email", values.email)),
    )
    .andThen((data) =>
      data.length !== 0
        ? errAsync({
            message: "Email already exists.",
            code: "UNIQUE_VIOLATION",
          } as CheckUniquenessError)
        : okAsync(),
    );

const checkUniquenessEmail = ({ email }: { email: string }) =>
  createServiceClient()
    .andThen((supabase) =>
      fromSafePromise(
        supabase.auth.admin.listUsers({
          page: 1,
          perPage: 300,
        }),
      ),
    )
    .andThen((response) =>
      !response.error
        ? okAsync(response.data.users)
        : errAsync({
            message: `Failed to check uniqueness`,
            code: "DATABASE_ERROR",
          } as CheckUniquenessError),
    )
    .andThen((users) =>
      users.find((user) => user.email === email) === undefined
        ? okAsync()
        : errAsync({
            message: "Email already exists.",
            code: "UNIQUE_VIOLATION",
          } as CheckUniquenessError),
    );
