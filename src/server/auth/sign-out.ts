"use server";

import { errAsync, fromSafePromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { resultAsyncToActionResult } from "@/types/error-typing";

type SignOutError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const signOutAction = async () =>
  resultAsyncToActionResult(
    createClient()
      .andThen((supabase) => fromSafePromise(supabase.auth.signOut()))
      .andThen((response) =>
        !response.error
          ? okAsync()
          : errAsync({
              message: response.error.message,
              code: "DATABASE_ERROR",
            } as SignOutError),
      ),
  );
