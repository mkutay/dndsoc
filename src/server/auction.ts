"use server";

import type z from "zod";

import { addToAuctionSchema } from "@/config/auction";
import { runQuery } from "@/utils/supabase-run";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";

export const setUpForAuction = async (values: z.infer<typeof addToAuctionSchema>) =>
  resultAsyncToActionResult(
    parseSchema(addToAuctionSchema, values)
      .asyncAndThrough((parsed) =>
        runQuery((supabase) =>
          supabase.from("auction").insert({
            seller_thingy_id: parsed.thingyId,
            amount: parsed.amount,
            status: "created",
          }),
        ),
      )
      .andThen(({ thingyId }) =>
        runQuery((supabase) => supabase.from("thingy").update({ public: true }).eq("id", thingyId)),
      ),
  );
