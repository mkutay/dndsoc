import type z from "zod";
import { okAsync } from "neverthrow";

import type { associatesSignUpFormSchema } from "@/config/auth-schemas";
import { runQuery } from "@/utils/supabase-run";

export const sendAssociatesSignUpRequest = (values: z.infer<typeof associatesSignUpFormSchema>) => {
  const id = crypto.randomUUID();
  return runQuery((supabase) =>
    supabase.from("associates_requests").insert({
      email: values.email,
      notes: values.notes,
      name: values.name,
      id,
    }),
  ).andThen(() => okAsync({ id }));
};
