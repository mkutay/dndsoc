import { createBrowserClient } from "@supabase/ssr";
import { ok } from "neverthrow";

import { type Database } from "@/types/database.types";
import { env } from "@/env";

export const createClient = () => ok(createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY));
