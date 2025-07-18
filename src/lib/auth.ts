import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";

import type { EmailOtpType } from "@supabase/supabase-js";
import { getOrigin } from "./origin";
import { insertUser } from "./users";
import { insertRole } from "./roles";
import { insertPlayer } from "./players";
import { createClient } from "@/utils/supabase/server";

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
          } as ExchangeCodeError),
    );

// Sends a confirmation email to the user after signing up, only if there is an inital sign up being done.
// Otherwise, it does nothing, and doesn't return an error.
export const resendConfirmationEmail = ({ email, redirectTo }: { email: string; redirectTo: string }) =>
  createClient()
    .andThen((supabase) =>
      fromSafePromise(
        supabase.auth.resend({
          type: "signup",
          email: email,
          options: {
            emailRedirectTo: redirectTo,
          },
        }),
      ),
    )
    .andThen(() => okAsync());

type VerifyOtpError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const verifyOtp = ({ type, tokenHash }: { type: EmailOtpType; tokenHash: string }) =>
  createClient()
    .andThen((supabase) => fromSafePromise(supabase.auth.verifyOtp({ type, token_hash: tokenHash })))
    .andThen((response) =>
      !response.error
        ? okAsync(response.data)
        : errAsync({
            message: "Failed to verify OTP (in supabase): " + response.error.message,
            code: "DATABASE_ERROR",
          } as VerifyOtpError),
    );

type GetUserError = {
  message: string;
  code: "DATABASE_ERROR" | "NOT_LOGGED_IN";
};

export const getUser = () =>
  createClient()
    .andThen((supabase) => fromSafePromise(supabase.auth.getUser()))
    .andThen((response) =>
      !response.error
        ? okAsync(response.data)
        : response.error.message.includes("session missing")
          ? errAsync({
              message: "Failed to get user (in supabase): " + response.error.message,
              code: "NOT_LOGGED_IN",
            } as GetUserError)
          : errAsync({
              message: "Failed to get user (in supabase): " + response.error.message,
              code: "DATABASE_ERROR",
            } as GetUserError),
    )
    .map((data) => data.user);

/**
 * Signed up and authenticated user, so insert role and player into database
 * by getting the userid from the username.
 */
export const completeSignUp = () => {
  const user = getUser();

  const insertedUser = user.andThen((user) =>
    insertUser({
      username: user.user_metadata.username,
      knumber: user.user_metadata.knumber,
      name: user.user_metadata.name,
      email: user.user_metadata.email,
      auth_user_uuid: user.id,
    }),
  );

  const insertedRole = insertedUser.andThen((user) =>
    insertRole({
      role: "player",
      auth_user_uuid: user.auth_user_uuid,
    }),
  );

  return insertedRole.andThen((user) =>
    insertPlayer({
      auth_user_uuid: user.auth_user_uuid,
      level: 1,
    }),
  );
};

type SignUpUserError = {
  message: string;
  code: "DATABASE_ERROR" | "USER_NOT_FOUND";
};

export const signUpUser = ({
  email,
  password,
  username,
  knumber,
}: {
  email: string;
  password: string;
  username: string;
  knumber: string;
}) =>
  ResultAsync.combine([getOrigin(), createClient()])
    .andThen(([origin, supabase]) =>
      fromSafePromise(
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/my`,
            data: {
              username,
              knumber,
              name: username, // For now, we use username as the name
              siteUrl: origin, // Here, for preview and production deployments
              email,
            },
          },
        }),
      ),
    )
    .andThen((result) =>
      !result.error
        ? okAsync(result.data)
        : errAsync({
            message: "Failed to sign up (Supabase error): " + result.error.message,
            code: "DATABASE_ERROR",
          } as SignUpUserError),
    )
    .andThen((data) =>
      data.user
        ? okAsync(data.user)
        : errAsync({
            message: "User not found.",
            code: "USER_NOT_FOUND",
          } as SignUpUserError),
    );
