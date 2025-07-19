"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth";
import { runQuery } from "@/utils/supabase-run";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { sendAssociatesRequestApprovedEmail } from "@/lib/email";

export const rejectAssociatesRequest = async ({ id }: { id: string }) =>
  resultAsyncToActionResult(
    getUser()
      .andThen((user) =>
        runQuery((supabase) =>
          supabase.from("associates_requests").update({ status: "denied", decision_by: user.id }).eq("id", id),
        ),
      )
      .andTee(() => {
        revalidatePath("/my");
        revalidatePath("/associates-requests");
      }),
  );

export const approveAssociatesRequest = async ({ id }: { id: string }) =>
  resultAsyncToActionResult(
    getUser()
      .andThen((user) =>
        runQuery((supabase) =>
          supabase
            .from("associates_requests")
            .update({ status: "approved", decision_by: user.id })
            .eq("id", id)
            .select("email, name, id")
            .single(),
        ),
      )
      .andThen(sendAssociatesRequestApprovedEmail)
      .andTee(() => {
        revalidatePath("/my");
        revalidatePath("/associates-requests");
      }),
  );
