"use server";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { runQuery } from "@/utils/supabase-run";
import { upload } from "@/lib/storage";

export const uploadImageParty = async ({
  blob,
  file,
  partyId,
  partyShortened,
}: {
  blob: Blob;
  file: File;
  partyId: string;
  partyShortened: string;
}) => resultAsyncToActionResult(
  upload({
    blob,
    file,
    shortened: partyShortened,
  })
    .andThen(({ id }) =>
      runQuery((supabase) => supabase
        .from("parties")
        .update({ image_uuid: id })
        .eq("id", partyId)
        .select("name")
        .single()
      )
    )
)