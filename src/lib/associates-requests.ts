import { okAsync } from "neverthrow";
import type z from "zod";

import type { associatesSignUpFormSchema } from "@/config/auth-schemas";
import { runQuery } from "@/utils/supabase-run";

export const sendAssociatesSignUpRequest = (values: z.infer<typeof associatesSignUpFormSchema>) => {
  const id = crypto.randomUUID();
  return runQuery((supabase) =>
    supabase.from("associates_requests").insert({
      ...values,
      id,
    }),
  ).andThen(() => okAsync({ id }));
};
