"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { signInFormSchema } from "../schemas";

export const signInAction = async (values: z.infer<typeof signInFormSchema>) => {
  const validation = signInFormSchema.safeParse(values);
  if (!validation.success) {
    const errorMessage = validation.error.message;
    return encodedRedirect("error", "/sign-in", errorMessage);
  }
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};