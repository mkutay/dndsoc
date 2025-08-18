import { createClient as supaCreateClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { ResultAsync } from "neverthrow";
import { cookies } from "next/headers";

import { type Database } from "@/types/database.types";
import { env } from "@/env";

export const createPublicClientAsync = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {}
      },
    },
  });
};

export const createServiceClientAsync = async () => {
  return supaCreateClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const createPublicClient = () =>
  ResultAsync.fromPromise(
    createPublicClientAsync(),
    (error) =>
      ({
        message: "Failed to create Supabase public client." + error,
        code: "SUPABASE_CLIENT_ERROR",
      }) as CreateClientError,
  );

export const createServiceClient = () =>
  ResultAsync.fromPromise(
    createServiceClientAsync(),
    (error) =>
      ({
        message: "Failed to create Supabase service client." + error,
        code: "SUPABASE_CLIENT_ERROR",
      }) as CreateClientError,
  );

type CreateClientError = {
  message: string;
  code: "SUPABASE_CLIENT_ERROR";
};

export const createClient = () =>
  env.MODE === "test" || env.BUILDING === "true" ? createServiceClient() : createPublicClient();
