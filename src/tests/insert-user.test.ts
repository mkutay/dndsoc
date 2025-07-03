// BAD TEST

import { beforeAll, expect, test, describe } from "vitest";
import { createClient as supaCreateClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";
import { type Database } from "@/types/database.types";
import { env } from "@/env";

export const supabaseServiceRole = supaCreateClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
  },
});

describe("authenticated user", () => {
  beforeAll(async () => {
    await signInUser();
  });

  test("insert user", async () => {});
});

export async function signInUser() {
  const supabaseResult = await createClient();
  if (supabaseResult.isErr()) {
    console.error(supabaseResult.error.message);
    return;
  }
  const supabase = supabaseResult.value;
  const {
    error,
    data: { session },
  } = await supabase.auth.signInWithPassword({
    email: "player@kcl.ac.uk",
    password: "123345",
  });
  expect(error).toBeNull();
  expect(session).not.toBeNull();
  expect(await supabase.auth.getSession()).not.toBeNull();
}
