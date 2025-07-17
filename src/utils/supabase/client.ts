import { createBrowserClient } from "@supabase/ssr";
import { ok } from "neverthrow";

import { type Database } from "@/types/database.types";
import { env } from "@/env";

export const createClient = () =>
  ok(createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
