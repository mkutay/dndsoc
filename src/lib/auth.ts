import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { getOrigin } from "./origin";
import { insertUser } from "./users";
import { insertRole } from "./roles";
import { insertPlayer } from "./players";

type ExchangeCodeError = {
  message: string;
  code: "DATABASE_ERROR";
};

// This function exchanges an auth code for the user's session.
export const exchangeCodeForSession = (code: string) => 
  createClient()
    .andThen((supabase) => fromSafePromise(supabase.auth.exchangeCodeForSession(code)))
    .andThen((response) => 
      !response.error
        ? okAsync()
        : errAsync({
            message: "Failed to exchange code for session (in supabase): " + response.error.message,
            code: "DATABASE_ERROR",
          } as ExchangeCodeError)
    );

type GetUserError = {
  message: string;
  code: "DATABASE_ERROR" | "USER_NOT_FOUND";
};

export const getUser = () =>
  createClient()
    .andThen((supabase) =>
      fromSafePromise(supabase.auth.getUser())
    )
    .andThen((response) => !response.error
      ? okAsync(response.data)
      : errAsync({
          message: "Failed to get user (in supabase): " + response.error.message,
          code: "DATABASE_ERROR",
        } as GetUserError)
    )
    .map((data) => data.user);

/**
 * Signed up and authenticated user, so insert role and player into database
 * by getting the userid from the username.
 */
export const completeSignUp = () => {
  const user = getUser();

  const insertedUser = user.andThen((user) => insertUser({
    username: user.user_metadata.username,
    knumber: user.user_metadata.knumber,
    name: user.user_metadata.name,
    auth_user_uuid: user.id,
  }));

  const insertedRole = user.andThen((user) => insertRole({
    role: "player",
    auth_user_uuid: user.id,
  }));

  const insertedPlayer = user.andThen((user) => insertPlayer({
    auth_user_uuid: user.id,
    level: 1,
  }));

  return ResultAsync.combine([insertedUser, insertedRole, insertedPlayer]);
};

type SignUpUserError = {
  message: string;
  code: "DATABASE_ERROR" | "USER_NOT_FOUND";
};

export const signUpUser = ({
  email, password, username, knumber, name,
}: {
  email: string; password: string; username: string; knumber: string; name: string;
}) => ResultAsync
  .combine([getOrigin(), createClient()])
  .andThen(([origin, supabase]) => 
    fromSafePromise(
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?type=signup`,
          data: {
            username,
            knumber,
            name,
          },
        },
      })
    )
  )
  .andThen((result) => !result.error
    ? okAsync(result.data)
    : errAsync({
        message: "Failed to sign up (Supabase error): " + result.error.message,
        code: "DATABASE_ERROR",
      } as SignUpUserError)
  )
  .andThen((data) => data.user
    ? okAsync(data.user)
    : errAsync({
        message: "User not found.",
        code: "USER_NOT_FOUND",
      } as SignUpUserError)
  );