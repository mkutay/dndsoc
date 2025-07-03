"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { redirect } from "next/navigation";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";

type SignOutError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const signOutAction = async () =>
  resultAsyncToActionResult(
    createClient()
      .andThen((supabase) => ResultAsync.fromSafePromise(supabase.auth.signOut()))
      .andThen((response) =>
        !response.error
          ? okAsync()
          : errAsync({
              message: response.error.message,
              code: "DATABASE_ERROR",
            } as SignOutError),
      )
      .andTee(() => redirect("/")),
  );
