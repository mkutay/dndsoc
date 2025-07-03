import { createClient as supaCreateClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { ResultAsync } from "neverthrow";
import { cookies } from "next/headers";

import { type Database } from "@/types/database.types";
import { env } from "@/env";

export const createAsyncClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.warn(error);
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

const createBasicClient = async () =>
  supaCreateClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

type CreateClientError = {
  message: string;
  code: "SUPABASE_CLIENT_ERROR";
};

export const createClient = () =>
  ResultAsync.fromPromise(
    process.env.MODE === "test" || env.BUILDING === "true" ? createBasicClient() : createAsyncClient(),
    (error) =>
      ({
        message: "Failed to create Supabase client." + error,
        code: "SUPABASE_CLIENT_ERROR",
      }) as CreateClientError,
  );
