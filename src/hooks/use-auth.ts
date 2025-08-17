"use client";

import { errAsync, fromSafePromise, okAsync } from "neverthrow";
import type { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

type SignOutError = {
  message: string;
  code: "DATABASE_ERROR";
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await createClient()
        .asyncAndThen((supabase) => fromSafePromise(supabase.auth.getSession()))
        .andTee(({ data: { session } }) => {
          setUser(session?.user ?? null);
        });
    })();
  }, [pathname]);

  const signOut = () =>
    createClient()
      .asyncAndThen((supabase) => fromSafePromise(supabase.auth.signOut()))
      .andThen((response) =>
        !response.error
          ? okAsync()
          : errAsync({
              message: response.error.message,
              code: "DATABASE_ERROR",
            } as SignOutError),
      )
      .andTee(() => {
        if (pathname.includes("/my")) {
          router.push("/");
        }
        setUser(null);
      });

  return {
    user,
    isLoggedIn: !!user,
    signOut,
  };
}
