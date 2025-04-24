import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { runQueryUser } from "@/utils/supabase-run";
import { getOrigin } from "./origin";
import DB from "./db";

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

export const getUser = () =>
  runQueryUser((supabase) =>
    supabase.auth.getUser(),
    "getUser"
  )
  .map((response) => response.user);

/**
 * Signed up and authenticated user, so insert role and player into database
 * by getting the userid from the username.
 */
export const completeSignUp = () => {
  const user = getUser();

  const insertedUser = user.andThen((user) => DB.Users.Insert({
    username: user.user_metadata.username,
    knumber: user.user_metadata.knumber,
    auth_user_uuid: user.id,
  }));

  const insertedRole = user.andThen((user) => DB.Roles.Insert({
    role: "player",
    auth_user_uuid: user.id,
  }));

  const insertedPlayer = user.andThen((user) => DB.Players.Insert({
    auth_user_uuid: user.id,
    level: 1,
  }));

  return ResultAsync.combine([insertedUser, insertedRole, insertedPlayer]);
};

type SignUpUserError = {
  message: string;
  code: "DATABASE_ERROR" | "USER_NOT_FOUND";
};

export const signUpUser = ({ email, password, username, knumber }: { email: string; password: string; username: string; knumber: string; }) => ResultAsync
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