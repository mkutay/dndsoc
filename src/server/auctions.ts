"use server";

import { revalidatePath } from "next/cache";
import type z from "zod";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { runQuery } from "@/utils/supabase-run";
import { getDMUser } from "@/lib/dms";
import { buyThingySchema } from "@/config/auction";
import { parseSchema } from "@/utils/parse-schema";

export const createTrade = async (values: z.infer<typeof buyThingySchema>, shortened: string) =>
  resultAsyncToActionResult(
    parseSchema(buyThingySchema, values).asyncAndThen((parsed) =>
      runQuery((supabase) => supabase.from("auction").select("*").eq("id", parsed.auctionId).single())
        .map((auction) => ({ auction, parsed }))
        .andThen(({ auction, parsed }) => {
          const newId = crypto.randomUUID();
          return runQuery((supabase) =>
            supabase.from("auction").insert({
              id: newId,
              status: "buy_request",
              valid: auction.valid,
              seller_amount: auction.seller_amount,
              buyer_amount: parsed.amount,
              buyer_thingy_id: parsed.thingyId,
              seller_thingy_id: auction.seller_thingy_id,
            }),
          ).map(() => ({ newId, parsed }));
        })
        .andThen(({ newId, parsed }) =>
          runQuery((supabase) =>
            supabase.from("auction").update({ next: newId, valid: false }).eq("id", parsed.auctionId),
          ).map(() => parsed),
        )
        .andThen((parsed) =>
          runQuery((supabase) => supabase.from("thingy").update({ public: true }).eq("id", parsed.thingyId)),
        )
        .andTee(() => {
          revalidatePath("/auctions/" + shortened, "page");
        }),
    ),
  );

export const approveAuction = async ({ id }: { id: string }) =>
  resultAsyncToActionResult(
    getDMUser()
      .andThen((dm) =>
        runQuery((supabase) => supabase.from("auction").select("*").eq("id", id).single()).map((result) => ({
          dm,
          auction: result,
        })),
      )
      .andThen(({ dm, auction }) => {
        const newId = crypto.randomUUID();
        return runQuery((supabase) =>
          supabase
            .from("auction")
            .insert({
              id: newId,
              status: "listing_approved",
              decision_by: dm.id,
              valid: auction.valid,
              seller_amount: auction.seller_amount,
              buyer_amount: auction.buyer_amount,
              buyer_thingy_id: auction.buyer_thingy_id,
              seller_thingy_id: auction.seller_thingy_id,
            })
            .eq("id", id),
        ).map(() => newId);
      })
      .andThen((newId) =>
        runQuery((supabase) => supabase.from("auction").update({ next: newId, valid: false }).eq("id", id)),
      )
      .andTee(() => {
        revalidatePath("/manage-auctions");
      }),
  );

export const rejectAuction = async ({ id }: { id: string }) =>
  resultAsyncToActionResult(
    getDMUser()
      .andThen((dm) =>
        runQuery((supabase) => supabase.from("auction").select("*").eq("id", id).single()).map((result) => ({
          dm,
          auction: result,
        })),
      )
      .andThen(({ dm, auction }) => {
        const newId = crypto.randomUUID();
        return runQuery((supabase) =>
          supabase
            .from("auction")
            .insert({
              id: newId,
              status: "listing_rejected",
              decision_by: dm.id,
              valid: auction.valid,
              seller_amount: auction.seller_amount,
              buyer_amount: auction.buyer_amount,
              buyer_thingy_id: auction.buyer_thingy_id,
              seller_thingy_id: auction.seller_thingy_id,
            })
            .eq("id", id),
        ).map(() => newId);
      })
      .andThen((newId) =>
        runQuery((supabase) => supabase.from("auction").update({ next: newId, valid: false }).eq("id", id)),
      )
      .andTee(() => {
        revalidatePath("/manage-auctions");
      }),
  );
