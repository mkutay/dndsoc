"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { signUpFormSchema } from "../schemas";

export async function signUpAction(values: z.infer<typeof signUpFormSchema>) {
  const validation = signUpFormSchema.safeParse(values);

  if (!validation.success) {
    return encodedRedirect("error", "/sign-up", validation.error.message);
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
}