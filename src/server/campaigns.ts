"use server";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { runQuery } from "@/utils/supabase-run";
import { okAsync } from "neverthrow";
import { revalidatePath } from "next/cache";

export const removeCampaignFromParty = async ({
  campaignId,
  partyId,
  shortened,
}: {
  campaignId: string;
  partyId: string;
  shortened: string;
}) => resultAsyncToActionResult(
  runQuery((supabase) =>
    supabase
      .from("party_campaigns")
      .delete()
      .eq("party_id", partyId)
      .eq("campaign_id", campaignId),
    "removeCampaignFromParty"
  )
  .andThen(() => {
    revalidatePath(`/parties/${shortened}`, "page");
    return okAsync();
  })
);

// There is no validation that the ids are correct
export const addCampaignToParty = async ({
  campaignId,
  partyId,
  shortened,
}: {
  campaignId: string;
  partyId: string;
  shortened: string;
}) => resultAsyncToActionResult(
  runQuery((supabase) =>
    supabase
      .from("party_campaigns")
      .insert({
        party_id: partyId,
        campaign_id: campaignId,
      }),
    "addCampaignToParty"
  )
  .andThen(() => {
    revalidatePath(`/parties/${shortened}`, "page");
    return okAsync();
  })
);