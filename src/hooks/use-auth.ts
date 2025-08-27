"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type z from "zod";

import { actionResultToResult } from "@/types/error-typing";
import { signOutAction } from "@/server/auth/sign-out";
import { signInAction } from "@/server/auth/sign-in";
import type { signInFormSchema } from "@/config/auth-schemas";
import { isLoggedInAction } from "@/server/auth/auth";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    isLoggedInAction().then(setIsLoggedIn);
  }, []);

  const signOut = async () =>
    actionResultToResult(await signOutAction()).andTee(() => {
      setIsLoggedIn(false);
      router.refresh();
    });

  const signIn = async (values: z.infer<typeof signInFormSchema>) =>
    actionResultToResult(await signInAction(values)).andTee(() => {
      setIsLoggedIn(true);
    });

  return {
    isLoggedIn,
    signOut,
    signIn,
  };
}
