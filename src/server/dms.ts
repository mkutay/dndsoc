"use server";

import { revalidatePath } from "next/cache";
import { okAsync } from "neverthrow";
import { z } from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { playersEditSchema } from "@/config/player-edit-schema";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { DMEditSchema } from "@/config/dms";
import { uploadImageDM } from "@/lib/storage";

export const updateDM = async (values: z.infer<typeof DMEditSchema>, dmUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(playersEditSchema, values)
      .asyncAndThen(() =>
        runQuery((supabase) =>
          supabase
            .from("dms")
            .update({
              about: values.about,
            })
            .eq("id", dmUuid)
            .select("users(username)")
            .single(),
        ),
      )
      .andThen(({ users }) =>
        values.avatar
          ? uploadImageDM({
              file: values.avatar,
              shortened: users.username,
              DMId: dmUuid,
            })
          : okAsync(),
      ),
  );

export const removePartyFromDM = async ({
  partyId,
  dmUuid,
  revalidate,
}: {
  partyId: string;
  dmUuid: string;
  revalidate: string;
}) =>
  resultAsyncToActionResult(
    runQuery((supabase) => supabase.from("dm_party").delete().eq("party_id", partyId).eq("dm_id", dmUuid)).andThen(
      () => {
        revalidatePath(revalidate, "page");
        return okAsync();
      },
    ),
  );

export const addPartyToDM = async ({
  partyId,
  dmUuid,
  revalidate,
}: {
  partyId: string;
  dmUuid: string;
  revalidate: string;
}) =>
  resultAsyncToActionResult(
    runQuery((supabase) =>
      supabase
        .from("dm_party")
        .insert({
          party_id: partyId,
          dm_id: dmUuid,
        })
        .select(),
    ).andThen(() => {
      revalidatePath(revalidate, "page");
      return okAsync();
    }),
  );
