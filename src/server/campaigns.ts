"use server";

import { revalidatePath } from "next/cache";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { runQuery } from "@/utils/supabase-run";

export const removeCampaignFromParty = async ({
  campaignId,
  partyId,
  shortened,
}: {
  campaignId: string;
  partyId: string;
  shortened: string;
}) =>
  resultAsyncToActionResult(
    runQuery(
      (supabase) => supabase.from("party_campaigns").delete().eq("party_id", partyId).eq("campaign_id", campaignId),
      "removeCampaignFromParty",
    ).andTee(() => revalidatePath(`/parties/${shortened}`, "page")),
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
}) =>
  resultAsyncToActionResult(
    runQuery(
      (supabase) =>
        supabase.from("party_campaigns").insert({
          party_id: partyId,
          campaign_id: campaignId,
        }),
      "addCampaignToParty",
    ).andTee(() => revalidatePath(`/parties/${shortened}`, "page")),
  );
