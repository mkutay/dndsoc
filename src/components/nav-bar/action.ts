"use server";

import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { ActionResult, resultAsyncToActionResult } from "@/types/error-typing";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type SignOutError = {
  message: string;
  code: "SUPABASE_CLIENT_ERROR" | "DATABASE_ERROR";
};

export const signOutAction = async (): Promise<ActionResult<void, SignOutError>> => {
  const supabase = createClient();

  const result = supabase.andThen((supabase) =>
    ResultAsync.fromPromise(supabase.auth.signOut(), () => ({
      message: "Failed to sign out.",
      code: "DATABASE_ERROR",
    } as SignOutError)),
  ).andThen((response) => {
    if (response.error) {
      return errAsync({
        message: response.error.message,
        code: "DATABASE_ERROR",
      } as SignOutError);
    }
    return okAsync(undefined);
  });

  return resultAsyncToActionResult(result);
};

export const signOut = async () => {
  const result = await signOutAction();
  if (result.ok) {
    console.log("Sign out successful");
  } else {
    // Handle error
    console.error(result.error.message);
    redirect("/");
  }
};