"use server";

import { revalidatePath } from "next/cache";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { runQuery } from "@/utils/supabase-run";
import { getDMUser } from "@/lib/dms";

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
              amount: auction.amount,
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
              amount: auction.amount,
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
