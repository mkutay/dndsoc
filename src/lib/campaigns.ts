import { runQuery } from "@/utils/supabase-run";

export const getCampaigns = () => 
  runQuery((supabase) =>
    supabase
      .from("campaigns")
      .select("*"),
    "getCampaigns"
  );