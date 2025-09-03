import { okAsync, safeTry } from "neverthrow";

import type { Enums } from "@/types/database.types";
import { supabaseRun } from "@/utils/supabase-run";
import { createClient } from "@/utils/supabase/server";

export const updateAuction = (
  auctionId: string,
  {
    status,
    seller_amount,
    seller_thingy_id,
  }: {
    status: Enums<"auction_status">;
    seller_amount: number;
    seller_thingy_id: string;
  },
) =>
  safeTry(async function* () {
    const newId = crypto.randomUUID();
    const supabase = yield* await createClient();

    yield* await supabaseRun(
      supabase.from("auctions").insert({
        id: newId,
        status,
        seller_amount,
        seller_thingy_id,
      }),
      "UPDATE_AUCTION",
    );

    yield* await supabaseRun(
      supabase.from("auctions").update({ next: newId }).eq("id", auctionId),
      "CLOSE_OLD_AUCTION",
    );

    return okAsync({ newId });
  });

export const updateAuctionOffersOfAuction = ({
  oldAuctionId,
  newAuctionId,
  status,
}: {
  oldAuctionId: string;
  newAuctionId: string;
  status?: Enums<"auction_offer_status">;
}) =>
  safeTry(async function* () {
    const supabase = yield* await createClient();

    const offers = yield* await supabaseRun(
      supabase.from("auction_offers").select().eq("auction_id", oldAuctionId),
      "CLOSE_OLD_OFFERS",
    );

    for (const offer of offers) {
      const newOfferId = crypto.randomUUID();

      yield* await supabaseRun(
        supabase.from("auction_offers").insert({
          id: newOfferId,
          auction_id: newAuctionId,
          thingy_id: offer.thingy_id,
          amount: offer.amount,
          status: status ?? offer.status,
        }),
        "INSERT_NEW_OFFER",
      );

      yield* await supabaseRun(
        supabase.from("auction_offers").update({ next: newOfferId }).eq("id", offer.id),
        "CLOSE_OLD_OFFER",
      );
    }

    return okAsync();
  });
