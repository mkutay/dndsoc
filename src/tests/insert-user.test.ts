import { beforeAll, expect, test, describe } from 'vitest';
import { createClient as supaCreateClient } from "@supabase/supabase-js";

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/database.types';
import { insertUser } from '@/lib/users/insert';
import { getUser } from '@/lib/auth/user';

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
    const user = await getUser();
    if (user.isErr()) {
      console.error(user.error.message);
      return expect(user.isOk()).toBe(true);
    }

    const inserted = await insertUser({
      username: "testuser",
      knumber: "K12345678",
      auth_user_uuid: user.value.id,
    });
    if (inserted.isErr()) {
      console.error(inserted.error.message);
      return expect(inserted.isOk()).toBe(true);
    }
    const data = inserted.value;

    expect(inserted.isOk()).toBe(true);
    expect(data).not.toBeNull();
    expect(data.username).toEqual("testuser");
    expect(data.knumber).toEqual("K12345678");

    const { data: deleted, error } = await supabaseServiceRole
      .from("users")
      .delete()
      .eq("id", data.id)
      .select("*");
    
    expect(error).toBeNull();
    expect(deleted).not.toBeNull();
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