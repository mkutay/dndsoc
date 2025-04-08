import { beforeAll, expect, test, describe } from 'vitest';
import { createClient as supaCreateClient } from "@supabase/supabase-js";

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/database.types';

export const supabaseServiceRole = supaCreateClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

describe("authenticated user", () => {
  beforeAll(async () => {
    await signInUser();
  });

  test("insert user", async () => {
  });
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
    email: process.env.TEST_USER_EMAIL!,
    password: process.env.TEST_USER_PASSWORD!,
  })
  expect(error).toBeNull()
  expect(session).not.toBeNull()
  expect(await supabase.auth.getSession()).not.toBeNull()
}