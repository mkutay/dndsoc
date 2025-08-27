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
            seller_amount: parsed.amount,
            status: "created",
          }),
        ),
      )
      .andThen(({ thingyId }) =>
        runQuery((supabase) => supabase.from("thingy").update({ public: true }).eq("id", thingyId)),
      ),
  );

export const approveBuyRequest = async (auctionId: string) =>
  resultAsyncToActionResult(
    runQuery((supabase) => supabase.from("auction").select("*").eq("id", auctionId).single())
      .andThen((auction) => {
        const newId = crypto.randomUUID();
        return runQuery((supabase) =>
          supabase
            .from("auction")
            .insert({
              id: newId,
              status: "signed_off",
              valid: auction.valid,
              seller_amount: auction.seller_amount,
              buyer_amount: auction.buyer_amount,
              buyer_thingy_id: auction.buyer_thingy_id,
              seller_thingy_id: auction.seller_thingy_id,
            })
            .eq("id", auctionId),
        ).map(() => newId);
      })
      .andThen((newId) =>
        runQuery((supabase) => supabase.from("auction").update({ next: newId, valid: false }).eq("id", auctionId)),
      ),
  );

export const rejectBuyRequest = async (auctionId: string) =>
  resultAsyncToActionResult(
    runQuery((supabase) => supabase.from("auction").select("*").eq("id", auctionId).single())
      .andThen((auction) => {
        const newId = crypto.randomUUID();
        return runQuery((supabase) =>
          supabase
            .from("auction")
            .insert({
              id: newId,
              status: "buy_request_rejected",
              valid: auction.valid,
              seller_amount: auction.seller_amount,
              buyer_amount: auction.buyer_amount,
              buyer_thingy_id: auction.buyer_thingy_id,
              seller_thingy_id: auction.seller_thingy_id,
            })
            .eq("id", auctionId),
        ).map(() => newId);
      })
      .andThen((newId) =>
        runQuery((supabase) => supabase.from("auction").update({ next: newId, valid: false }).eq("id", auctionId)),
      ),
  );
