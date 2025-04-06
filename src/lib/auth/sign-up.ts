"use server";

import { z } from "zod";
import { ResultAsync } from "neverthrow";

import { actionErr, ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { signUpFormSchema } from "@/config/auth-schemas";
import { signUpUser } from "./sign-up-user";
import { insertUser } from "../users/insert";
import { insertRole } from "../roles/insert";
import { insertPlayer } from "../players/insert";

type SignUpError = {
  message: string;
  code: "INVALID_FORM" | "DATABASE_ERROR" | "SUPABASE_CLIENT_ERROR" | "GET_ORIGIN_ERROR";
};

export async function signUpAction(values: z.infer<typeof signUpFormSchema>):
  Promise<ActionResult<void, SignUpError>> {
  const validation = signUpFormSchema.safeParse(values);

  if (!validation.success) {
    return actionErr({
      message: "Invalid form data: " + validation.error.message,
      code: "INVALID_FORM",
    });
  }

  const user = signUpUser({
    email: values.email,
    password: values.password
  });

  const insertedUser = user
    .andThen((user) =>
      insertUser({
        username: values.username,
        knumber: values.knumber,
        auth_user_uuid: user.id,
      })
    );

  const insertedRole = user
    .andThen((user) => 
      insertRole({
        role: "player",
        user_uuid: user.id,
      })
    );

  const insertedPlayer = user
    .andThen((user) =>
      insertPlayer({
        user_uuid: user.id,
        level: 1,
      })
    );

  const result = ResultAsync.combine([insertedUser, insertedRole, insertedPlayer]);
  return resultAsyncToActionResult(result);
}