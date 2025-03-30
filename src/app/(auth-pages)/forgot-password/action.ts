"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { forgotPasswordFormSchema } from "../schemas";

export const forgotPasswordAction = async (values: z.infer<typeof forgotPasswordFormSchema>) => {
  const validation = forgotPasswordFormSchema.safeParse(values);
  if (!validation.success) {
    const errorMessage = validation.error.message;
    return encodedRedirect("error", "/forgot-password", errorMessage);
  }

  const { email } = values;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};