import { runQuery } from "@/utils/supabase-run";

export const getCampaign = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("campaigns")
      .select("*, character_campaigns(*, characters(*))")
      .eq("shortened", shortened)
      .single(),
    "getCampaign"
  )